const path = require('path');
const ghost = require('ghost');
const express = require('express');

const wrapperApp = express();

ghost({
  config: path.join(__dirname, 'config.js')
}).then(function (ghostServer) {
    wrapperApp.use('/.well-known', express.static('well-known'));
    wrapperApp.use(ghostServer.config.paths.subdir, ghostServer.rootApp);
    ghostServer.start(wrapperApp);
});
