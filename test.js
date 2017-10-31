const chai = require("chai")
const chaiAsPromised = require("chai-as-promised")

chai.use(chaiAsPromised)
chai.should()

const {
    postpone,
    sleep,
    timeout,
    tee,
    pipe
} = require("./index")

describe("postpone", ()=> {

    it("should postpone", ()=>
       Promise.resolve("thing").then(postpone(10)).should.become("thing"))
})

describe("sleep", ()=> {

    it("should sleep", ()=>
       sleep(10).should.become(undefined))
})

describe("timeout", ()=> {

    it("should timeout", ()=>
       timeout(10, Promise.resolve("thing").then(postpone(20))).should.be.rejected)

    it("should be in time", ()=>
        timeout(20, Promise.resolve("thing").then(postpone(10))).should.be.fulfilled)

    it("should timeout", ()=>
       timeout(10, sleep(20)).should.be.rejected)

    it("should be in time", ()=>
       timeout(20, sleep(10)).should.be.fulfilled)
})

describe("pipe", ()=> {

    it("should pipe plain value", ()=>
       pipe(2, (x)=> x + x, (x)=> x * x).should.eventually.equal(16))

    it("should pipe promise", ()=>
       pipe(Promise.resolve(3), x => x + x, x => x * x).should.eventually.equal(36))

    it("should abort on error", ()=>
       pipe(2, () => {throw Error("rorrE")}, x => x + x).should.be.rejected)
})
