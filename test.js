var request = require("supertest");
var app = require('./app');
var redis = require("redis");
client = redis.createClient();
client.select(('test').length);
client.flushdb();
// test the app

describe('Requests to the root path', function(){
    it('Returns a 200 status code', function(done){
        request(app)
        .get('/')
        .expect(200,done);
    });
    it('Returns a html format', (done) => {
        request(app)
            .get('/')
            .expect('Content-Type',/html/,done);
    });
    it('Returns an index file with cities', (done)=>{
        request(app)
            .get('/')
            .expect(/cities/i, done);
    })

});




//test for cities end point
describe('Listing cities on /cities', () => {
    it('Returns 200 status code', (done) => {
        request(app)
            .get('/cities')
            .expect(200,done);
    });
    it('Returns a json content', (done) => {
        request(app)
            .get('/cities')
            .expect('Content-Type',/json/,done);
    });
    it('Return JSON list of initial cities', (done) => {
        request(app)
            .get('/cities')
            .expect(JSON.stringify([]),done);
    });
});



describe('Creating new cities', () => {
    it('returns a 201 status code', (done) => {
        request(app)
            .post('/cities')
            .send('name=Springfield&description=wher+the+simpsons+live')
            .expect(201,done);
    });
    it('Return the city name', (done) => {
        request(app)
            .post('/cities')
            .send('name=Springfield&description=wher+the+simpsons+live')
            .expect(/Springfield/i,done);
    });
    
    it('validates city name and description', function (done) {
        request(app)
        .post('/cities')
        .send('name=&description=')
        .expect(400,done);
    });
    
});


describe('Deleting cities', function () {
    before(function(){
        client.hset('cities','banana','A tasty fruit');
    });
    after(function(){
        client.flushdb();
    });
    
    it('Returns a 204 status code', function (done) {
        request(app)
            .delete('/cities/banana')
            .expect(204,done);
        
    });
    
});



