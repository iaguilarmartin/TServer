'use strict';

const mapnik = require('mapnik');
const path = require('path');
const converter = require('./converter');

const TILE_SIZE = 256;
const LAYER_0_STYLE = 'style-admin0.xml';
const LAYER_1_STYLE = 'style-admin1.xml';

mapnik.register_datasource(path.join(mapnik.settings.paths.input_plugins, 'shape.input'));

function getLayerStyle(layerNmae) {

    const layersStylePath = path.join(__dirname, '../resources/layers');

    switch (layerNmae) {
        case 'admin0':
            return path.join(layersStylePath, LAYER_0_STYLE);
        case 'admin1':
            return path.join(layersStylePath, LAYER_1_STYLE);
        default:
            return null;
    }
}

exports.generateImage = function (layer, z, x, y) {

    return new Promise((resolve, reject) => {

        const layerStyle = getLayerStyle(layer);
        if (!layerStyle) {
            reject(new Error('Unknown layer name'));
            return;
        }

        let map = new mapnik.Map(TILE_SIZE, TILE_SIZE);
        map.load(layerStyle, (err, map) => {
            if (err) {
                reject(err);
                return;
            }

            const minLonLat = converter.tileXYToLonLat(x, y, z, TILE_SIZE);
            const maxLonLat = converter.tileXYToLonLat(x + 1, y + 1, z, TILE_SIZE);

            const merc = new mapnik.Projection(map.srs);
            const [minX, minY] = merc.forward(minLonLat);
            const [maxX, maxY] = merc.forward(maxLonLat);

            map.zoomToBox([minX, minY, maxX, maxY]);

            map.render(new mapnik.Image(TILE_SIZE, TILE_SIZE), function(err, image) {
                image.encode('png', function(err, buffer) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(buffer);
                });
            });
        })
    });
};

exports.generateImageUsingVectorTile = function (layer, z, x, y) {

    return new Promise((resolve, reject) => {

        const layerStyle = getLayerStyle(layer);
        if (!layerStyle) {
            reject(new Error('Unknown layer name'));
            return;
        }

        const map = new mapnik.Map(TILE_SIZE, TILE_SIZE);
        map.load(layerStyle, (err, map) => {
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
};




