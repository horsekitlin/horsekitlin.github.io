---
title: Leetcode-Q5
author: TomasLin
date: 2017-05-09
tags:
    - Javascript
    - Leetcode
categories: Leetcode
---

# 561 Array Partition I

## Description

Given an array of 2n integers, your task is to group these integers into n pairs of integer, 

say (a1, b1), (a2, b2), ..., (an, bn) which makes sum of min(ai, bi) for all i from 1 to n as large as possible.

一個 **2n** 個整數的陣列

將這些整入分成N對整數
 (a1, a2), (b1, b2).....

 並使(ai, bi)的最大總和數

## Hint

將陣列做排序

然後切個 n 個陣列 每個陣列兩個元素

再把各自陣列的第二個元素相加

就可以得到答案

## Example

```js
nums = nums.sort((a, b) => (a - b));
  let total = 0;
  for (let index = 0; index < nums.length; index += 2) {
    total += nums[index];
  }
  return total;
```

