---
title: Leetcode-Q6
author: TomasLin
date: 2017-05-09
tags:
    - Javascript
    - Leetcode
categories: Leetcode
---

# 12 Integer to Roman

## Description

Given an integer, convert it to a roman numeral.

Input is guaranteed to be within the range from 1 to 3999.

這是進制的轉換

要將十進位進位轉換成羅馬數字

數字的範圍在1~3999

[關於羅馬數字的規則](https://zh.wikipedia.org/zh-tw/%E7%BD%97%E9%A9%AC%E6%95%B0%E5%AD%97)

* 羅馬數字總共會有七個 Ⅰ（1）、Ⅴ（5）、Ⅹ（10）、Ⅼ（50）、Ⅽ（100）、Ⅾ（500）和Ⅿ（1000）

* 重複數次：一個羅馬數字重複幾次，就表示這個數的幾倍

## Example

```js
const intToRoman = function (num) {
  if (num < 1 || num > 3999) {
    return '';
  }
  const lookup = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
  let romanStr = '';
  for (const key in lookup) {
    while (num >= lookup[key]) {
      romanStr += key;
      num -= lookup[key];
    }
  }
  return romanStr;
};
```

因為有規範在1~3999之間

所以先檢查 **num** 是否在這個區間

若不在的話則回傳空字串

先用一個物件將羅馬數字設為Key與十進位數字設為Value

準備等等做比對計算

然後使用一個迴圈依序對此物件中的各值去做轉換

在迴圈中加上一個 **while** 迴圈

當值比較大的時候

代表它可以在轉換一次

所以在romanStr中加上一次符號

num 在扣除相對的value

直到num為零為止

此時romanStr就是相對應的羅馬字串

回傳後就可以解答