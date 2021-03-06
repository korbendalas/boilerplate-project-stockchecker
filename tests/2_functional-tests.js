/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const errorHandler = require('../libs/devErrorHandler');
const server = require('../server');
const { suite, test, suiteTeardown } = require('mocha');
const Voter = require('../models/voter');
const Stock = require('../models/stock');

chai.use(chaiHttp);

const _dropCollection = Model => {
  return Model.deleteMany({}, err => {
    if (err) {
      console.log(err); // to handle;
    }
  });
}

const teardownDB = done => 
  Promise.all([_dropCollection(Voter), _dropCollection(Stock)])
    .then(() => {
      console.log('subsuite torn down ---');      
      done();
    })
    .catch(err => {
      errorHandler.handleTest(err);
    });

// if unit-integration tests are executed before functional tests, all functional tests will fail
// in order to functional tests pass, unit tests have to be skipped
// at this moment tests are passing only for first suite or any single suit under test
suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {      
      this.timeout(19999); 

      suite('1 stock tests suite', function() {
        test('1 stock', function(done) {
          // arrange
          const expected = {
            name: 'Alphabet Inc.',
            symbol: 'GOOG',
            price: undefined,
            currency: 'USD',
            likes: 0,
            date: undefined
          };
          const expectedKeys = Object.keys(expected);
  
          // act 
          chai.request(server)        
            .get('/api/stock-prices')
            .query({stock: 'goog'})
            .end(function(err, res){
              const actual = res.body.stockData[0];
              
              // assert
              assert.hasAllKeys(actual, expectedKeys);
              assert.strictEqual(actual.name, expected.name);
              assert.strictEqual(actual.symbol, expected.symbol);
              assert.strictEqual(actual.currency, expected.currency);
              assert.strictEqual(actual.likes, expected.likes);
  
              done();
          });
        });
        
        test('1 stock with like', function(done) {
          // arrange 
          const expected = {
            name: 'Alphabet Inc.',
            symbol: 'GOOG',
            price: undefined,
            currency: 'USD',
            likes: 1,
            date: undefined
          };
          const expectedKeys = Object.keys(expected);
          
          // act 
          chai.request(server)
            .get('/api/stock-prices')
            .query({ stock: 'goog', like: true })
            .end(function(err, res) {
              const actual = res.body.stockData[0];
  
              // assert
              assert.hasAllKeys(actual, expectedKeys);
              assert.strictEqual(actual.name, expected.name);
              assert.strictEqual(actual.symbol, expected.symbol);
              assert.strictEqual(actual.currency, expected.currency);
              assert.strictEqual(actual.likes, expected.likes);
  
              done();
            });
        });
        
        test('1 stock with like again (ensure likes arent double counted)', function(done) {
          // arrange
          const expected = {
            name: 'Alphabet Inc.',
            symbol: 'GOOG',
            price: undefined,
            currency: 'USD',
            likes: 1,
            date: undefined
          };
          const expectedKeys = Object.keys(expected);
  
          // act
          chai.request(server)
            .get('/api/stock-prices')
            .query({ stock: 'goog', like: true })
            .end(function(err, res) {
              const actual = res.body.stockData[0];
              
              // assert 
              assert.hasAllKeys(actual, expectedKeys);
              assert.strictEqual(actual.name, expected.name);
              assert.strictEqual(actual.symbol, expected.symbol);
              assert.strictEqual(actual.currency, expected.currency);
              assert.strictEqual(actual.likes, expected.likes);
  
              done();
            });
        });

        suiteTeardown(function(done) {
          teardownDB(done);
        });
      });

      suite('2 stocks tests suite', function() {
        test('2 stocks', function(done) {
          // arrange
          const expected1 = {
            name: 'Alphabet Inc.',
            symbol: 'GOOG',
            price: undefined,
            currency: 'USD',
            likes: 0,
            date: undefined
          };
          const expected2 = {
            name: 'Apple Inc.',
            symbol: 'AAPL',
            price: undefined,
            currency: 'USD',
            likes: 0,
            date: undefined
          };
    
          const expectedKeys = Object.keys(expected1);
  
          // act
          chai.request(server)
            .get('/api/stock-prices')
            .query({ stock: ['goog', 'aapl'] })
            .end(function(err, res) {
              const actual1 = res.body.stockData[0];
              const actual2 = res.body.stockData[1];
  
              // assert
              assert.hasAllKeys(actual1, expectedKeys);
              assert.strictEqual(actual1.name, expected1.name);
              assert.strictEqual(actual1.symbol, expected1.symbol);
              assert.strictEqual(actual1.currency, expected1.currency);
              assert.strictEqual(actual1.likes, expected1.likes);
  
              assert.hasAllKeys(actual2, expectedKeys);
              assert.strictEqual(actual2.name, expected2.name);
              assert.strictEqual(actual2.symbol, expected2.symbol);
              assert.strictEqual(actual2.currency, expected2.currency);
              assert.strictEqual(actual2.likes, expected2.likes);
  
              done();
            });
        });
        
        test('2 stocks with like', function(done) {
          // arrange
          const expected1 = {
            name: 'Alphabet Inc.',
            symbol: 'GOOG',
            price: undefined,
            currency: 'USD',
            likes: 1,
            date: undefined
          };
          const expected2 = {
            name: 'Apple Inc.',
            symbol: 'AAPL',
            price: undefined,
            currency: 'USD',
            likes: 1,
            date: undefined
          };
    
          const expectedKeys = Object.keys(expected1);
  
          // act
          chai.request(server)
            .get('/api/stock-prices')
            .query({ stock: ['goog', 'aapl'], like: 1 })
            .end(function(err, res) {
              const actual1 = res.body.stockData[0];
              const actual2 = res.body.stockData[1];
  
              // assert
              assert.hasAllKeys(actual1, expectedKeys);
              assert.strictEqual(actual1.name, expected1.name);
              assert.strictEqual(actual1.symbol, expected1.symbol);
              assert.strictEqual(actual1.currency, expected1.currency);
              assert.strictEqual(actual1.likes, expected1.likes);
  
              assert.hasAllKeys(actual2, expectedKeys);
              assert.strictEqual(actual2.name, expected2.name);
              assert.strictEqual(actual2.symbol, expected2.symbol);
              assert.strictEqual(actual2.currency, expected2.currency);
              assert.strictEqual(actual2.likes, expected2.likes);
  
              done();
            });
        });

        suiteTeardown(function(done) {
          teardownDB(done);
        });
      });    
    });
});
