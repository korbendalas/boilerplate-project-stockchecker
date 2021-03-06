'use strict';

require('dotenv').config(); // figure out if possible to use root .env

const chai = require('chai');
const { suite, test, suiteTeardown } = require('mocha');
const { _fetchNewStock, _findUpdatedStock } = require('./index');
const { wrapIntoArray, oldPrice } = require('./helpers');

const assert = chai.assert;

module.exports = () => {
  suite('controller functions', () => {
    // arrange global
    const expectedKeys = ['name', 'price', 'symbol', 'date', 'currency', 'likes'];

    suite('oldPrice()', () => {
      test('old date', done => {
        // arrange
        const oldDate = '1000';

        // act 
        const actual = oldPrice(oldDate);

        // assert
        assert.isTrue(actual);

        done();
      });

      test('date still valid', done => {
        // arrange
        const validDate = JSON.stringify(parseInt(Date.now()) - 1000 * 60 * 60 * 5);

        // act 
        const actual = oldPrice(validDate);

        // assert
        assert.isFalse(actual);

        done();
      });
    });

    suite('_fetchNewStock(symbol)', () => {
      test('valid usage', () => {
        // arrange
        const testSymbol = 'MSFT';

        // act
        _fetchNewStock(testSymbol)
          .then(stock => {
            // assert
            assert.hasAllKeys(stock, expectedKeys, 'some keys missing');
            assert.propertyVal(stock, 'symbol', testSymbol);
          })
          .catch(err => {});
      });
    });

    suite('_findUpdatedStock(symbol, voterIp, liked)', () => {
      // arrange
      const testSymbol = 'MSFT';
      const expected = {
        name: 'Microsoft Corporation',
        currency: 'USD'
      };

      // test after all to delete added stocks
      test('when stock not in db', () => {
        // act
        _findUpdatedStock(testSymbol)
          .then(stock => {
            //assert
            assert.hasAllKeys(stock, expectedKeys);
            assert.strictEqual(stock.symbol, testSymbol);
            assert.strictEqual(stock.likes, 0);
            assert.strictEqual(stock.name, expected.name);
            assert.strictEqual(stock.currency, expected.currency);
          })
          .catch(err => {});
      });
      test('when stock in db', () => {
        // arrange
        const timeBeforeTest = Date.now();

        // act
        _findUpdatedStock(testSymbol)
          .then(stock => {
            // assert
            assert.hasAllKeys(stock, expectedKeys);
            assert.strictEqual(stock.symbol, testSymbol);
            assert.strictEqual(stock.likes, 0);
            assert.strictEqual(stock.name, expected.name);
            assert.strictEqual(stock.currency, expected.currency);
            assert.isBelow(parseInt(stock.date), parseInt(timeBeforeTest));
          })
          .catch(err => {});
      });

      test('when stock in db and arg liked=true', () => {
        // act
        _findUpdatedStock(testSymbol, true)
          .then(stock => {
            // assert
            assert.hasAllKeys(stock, expectedKeys);
            assert.strictEqual(stock.symbol, testSymbol);
            assert.strictEqual(stock.likes, 1);
            assert.strictEqual(stock.name, expected.name);
            assert.strictEqual(stock.currency, expected.currency);
          })
          .catch(() => {});
      });
    });

    suite('wrapIntoArray(arg)', () => {
      test('string', done => {
        // arrange 
        const testString = 'google';
        const expectedLength = 1;

        // act 
        const actual = wrapIntoArray(testString);
        const actualAtZero = actual[0];

        // assert
        assert.isArray(actual);
        assert.strictEqual(actualAtZero, testString);
        assert.lengthOf(actual, expectedLength);

        done();
      });
      test('array', done => {
        // arrange 
        const testArray = ['apple', 'facebook'];
        const expectedLength = 2;

        // act
        const actual = wrapIntoArray(testArray);

        // assert
        assert.isArray(actual);
        assert.lengthOf(actual, expectedLength);

        done();
      });
      test('undefined', done => {
        // arrange 
        const testString = undefined;
        const expectedLength = 0;

        // act
        const actual = wrapIntoArray(testString);

        // assert
        assert.isArray(actual);
        assert.lengthOf(actual, expectedLength);

        done();
      });
    });

    suiteTeardown(() => {
      console.log('index tests finished');      
    });
  });
}