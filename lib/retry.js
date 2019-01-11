const retry = (tries, f) => 
  (tries < 2) ?
    f :
    (...params) =>
      f(...params)
        .catch(() => retry(tries - 1, f)(...params))

module.exports = retry
