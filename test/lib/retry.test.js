const assert = require('assert')
const td = require('testdouble')
const retry = require('../../lib/retry')

const desiredValue = Symbol()
const succeed = Promise.resolve(desiredValue)
const expectedError = Error('error')
const fail = Promise.reject(expectedError)
const unexpectedFail = Promise.reject(Error('unexpected'))

// catch so "unhandled rejection" checkers don't complain:
fail.catch(() => 1)
unexpectedFail.catch(() => 1)

var f, subject

module.exports = {
  retry: {
    'returns a function that': {
      'when trying once': {
        beforeEach: () => {
          f = td.func('dummy async function')
          subject = retry(1, f)
        },
        'can succeed': () => {
          td.when(f()).thenReturn(
            succeed,
            unexpectedFail
          )

          return subject()
            .then((v) => assert.equal(v, desiredValue))
        },
        'can fail': () => {
          td.when(f()).thenReturn(
            fail,
            unexpectedFail
          )

          return subject()
            .then(() => unexpectedFail)
            .catch((e) => assert.equal(e, expectedError))
        },
      },
      'when trying three times': {
        beforeEach: () => {
          f = td.func('dummy async function')
          subject = retry(3, f)
        },
        'can succeed on the first try': () => {
          td.when(f()).thenReturn(
            succeed,
            unexpectedFail
          )

          return subject()
            .then((v) => assert.equal(v, desiredValue))
        },
        'can succeed on the third try': () => {
          td.when(f()).thenReturn(
            fail,
            fail,
            succeed,
            unexpectedFail
          )

          return subject()
            .then((v) => assert.equal(v, desiredValue))
        },
        'will fail if the tries are exhausted': () => {
          td.when(f()).thenReturn(
            unexpectedFail,
            unexpectedFail,
            fail,
            unexpectedFail
          )

          return subject()
            .then(() => unexpectedFail)
            .catch((e) => assert.equal(e, expectedError))
        },
      },
    },
  },
}
