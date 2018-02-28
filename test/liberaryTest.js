//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../TestServer/app');
let should = chai.should();


chai.use(chaiHttp);


//Our parent block
describe('State_Liberary_Api', () => {

    /*
     * Test the /api/v1/state/create route
     */
    describe('/api/v1/state/create', () => {
        it('It should create an Object', (done) => {
            let myState = { "stateObject": { "visible": true } }
            chai.request(server)
                .post('/api/v1/state/create')
                .send(myState)
                .end((err, res) => {
                    res.body.should.have.property('response');
                    res.body.should.have.property('result').eql('State Created!');
                    res.should.have.status(200);
                    done();
                });
        });
    });
    /*
     * Test the /api/v1/state/get route
     */
    describe('/api/v1/state/get', () => {
        it('it should GET the state of Object', (done) => {
            chai.request(server)
                .get('/api/v1/state/get')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('response');
                    res.body.should.have.property('result').eql('State');
                    done();
                });
        });
    });
    /*
     * Test the /api/v1/create/property route
     */
    describe('/api/v1/create/property', () => {
        it('It should add property to Object', (done) => {
            let property = {
                'createPropObj': {
                    "focus": null
                }
            }
            chai.request(server)
                .post('/api/v1/create/property')
                .send(property)
                .end((err, res) => {
                    res.body.should.have.property('response');
                    res.body.should.have.property('result').eql('Property Added!');
                    res.should.have.status(200);
                    done();
                });
        });
    });
    /*
     * Test the /api/v1/create/property1
     */
    describe('/api/v1/create/property1', () => {
        it('It should add property to Object using 2 parameters', (done) => {
            let property = {
                'createPropObj': {
                    "absolute": true
                },
                'createPropObjProperty': 'range.type'
            }
            chai.request(server)
                .post('/api/v1/create/property')
                .send(property)
                .end((err, res) => {
                    res.body.should.have.property('response');
                    res.body.should.have.property('result').eql('Property Added!');
                    res.should.have.status(200);
                    done();
                });
        });
    });
    /*
     * Test the /api/v1/get/property
     */
    describe('/api/v1/get/property', () => {
        it('It should get property of the State Object', (done) => {
            let property = {
                'getProperty': 'range'
            }
            chai.request(server)
                .post('/api/v1/create/property')
                .send(property)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
    /*
     * Test the /api/v1/set/property
     */
    describe('/api/v1/set/property', () => {
        it('It should set property of the State Object', (done) => {
            let property = {
                 property: 'visible', propertyValue: 'false' 
            }

            chai.request(server)
                .post('/api/v1/set/property')
                .send(property)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

});
