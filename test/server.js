var fs = require('fs');
var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');
var open = require('open');
var ip = require('ip');

function launchServer(port, path) {
    var app = express();
    app.use(cookieParser());
    app.use(function (req, res, next) {
        if (req.path.endsWith('.html')) {
            res.cookie(req.hostname.replace(/\./g, '_'), Math.floor(Math.random() * 10000), {
                maxAge: 1000 * 60 * 5 // expire after 5 minutes
            });
        }
        next();
    });
    app.use(express.static(path));
    console.log(`Listening to ${port}`);
    return app.listen(port);
}

launchServer(4010, 'test');
launchServer(4011, 'src');
launchServer(4012, 'dist');

var ipAddr = ip.address();
console.log(`ip: ${ipAddr}`);
open(`http://${ipAddr}:4010/page.html`);
