var chai = require('chai');
chai.should();
var expect = chai.expect;
var sinon = require('sinon');

var postHandler = require('../lib/v1/handlers/postHandler.js');
var model = require('../lib/v1/models/Model.js');

describe('postHandler', function () {

    describe('without error', function () {
        var request = {
            payload: { 
            }
        };

        var  = {
            _id: '554f284318f361904bda49e1'
        };

        var result, stub;

        before(function (done) {
            stub = sinon.stub(model.prototype, 'save').yields(null, );

            postHandler.handler(request, function (code) {
                result = code;
                done();
            });
        });

        it('should return id of deleted ', function () {
            expect(result).to.equal(._id);
        });

        after(function(){
            stub.restore();
        });

    });

    describe('with error', function () {
        var request = {
            payload: { 
            }
        };

        var result, stub;

        before(function (done) {
            stub = sinon.stub(model.prototype, 'save').yields('could not save', null);

            postHandler.handler(request, function (code) {
                result = code;
                done();
            });
        });

        it('should return error', function () {
            expect(result.toString()).to.equal('Error: Error: could not save');
        });

        after(function(){
            stub.restore();
        });

    });

});

