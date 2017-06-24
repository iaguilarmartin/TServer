'use strict';

const generator = require('./libs/tiles-generator');
const cluster = require('cluster');
const http = require('http');
const os = require('os');
const urlParser = require('url');

const portNumber = process.env.PORT || 8888;

if (cluster.isMaster) {
    for (const _ of os.cpus()) {
        cluster.fork();
    }
} else {
    runServer();
}

function runServer() {
    const server = http.createServer((req, res) => {
        const url = urlParser.parse(req.url);
        const params = getTileParameters(url);

        if (params === null || params.some(param => param === null)) {
            respondWithError(res, new Error("Bad request"), 400);
        } else {
            generator.generateImage(...params)
                .then(tile => respondWithTile(res, tile))
                .catch(err => respondWithError(res, err));
        }
    });

    server.on('listening', () => console.log(`Server listening on port ${portNumber}`));
    server.listen(portNumber);
}

function respondWithError(response, err, code = 500) {
    console.error(err);
    response.statusCode = code;
    response.end();
}

function respondWithTile(response, tile) {
    response.writeHead(200, {'Content-Type': 'image/png' });
    response.end(tile, 'binary');
}

function getTileParameters(url) {
    const path = url.path;
    if (!path.endsWith(".png") || path.split('/').length !== 5) {
        return null;
    }

    const params = path.substring(1, path.length - 4).split('/').map((param, index) => {
        if (index == 0) {
            return param;
        }

        return isNaN(parseInt(param)) ? null : parseInt(param);
    });

    return params;
}




