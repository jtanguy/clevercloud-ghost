// # Ghost Configuration

var path = require('path');
var env = require('common-env')();

var config = env.getOrElseAll({
    production: {
        url: {
         $aliases: ['BLOG_URL']
        },
        mail: {
            transport: 'SMTP',
            options: {
                service: 'Mailgun',
                auth: {
                    user: {
                        $aliases: ['MAILGUN_SMTP_LOGIN']
                    },
                    pass: {
                        $aliases: ['MAILGUN_SMTP_PASSWORD']
                    }
                }
            }
        },
        database: {
            client: 'pg',
            connection: {
                host     : {
                    $aliases: ['POSTGRESQL_ADDON_HOST']
                },
                user     : {
                    $aliases: ['POSTGRESQL_ADDON_USER']
                },
                password : {
                    $aliases: ['POSTGRESQL_ADDON_PASSWORD']
                },
                database : {
                    $aliases: ['POSTGRESQL_ADDON_DB']
                },
            },
            charset  : 'utf8',
            pool: {
                min: {
                    $aliases: ['POSTGRESQL_ADDON_MIN_CONNECTIONS'],
                    $default: 1
                },
                max: {
                    $aliases: ['POSTGRESQL_ADDON_MAX_CONNECTIONS'],
                    $default: 3
                }
            }
        },
        storage: {
            active: 'cellar',
            cellar: {
                accessKeyId: {
                    $aliases: ['CELLAR_ADDON_KEY_ID']
                },
                secretAccessKey: {
                    $aliases: ['CELLAR_ADDON_KEY_SECRET']
                },
                bucket: {
                    $aliases: ['CELLAR_BUCKET']
                },
                host: {
                    $aliases: ['CELLAR_ADDON_HOST']
                }
            }
        },
        paths: {
            contentPath: path.join(__dirname, 'content'),
        },
        server: {
            host: '0.0.0.0',
            port: {
                $default: 8080,
                $aliases: ['PORT']
            }
        },
        logging: false
    }

});

module.exports = config;
