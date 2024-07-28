---
title: Leetcode-Q4
author: TomasLin
date: 2017-05-07
tags:
    - Javascript
    - Leetcode
categories: Leetcode
---

# 9 Palindrome Number

## 迴文數

[wiki](https://zh.wikipedia.org/wiki/%E5%9B%9E%E6%96%87%E6%95%B0)

## Example

```js
  const INT_MAX = 2147483647;
  let y = 0;

  if (x > 0 && x < 10) {
    return true;
  } else {
    let str = x.toString(),
      length = str.length,
      total = 0;

    for (let index = 0; index < length; index++) {
      let num = parseInt(str[index]) * Math.pow(10, index);
      total += num;
    }
    if (total > INT_MAX
      || total < -(1 + INT_MAX)
      || x > INT_MAX
      || x < -(1 + INT_MAX)) {
      return false;
    } else if (total === x) {
      return true;
    } else {
      return false;
    }
  }
```

這一題的原理跟上一題 [Reverse Integer]('./Leetcode-Q3.md') 原理類似

在翻轉變數之後

比對是否相等

若是相等就回傳 true

不相等就回傳 false
