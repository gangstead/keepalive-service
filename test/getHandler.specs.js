var chai = require('chai');
chai.should();
var expect = chai.expect;
var sinon = require('sinon');

var getHandler = require("../lib/v1/handlers/getHandler.js");
var model = require('../lib/v1/models/Model.js');

describe('getHandler', function () {

    describe('by id', function () {
        describe('without error', function () {

            var request = {
                params: {
                    id: '554f284318f361904bda49e1'
                }
            };

            var  = {
                'test':'test',
                'test2':'test2'
            };

            var result, stub;

            before(function (done) {
                stub = sinon.stub(model, 'findById').yields(null, );

                getHandler.handler(request, function (code) {
                    result = code;
                    done();
                });
            });

            it('should return id of deleted ', function () {
                expect(result).to.equal();
            });

            after(function(){
                stub.restore();
            });

        });

        describe('with error', function () {

            var request = {
                params: {
                    id: '554f284318f361904bda49e1'
                }
            };

            var result, stub;

            before(function (done) {
                stub = sinon.stub(model, 'findById').yields('could not find model', null);

                getHandler.handler(request, function (code) {
                    result = code;
                    done();
                });
            });

            it('should return error', function () {
                expect(result.toString()).to.equal('Error: could not find model');
            });

            after(function(){
                stub.restore();
            });

        });
    });

    describe('without id', function () {

        describe('without error', function () {

            var request = {
                params: {}
            };

            var  = {
                _id: '554f284318f361904bda49e1'
            };

            var result, stub;

            before(function (done) {
                stub = sinon.stub(model, 'find').yields(null, []);

                getHandler.handler(request, function (code) {
                    result = code;
                    done();
                });
            });

            it('should return id of deleted ', function () {
                expect(result[0]).to.equal();
            });

            after(function () {
                stub.restore();
            });

        });

        describe('with error', function () {

            var request = {
                params: {}
            };

            var result, stub;

            before(function (done) {
                stub = sinon.stub(model, 'find').yields('could not get models', null);

                getHandler.handler(request, function (code) {
                    result = code;
                    done();
                });
            });

            it('should return error', function () {
                expect(result.toString()).to.equal('Error: could not get models');
            });

            after(function () {
                stub.restore();
            });

        });

    });
});

