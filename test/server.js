'use strict';

process.env.NODE_ENV = 'test';
const portNumber = process.env.PORT = 8888;

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);

const server = require('../server/server');

const serverURL = `http://localhost:${portNumber}`;

describe('Server', () => {
    describe('/GET Tile image', () => {
        it('it should GET a Bad request response when URL path is empty', (done) => {
            chai.request(serverURL)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.header.should.have.property('content-length').with.equal('0');
                    done();
                });
        });

        it('it should GET a Bad request response when the order of the URL parameters is wrong', (done) => {
            chai.request(serverURL)
                .get('/0/admin0/2/3.png')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.header.should.have.property('content-length').with.equal('0');
                    done();
                });
        });

        it('it should GET an internal server error when requested layer does not exist', (done) => {
            chai.request(serverURL)
                .get('/admin3/1/2/3.png')
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.header.should.have.property('content-length').with.equal('0');
                    done();
                });
        });

        it('it should GET the image of a tile when URL is correct', (done) => {
            chai.request(serverURL)
                .get('/admin0/1/2/3.png')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.header.should.have.property('content-type').with.equal('image/png');
                    done();
                });
        });
    });
});