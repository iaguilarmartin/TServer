function clip(value, minValue, maxValue) {
    return Math.min(Math.max(value, minValue), maxValue);
}

function calculateMapSize(tileLevel, tileSize) {
    return tileSize << tileLevel;
}

exports.tileXYToLonLat = function(tileX, tileY, tileZ, tileSize) {
    const pixelX = tileX * tileSize;
    const pixelY = tileY * tileSize;

    const mapSize = calculateMapSize(tileZ, tileSize);

    const x = (clip(pixelX, 0, mapSize - 1) / mapSize) - 0.5;
    const y = 0.5 - (clip(pixelY, 0, mapSize - 1) / mapSize);

    const latitude = 90 - 360 * Math.atan(Math.exp(-y * 2 * Math.PI)) / Math.PI;
    const longitude = 360 * x;

    return [longitude, latitude];
}