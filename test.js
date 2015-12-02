"use strict";

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
chai.should();

var postpone = require("./index").postpone;
var sleep = require("./index").sleep;
var timeout = require("./index").timeout;
var promisify = require("./index").promisify;
var map = require("./index").map;
var run = require("./index").run;

describe("postpone", ()=> {

    it("should postpone", ()=>
       Promise.resolve("thing").then(postpone(10)).should.become("thing"));
});

describe("sleep", ()=> {

    it("should sleep", ()=>
       sleep(10).should.become(undefined));
});

describe("timeout", ()=> {

    it("should timeout", ()=>
       timeout(10, Promise.resolve("thing").then(postpone(20))).should.be.rejected);

    it("should be in time", ()=>
        timeout(20, Promise.resolve("thing").then(postpone(10))).should.be.fulfilled);

    it("should timeout", ()=>
       timeout(10, sleep(20)).should.be.rejected);

    it("should be in time", ()=>
       timeout(20, sleep(10)).should.be.fulfilled);
});

describe("promisify", ()=> {

    it("should convert callbacks", ()=> {
        var explode = (input, cb)=> cb(new Error(`${input} exploded`));
        return promisify(explode)("server").should.be.rejected;
    });

    it("should convert callbacks", ()=> {
        var cat = (input, more, cb)=> cb(null, `${input} on ${more}`);
        return promisify(cat)("server", "fire").should.become("server on fire");
    });
});

describe("array", ()=> {

    it("should complain", ()=>
       Promise.resolve({}).then(map(x=>x)).should.be.rejected);

    it("should map", ()=>
       Promise.resolve([1, 2, 3]).then(map(x=>x + x)).should.become([2, 4, 6]));
});

describe("run", ()=> {

    it("should run sequentially", ()=>
        run(function*() {
            let a = yield sleep(10);
            yield Promise.resolve("aha");
            let b = yield Promise.resolve("thing");
            return [a, b];
        }).should.become([undefined, "thing"]));

    it("should run concurrently", ()=>
        run(function*() {
            let a = sleep(10);
            let b = Promise.resolve("thing");
            return yield [a, b];
        }).should.become([undefined, "thing"]));

    it("should reject", ()=>
        run(function*() {
            let a = yield sleep(10);
            let b = yield Promise.reject(new Error("throw me out"));
            return [a, b];
        }).should.be.rejected);

    it("should reject", ()=>
       run(function*() {
           throw new Error("catch me if you can");
       }).should.be.rejected);

    it("should reject", ()=>
       run(function*() {
           let a = yield Promise.resolve("thing");
           let b = yield Promise.resolve("thing");
           throw new Error("catch me if you can");
       }).should.be.rejected);

    it("should complain", ()=>
       run(function*() {
           let a = yield Promise.resolve("thing");
           yield a;
       }).should.be.rejected);

    it("should complain", ()=>
       run(function*() {
           yield Promise.resolve("thing");
           let b = yield undefined;
       }).should.be.rejected);
});
