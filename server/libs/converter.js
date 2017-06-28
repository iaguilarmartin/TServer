'use strict';

/**
 * This module is used to convert tile coordinates into
 * longitude and latitude values.
 * 
 * @module converter
 */

/** 
 * Clips a number to the specified minimum and maximum values. 
 * @param {Number} value - The number to clip.
 * @param {Number} minValue - Minimum allowable value.
 * @param {Number} maxValue - Maximum allowable value.
 * @returns {Number} The clipped value.
 */
function clip(value, minValue, maxValue) {
    return Math.min(Math.max(value, minValue), maxValue);
}

/** 
 * Determines the map width and height (in pixels) at a specified level. 
 * @param {Number} tileLevel - Level of detail.
 * @param {Number} tileSize - Size of each tile in pixels.
 * @returns {Number} The map width and height in pixels.
 */
function calculateMapSize(tileLevel, tileSize) {
    return tileSize << tileLevel;
}

/** 
 * First it converts tile XY coordinates into pixel XY coordinates of the upper-left pixel
 * and then it Converts a pixel from pixel XY coordinates at a specified level of detail
 * into latitude/longitude WGS-84 coordinates (in degrees).
 * 
 * @param {Number} tileX - Tile X coordinate.
 * @param {Number} tileY - Tile Y coordinate.
 * @param {Number} tileZ - Level of detail.
 * @param {Number} tileSize - Size of each tile in pixels.
 * @returns {Array.<Number>} Array containing resultant longitude and latitude in degrees.
 */
exports.tileXYToLonLat = function(tileX, tileY, tileZ, tileSize) {

    if (arguments.length !== 4) {
        return [];
    }

    const pixelX = tileX * tileSize;
    const pixelY = tileY * tileSize;

    const mapSize = calculateMapSize(tileZ, tileSize);

    const x = (clip(pixelX, 0, mapSize - 1) / mapSize) - 0.5;
    const y = 0.5 - (clip(pixelY, 0, mapSize - 1) / mapSize);

    const latitude = 90 - 360 * Math.atan(Math.exp(-y * 2 * Math.PI)) / Math.PI;
    const longitude = 360 * x;

    return [longitude, latitude];
}