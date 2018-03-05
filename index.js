const postpone = msecs => result => new Promise(resolve => setTimeout(() => resolve(result), msecs))

const sleep = msecs => new Promise(resolve => setTimeout(resolve, msecs))

class TimeoutError extends Error {}

const timeout = (msecs, promise) => {
    return new Promise((resolve, reject) => {
        let timer = setTimeout(() => {
            timer = null
            reject(new TimeoutError())
        }, msecs)
        promise.then(result => {
            if (timer) {
                clearTimeout(timer)
                resolve(result)
            }
        }, error => {
            if (timer) {
                clearTimeout(timer)
                reject(error)
            }
        })
    })
}

const tee = fn => value => {
    fn(value)
    return value
}

const pipe = (initial, ...fns) => fns.reduce((a, b) => a.then(b), Promise.resolve(initial))


const just = val => () => val
const justTrue = just(true)
const justFalse = just(false)
const fulfilled = promise => promise.then(justTrue, justFalse)
const rejected = promise => promise.then(justFalse, justTrue)

module.exports = {
    postpone, sleep, timeout, tee, pipe, TimeoutError, fulfilled, rejected
}
