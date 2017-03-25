'use strict';

// # Cellar storage module for Ghost blog http://ghost.org/
const fs = require('fs');
const path = require('path');
const Bluebird = require('bluebird');
const AWS = require('aws-sdk-promise');
const moment = require('moment');
const util = require('util');
const StorageBase = require('ghost/core/server/storage/base');

const readFileAsync = Bluebird.promisify(fs.readFile);
let options = {};
let client = null;

function CellarStore(config) {
    StorageBase.call(this);
    options = config;
    if(validOptions(config)){
        client =  new AWS.S3({
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
            bucket: config.bucket,
            signatureVersion: 'v2',
            endpoint: new AWS.Endpoint(config.host)
        })
    }
}

function validOptions(opts) {
    return (opts.accessKeyId &&
        opts.secretAccessKey &&
        opts.bucket &&
        opts.host);
}

util.inherits(CellarStore, StorageBase);

 /**
 * Return the URL where image assets can be read.
 * @param  {String} bucket [Cellar bucket name]
 * @return {String}        [path-style URL of the Cellar bucket]
 */
function getCellarPath(bucket) {
    var cellarPath = 'https://' + options.bucket + '.' + options.host + '/';
    return cellarPath;
}

function logError(error) {
    console.log('error in ghost-cellar', error);
};

function logInfo(info) {
    console.log('info in ghost-cellar', info);
};

function getTargetDir() {
    var now = moment();
    return now.format('YYYY/MM/');
};

function getTargetName(image, targetDir) {
    var ext = path.extname(image.name);
    var name = path.basename(image.name, ext).replace(/\W/g, '_');

    return targetDir + name + '-' + Date.now() + ext;
};

CellarStore.prototype.exists = function(name){
    if (client === null) {
        return Bluebird.reject('ghost-cellar is not configured');
    }
    var params = {
        Bucket: options.bucket,
        Key: name.path.replace(/^\//, '')
    };
    client.headObjectAsync(params)
        .then(() => true)
        .catch(() => false)
}

CellarStore.prototype.delete = function(name){
    if (client === null) {
        return Bluebird.reject('ghost-cellar is not configured');
    }
    var params = {
        Bucket: options.bucket,
        Key: name.path.replace(/^\//, '')
    };
    client.deleteObjectAsync(params)
        .then(() => true)
        .catch(() => false)
}

CellarStore.prototype.save = function(image) {
    if (client === null) {
      return Bluebird.reject('ghost-cellar is not configured');
    }
    var targetDir = getTargetDir();
    var targetFilename = getTargetName(image, targetDir);
    return readFileAsync(image.path)
        .then(function(buffer) {
            var params = {
                ACL: 'public-read',
                Bucket: options.bucket,
                Key: targetFilename,
                Body: buffer,
                ContentType: image.type,
                CacheControl: 'max-age=' + (1000 * 365 * 24 * 60 * 60) // 365 days
            };

            return client.putObject(params).promise();
        })
        .tap(function() {
            logInfo('ghost-cellar', 'Temp uploaded file path: ' + image.path);
        })
        .then(function(results) {
            var cellarPath = getCellarPath(options.bucket);
            return Bluebird.resolve(cellarPath + targetFilename);
        })
        .catch(function(err) {
            logError(err);
            throw err;
        });
};

// middleware for serving the files
CellarStore.prototype.serve = function() {
    if (client === null) {
      return Bluebird.reject('ghost-cellar is not configured');
    }
    return function (req, res, next) {
        var params = {
            Bucket: options.bucket,
            Key: req.path.replace(/^\//, '')
        };
        client.getObject(params)
            .on('httpHeaders', function(statusCode, headers, response) {
                res.set(headers);
            })
            .createReadStream()
            .on('error', function(err) {
                logError(err);
                res.status(404);
                next();
            })
            .pipe(res);
    };
};

module.exports = CellarStore;
