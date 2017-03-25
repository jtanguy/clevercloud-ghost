const path = require('path');
const ghost = require('ghost');
const express = require('express');
const path = require('path');

const wrapperApp = express();

ghost({
  config: path.join(__dirname, 'config.js')
}).then(function (ghostServer) {
    wrapperApp.get('/.well-known/keybase.txt', function(req, res, next) {
        res.sendFile(path.join(__dirname, 'well-known', 'keybase.txt'));
    });
    wrapperApp.use(ghostServer.config.paths.subdir, ghostServer.rootApp);

    ghostServer.start(wrapperApp);
});
