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
        const params = parseURLParameters(url);

        if (!params) {
            respondWithError(res, new Error('Bad request'), 400);
        } else {
            generator.generateImage(params.layer, params.z, params.x, params.y)
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

function parseURLParameters(url) {
    const path = url.path;
    if (!path.endsWith('.png') || path.split('/').length !== 5) {
        return null;
    }

    let [,layer, z, x, y ] = path.split('/');

    z = parseInt(z);
    y = parseInt(y);
    x = parseInt(x);

    if (isNaN(z) || isNaN(x) || isNaN(y)) {
        return null;
    }

    return {layer, z, x, y};
}




