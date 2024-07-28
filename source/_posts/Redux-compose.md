---
title: Map
author: TomasLin
tags:
  - null
date: 2018-02-02
categories: Javascript, React
---

# Redux 中的 compose 的 source code

[compose](https://github.com/reactjs/redux/blob/master/src/compose.js)

```javascript
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
```

若是沒有參數的話就回傳一個預設的函式

若是只有一個則直接回傳 `function`

聊到 `reduce` 前 可以先談談 `遞回`

