'use strict';

/**
 * Main module of the application. On launch it creates as many
 * servers as cpus has the host machine. The server will be waiting for
 * requests and will respond with a tile image if URL format is correct.
 * @example
 * // This is an example of a valid requist URL
 * http://localhost:8888/admin0/5/4/10.png
 * 
 * @module server
 */

const generator = require('./libs/tiles-generator');
const cluster = require('cluster');
const http = require('http');
const os = require('os');
const urlParser = require('url');

/**
 * Default port number where the server will listen
 * this value can be changed setting PORT environment variable
 * 
 * @constant
 * @type {Number}
 *  @default 8888
*/
const portNumber = process.env.PORT || 8888;

if (cluster.isMaster) {
    for (const _ of os.cpus()) {
        cluster.fork();
    }
} else {
    runServer(); 
}

/** 
 * Run a new server
 */
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

/** 
 * Respond to the request with and error code
 * @param {Response} response - NodeJS http.ServerResponse object
 * @param {Error} err - Error object containing the information of the thrown Exception
 * @param {Number} [code=500] - Http error code
 */
function respondWithError(response, err, code = 500) {
    console.error(err);
    response.statusCode = code;
    response.end();
}

/** 
 * Respond to the request with a tile image in buffered png format
 * @param {Response} response - NodeJS http.ServerResponse object
 * @param {Buffer} tile - Buffer containing tile image data
 */
function respondWithTile(response, tile) {
    response.writeHead(200, {'Content-Type': 'image/png' });
    response.end(tile, 'binary');
}

/**
 * @typedef {URLParameters} Point
 * @property {String} layer The Layer name
 * @property {Number} x The X Coordinate
 * @property {Number} y The Y Coordinate
 * @property {Number} z The Z Coordinate
 */

/** 
 * Parse URL path to get valid tile generation parameters from it
 * @param {URL} url - NodeJS http.ClientRequest url object
 * @returns {URLParameters} Parsed URL parameters. If the URL does not have a vaild format
 * then null is returned
 */
function parseURLParameters(url) {
    if (!url) {
        return null;
    }

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




