# promised-util

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]

- timeout: set timeout on a promise
- postpone: postpone a promise
- sleep: create a promise that will resolve in given time
- pipe: pipe a promise through a series of functions
- tee: observe a promise without altering it

## usage

postpone

```js
const {postpone} = require('promised-util')
promise.then(postpone(10000)).then(result =>
    console.log("10 secs postponed"))
```

sleep

```js
const {sleep} = require('promised-util')
async () => {
    await sleep(1000)
}
```

timeout

```js
const {timeout, TimeoutError, sleep} = require('promised-util')
timeout(100, sleep(200)).catch(err =>
    console.log(err instanceof TimeoutError))
```

pipe

```js
const {pipe} = require('promised-util')
pipe([1, 2], xs => xs.map(x => x * x), xs => xs.filter(x => x > 1))
```

[npm-image]: https://img.shields.io/npm/v/promised-util.svg?style=flat
[npm-url]: https://npmjs.org/package/promised-util
[travis-image]: https://img.shields.io/travis/zweifisch/promised-util.svg?style=flat
[travis-url]: https://travis-ci.org/zweifisch/promised-util
