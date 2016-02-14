# promised-util

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]

- promisify: make callback style functions returns promises
- timeout: set timeout on a promise
- postpone: postpone a given promise
- map/filter/reduce/some/every/find: easier array manipulation
- run: async/await from future
- sleep: create a promise that will resolve in given time
- pipe: pipe a promise through a series of functions
- tee: observe a promise without altering it

## usage

promisify

```js
import {promisify} from "promised-util";
let readFile = promisify(fs.readFile);
readFile("/path", "utf8").then(content => );
```

postpone

```js
promise.then(postpone(10000)).then(result =>
    console.log("10 secs postponed"));
```

timeout

```js
timeout(10000, promise).catch(err =>
    console.log("too late"));
```

map/filter/reduce/some/every/find

```js
Promise.resolve([1, 2]).then(some(x => x > 1));
```

run sequentially

```js
run(function*(){
    let result = yield asyncOp();
    yield sleep(1000);
    let more = yield moreAsyncOp(result);
    return more;
});
```

run concurrently

```js
run(function*(){
    let result = yield asyncOp();
    let more = yield moreAsyncOp();
    return yield [result, more];
});
```

[npm-image]: https://img.shields.io/npm/v/promised-util.svg?style=flat
[npm-url]: https://npmjs.org/package/promised-util
[travis-image]: https://img.shields.io/travis/zweifisch/promised-util.svg?style=flat
[travis-url]: https://travis-ci.org/zweifisch/promised-util
