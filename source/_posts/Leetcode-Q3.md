---
title: Leetcode-Q3
author: TomasLin
date: 2017-05-06
tags:
    - Javascript
    - Leetcode
categories: Leetcode
---

# 7 Reverse Integer

## Example

Example1: x = 123, return 321

Example2: x = -123, return -321

## 解題

### Version 1

第一個想到的方式就是先用字串的方式

```js
var reverse = function (x) {

  const INT_MAX = 2147483647;

  const isNegativeNumber = (x < 0) ? true : false,
    y = Math.abs(x).toString().split('')
  length = y.length;

  let result = [];
  for (let i = 0; i < length; i++) {
    result.push(y.pop());
  }

  let total = parseInt(result.join(''));

  total = isNegativeNumber ? (0 - total) : total;
  if (total > INT_MAX || total < -(1 + INT_MAX)) {
    return 0;
  } else {
    return total;
  }
};
```

我先確定他是否為負數

然後把數字轉絕對值 切一維陣列

在使用for 迴圈來迴轉

最後檢查是否有超出32 bit與回傳正負總值

但是這樣的效能實在欠佳

### Version 2
```js
var reverse = function (x) {
  if (x >= 0 && x < 10) {
    return x;
  }
  const INT_MAX = 2147483647;

  const isNegativeNumber = (x < 0) ? true : false,
    y = Math.abs(x).toString().split(''),
    length = y.length;

  let total = 0;
  y.map((v, index) => {
    const value = parseInt(v) * Math.pow(10, index);
    total += value;
  })
  total = isNegativeNumber ? (0 - total) : total;
  if (total > INT_MAX || total < -(1 + INT_MAX)) {
    return 0;
  } else {
    return total;
  }
};
```

第二種方式其實跟第一種大同小異

只是我是利用數字十進位數的方式

使用迴圈加回去一個值

最後再檢查是否有超出32 bit

因為使用數字計算

所以效能提昇了不少

最高衝到了51 %

不過還是略有欠缺

若有其他解法再來更新
