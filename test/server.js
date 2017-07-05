const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();

chai.use(chaiHttp);

describe('API', () => {

    describe('/GET lessons', () => {
        it('should GET return the correct status code', (done) => {
            chai.request(server)
                .get('/lessons')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });

    describe('/GET lessons/:status', () => {
        it('should GET return the correct status code', (done) => {
            chai.request(server)
                .get('/lessons/complete')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });

    describe('/GET lesson/:id', () => {
        it('should GET return the correct status code', (done) => {
            chai.request(server)
                .get('/lesson/0')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
});
