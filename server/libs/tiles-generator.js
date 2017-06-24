'use strict';

const fs = require('fs');
const mapnik = require('mapnik');
const path = require('path');

const TILE_SIZE = 256;
const layer0 = "style-admin0.xml";
const layer1 = "style-admin1.xml";

const layersPath = path.join(__dirname, "../resources/layers");

mapnik.register_datasource(path.join(mapnik.settings.paths.input_plugins, 'shape.input'));

exports.generateImage = function (layer, z, x, y) {
    return new Promise((resolve, reject) => {

        let layerPath;

        switch (layer) {
            case "admin0":
                layerPath = path.join(layersPath, layer0);;
                break;
            case "admin1":
                layerPath = path.join(layersPath, layer1);;
                break;
            default:
                reject(new Error("Unknown layer name"));
                return;
        }

        const map = new mapnik.Map(TILE_SIZE, TILE_SIZE);
        map.load(layerPath, (err, map) => {
            if (err) {
                reject(err);
                return;
            }

            map.render(new mapnik.VectorTile(z, x, y), {}, function(err, vtile) {
                if (err) {
                    reject(err);
                    return;
                }

                vtile.render(map, new mapnik.Image(TILE_SIZE, TILE_SIZE), {}, function(err, image) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    image.encode('png', function(err, buffer) {
                        if (err) {
                            reject(err);
                            return;
                        }

                        resolve(buffer);
                    });
                });
            });
        })
    });
}

