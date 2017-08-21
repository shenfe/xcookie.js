const fs = require('fs');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const open = require('open');
const ip = require('ip');

function launchServer(port, path) {
    let app = express();
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

let ipAddr = ip.address();
console.log(`ip: ${ipAddr}`);
open(`http://${ipAddr}:4010/page.html`);
