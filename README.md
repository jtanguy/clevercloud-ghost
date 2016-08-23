# devblog

This is a [Clever Cloud](https://www.clever-cloud.com)-ready packaging of [Ghost](https://ghost.org).

It is pre-configured for using Mailgun for emailing, PostgreSQL and Cellar for storing posts and assets.

In order to setup an instance:

1. create a NodeJS application, and a PostgreSQL and a Cellar addon
2. link both addons to the application
3. Add the following environment variables:

    - `BLOG_URL` The url of your blog
    - `NODE_ENV` Set it to `production`
    - `CELLAR_BUCKET` The name of the cellar bucket to store your assets
    - `MAILGUN_SMTP_LOGIN` The SMTP login of your mailgun account
    - `MAILGUN_SMTP_PASSWORD` The SMTP password of your mailgun account

4. Deploy
5. Profit
