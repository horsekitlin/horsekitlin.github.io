---
title: Leedcode-Q7
author: TomasLin
date: 2017-10-23
tags:
    - Javascript
    - Leetcode
categories: Leetcode
---

# Hamming Distansce (漢明距離)

## 定義

  將一個字符串變換成另一個字符串所需要替換的字符個數

# 題目

```

0 ≤ x, y < 231.

Input: x = 1, y = 4

Output: 2

Explanation:
1   (0 0 0 1)
4   (0 1 0 0)
       ↑   ↑

The above arrows point to positions where the corresponding bits are different.
```

將 1 轉為二進位的字串則是 `1`, 4 轉為二進位的字串則是 `1000`

但是計算漢明距離時必須是兩個等長的符號

所以必須幫 `1` 補零為 `0001`

`0`00`1`

`1`00`0`

所以需要替換兩個字符

所以回傳值為 2

# Javascript 的位元運算子

## ^

XOR assignment

將數字轉為二進位之後再做比對的計算

### Example

[Rule](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Bitwise_XOR)

3 ^ 5 = 6

`011`

`101`

---

`110`

再將 110 轉為十進制則為 6

也就是說當當兩個同位元做比對的規則是

`數值相同則為 0 不相同則為 1`

我們可以和另外一個運算子 | 做比較

因為在官方的範例中

他們的結果都是一樣的

但是測試之後結過卻還是不一樣

### Example 2

3 | 5 = 7

[Rule](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Bitwise_OR)

`011`

`101`

---

`111`

再將 111 轉為十進制則為 7

也就是 OR 的比對規則是只要有一個為 1 就等於 1

## &

Bitwise AND assignment

[Rule](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Bitwise_AND)

也就是說如果同位元的都為 1 才會等於 1

否則其餘狀況皆為零


# Result

```js
/**
 * @param {number} x
 * @param {number} y
 * @return {number}
 */
var hammingDistance = function(x, y) {
    let ans = 0;
    while(x || y){
        ans += (x & 1) ^ (y & 1);
        x >>= 1;
        y >>= 1;
    }
    return ans;
};
```

利用 while 迴圈

x & 1 與 y & 1 會取得最後一位檢查是否為零

若是 0 則為 0, 若為 1 則為 1

其結果在使用 XOR(^) 來作判斷是否相同

若同為 0 或 1 則回傳 0

若一個為 0 一個為 1 的時候回傳 1

將結果疊加在 ans 上

最後再將 x y 做[Right shift](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/Assignment_Operators#Right_shift_assignment)

之後再將 ans 回傳即為我們需要的結果


# 參考資料


[漢明距離](https://zh.wikipedia.org/wiki/%E6%B1%89%E6%98%8E%E8%B7%9D%E7%A6%BB)

[漢明重量](https://zh.wikipedia.org/wiki/%E6%B1%89%E6%98%8E%E9%87%8D%E9%87%8F)

[Javascript 運算子](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators)