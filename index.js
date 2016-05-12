"use strict";


exports.promisify = function(fn) {
    return function() {
        let args = arguments.length ? [].slice.call(arguments) : [];
        return new Promise(function(resolve, reject) {
            return fn.apply(null, args.concat([function(err, result) {
                err ? reject(err) : resolve(result);
            }]));
        });
    };
};


exports.postpone = function(msecs) {
	return function(result) {
		return new Promise(function(resolve) {
			setTimeout(function() {
                resolve(result);
            }, msecs);
        });
    };
};


exports.race = function(promises) {
    let count = promises.length;
    return new Promise(function(resolve, reject) {
        promises.forEach(function(p) {
            p.then(resolve, function(err) {
                count -= 1;
                if (count === 0) {
                    reject(err);
                }
            });
        });
    });
};


exports.sleep = function(mescs) {
    return new Promise(function(resolve) {
        setTimeout(resolve, mescs);
    });
};


exports.timeout = function(msecs, promise) {
    return new Promise(function(resolve, reject){
        let timer = setTimeout(function() {
            timer = null;
            reject(new Error(`Timed out after ${msecs} milliseconds`));
        }, msecs);
        promise.then(function(result) {
            if (timer) {
                clearTimeout(timer);
                resolve(result);
            }
        }, function(error) {
            if (timer) {
                clearTimeout(timer);
                reject(error);
            }
        });
    });
};


exports.tee = function(fn) {
    return function(value) {
        fn(value);
        return value;
    };
};


exports.pipe = function(initial) {
    let promise = Promise.resolve(initial);
    let fns = Array.prototype.slice.call(arguments,1);
    for (let fn of fns) {
        promise = promise.then(fn);
    }
    return promise;
};


["map", "filter", "reduce", "reduceRight",
 "some", "every", "find"
].forEach(function(op) {
    exports[op] = function(fn) {
        return function(result) {
            if (!Array.isArray(result)) {
                throw new Error(`${op} expacts an Array`);
            }
            return result[op](fn);
        };
    };
});


exports.run = function(generator) {
    return new Promise(function(resolve, reject) {
        let g = generator();
        let next = (yielded)=> {
            if (yielded.done)
                resolve(yielded.value);
            else {
                let value = yielded.value;
                if (Array.isArray(value)) {
                    value = Promise.all(value);
                } else if ("function" !== typeof value.then) {
                    reject(new Error("Promise is expected to be yield from inside run()"));
                }
                value.then(result => {
                    try {
                        next(g.next(result));
                    } catch (e) {
                        reject(e);
                    }
                }, reject);
            }
        };
        next(g.next());
    });
};
