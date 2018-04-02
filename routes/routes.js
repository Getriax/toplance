const   fs      = require('fs'),
    path    = require('path'),
    express = require('express');

class Router {

    constructor() {
    }

    //Called once during initial server startup
    load(url, object, app) {
        url = /api/ + url;

        const router = express.Router();

        const controller = new object(router);

        app.use(url, router);
        
    }

}

module.exports = new Router();
