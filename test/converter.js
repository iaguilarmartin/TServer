'use strict';

process.env.NODE_ENV = 'test';

const should = require('chai').should();

const converter = require('../server/libs/converter');

describe('Converter', () => {
    describe('tileXYToLonLat function', () => {
        it('it should return empty array when not passing all the arguments', (done) => {
            let value = converter.tileXYToLonLat();
            value.should.be.a('array').with.lengthOf(0);

            value = converter.tileXYToLonLat(1, 2);
            value.should.be.a('array').with.lengthOf(0);

            value = converter.tileXYToLonLat(1, 2, 3);
            value.should.be.a('array').with.lengthOf(0);

            done();
        });

        it('it should return an array of two elements when passing four parameters', (done) => {
            let value = converter.tileXYToLonLat("test", 1, 2, 4);
            value.should.be.a('array').with.lengthOf(2);

            value = converter.tileXYToLonLat(1, 2, null, 4);
            value.should.be.a('array').with.lengthOf(2);

            value = converter.tileXYToLonLat({}, 2, 3, 4);
            value.should.be.a('array').with.lengthOf(2);

            done();
        });

        it('it should return NaN when passing invalid parameters', (done) => {
            let value = converter.tileXYToLonLat("test", 1, 2, 4);
            value.should.be.a('array').with.lengthOf(2);

            value = converter.tileXYToLonLat(1, 2, null, 4);
            value.should.be.a('array').with.lengthOf(2);

            value = converter.tileXYToLonLat({}, 2, 3, 4);
            value.should.be.a('array').with.lengthOf(2);

            done();
        });

        it('it should convert correctly tile cordinates to latitude and longitude degrees', (done) => {
            let value = converter.tileXYToLonLat(0, 0, 1, 256);
            validateValue(value);

            value = converter.tileXYToLonLat(14, 50, 1, 512);
            validateValue(value);

            value = converter.tileXYToLonLat(1, 1, 2, 128);
            validateValue(value);
            value[0].should.be.equal(-90);
            value[1].should.be.equal(66.51326044311186);

            done();
        });
    });
});

function validateValue(value) {
    value.should.be.a('array').with.lengthOf(2);
    value[0].should.be.within(-180, 180);
    value[1].should.be.within(-85.05112878, 85.05112878);
}