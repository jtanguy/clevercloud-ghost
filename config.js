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
                charset  : 'utf8'
            }
        },

        server: {
            host: '0.0.0.0',
            port: {
                $default: 8080,
                $aliases: ['PORT']
            }
        }
    }

});

module.exports = config;
