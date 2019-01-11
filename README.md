# `retry(tries, f)`

`retry` is a function that takes an async function and returns a more persistent version of that function.

## Why?

A lot of asynchronous functions are making network calls. And network calls can be unreliable. So maybe you'll want to try a few times before you give up.

## example

```
const persistentFetch = retry(3, fetch)

// This will call fetch a maximum of three times
persistentFetch('http://example.com')
  .then((response) => response.json())
  .then((data) => console.log(data))
```
