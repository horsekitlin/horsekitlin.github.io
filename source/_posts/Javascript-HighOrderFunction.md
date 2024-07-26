---
title: Javascript-High Order Function
author: TomasLin
tags:
  - Javascript
  - FunctionPrograming
date: 2018-02-02
categories: Javascript
---

# High Order Function

是一種 `接受 Funciton 回傳 Function 的 Function`

Map, Filter, Reduce 都是

## Function 回傳一個 Function

範例一

```javascript
//基本款
const sum = x => {
  return y => {
    return x + y;
  };
};

//簡潔款
const sum2 = x => y => x + y;
```

### applyTwice 就是一個 High Order Function

```javascript
const applyTwice = func => (...args) => func(func.apply(null, args));

console.log(applyTwice(x => "yo!" + x)("world"));
```

在 `func` 中回傳兩次呼叫的自己，

所以會收到 `yo!yo!world`

## Map

實作 Map

先來看看 `Array.prototype.Map` 是如何使用的

```javascript
const array = [1, 2, 3, 4];
array.map(item => console.log(item)); // 1,2,3,4
console.log(array.map(item => item + 1)); //[2,3,4,5]
```

不希望使用到 `prototype`

實作的時候會偏向 `lodash` 的 Map

```javascript
import _ from "lodash";
const array = [1, 2, 3, 4];
_.map(array, item => console.log(item)); //1,2,3,4
console.log(_.map(array, item => item + 1)); //[2,3,4,5]
```

真正來實作

```javascript
const map = (array, callback) => {
  if (array.length == 0) {
    return [];
  } else {
    const x = array.pop();
    map(array, callback) || [];
    callback(x);
  }
};

const arr = [1, 2, 3, 4];
map(array, item => console.log(item)); //1,2,3,4
console.log(map(array, item => item + 1)); //[]
```

似乎需要回傳一些東西

```javascript
const map = (array, callback) => {
  if (array.length == 0) {
    return [];
  } else {
    const x = array.pop();
    const result = map(array, callback) || [];
    result.push(callback(x));
    return result;
  }
};
const arr = [1, 2, 3, 4];
map(array, item => console.log(item)); //1,2,3,4
console.log(map(array, item => item + 1)); //[1,2,3,4]
```

## Filter

Filter 的使用範例

```javascript
const array = [1, 2, 3, 4, 5];
console.log(array.filter(x => x > 2)); // [3,4,5]
console.log(array.filter(x => x > 4)); // [ 5 ]
```

針對 Filter 的實作

```javascript
const array = [1, 2, 3, 4, 5];
const filter = func => array => {
  if (array.length === 0) {
    return [];
  } else {
    const [x, ...xs] = array;
    const filterResult = func(x) ? [x] : [];
    return [...filterResult, ...filter(func)(xs)];
  }
};
console.log(filter(x => x > 2)(array));
```

## Zip

Zip 就是將兩個陣列合成一個二維陣列大小以較小的陣列為基準

輸出結果

```javascript
zip([1, 2, 3])([0, 0, 0]) = [[1, 0], [2, 0], [3, 0]]
zip([1, 2, 3, 4, 5])([87]) = [[1, 87]]
```

```javascript
const zip = array1 => array2 => {
  if (array1.length === 0 || array2.lenght === 0) {
    return [];
  } else {
    const [x1, ...xs1] = array1;
    const [y1, ...ys1] = array2;
    const result = zip(xs1)(ys1);
    return [...result, [x1, y1]];
  }
};

console.log(zip([1, 2, 3])([0, 0, 0]));
```

## Quick Sort

```javascript
const quickSort = array => {
  if (array.length < 2) {
    return array;
  } else {
    const [basic, ...xs] = array;
    const left = xs.filter(item => item < basic);
    const right = xs.filter(item => item >= basic);
    return [...quickSort(left), basic, ...quickSort(right)];
  }
};

const array = [77, 1, 2, 5, 3, 2, 33, 34, 44, 66, 22];

console.log(quickSort(array)); //[ 1, 2, 2, 3, 5, 22, 33, 34, 44, 66, 77 ]
```

## Reduce

### 參數

Reduce 又稱為 Fold

Reduce 就與 Map 跟 Filter 不同了

Redcue 須傳入 function 與 初始值

且 Reduce 是依序接到四個變數︰

* accumulator

  * 累積值

* element 當前元素

* index - index

* array 正在執行 reduce 的陣列

Reduce 的遞迴實作

```javascript
const reduce = func => acc => array => {
  if (array.length == 0) {
    return acc;
  } else {
    const [x, ...xs] = array;
    return reduce(func)(func(acc, x))(xs);
  }
};
const reverse = reduce((acc, el) => [el, ...acc])([])([1, 2, 3]);
console.log(reverse);
```

functional

```javascript
const reduce = func => acc => array => {
  if (array.length == 0) {
    return acc;
  } else {
    const [x, ...xs] = array;
    return reduce(func)(func(acc, x))(xs);
  }
};
const reverse = reduce((acc, el) => [el, ...acc])([])([1, 2, 3]);
console.log(reverse);
```

# 參考資料

[關於 JS 中的淺拷貝和深拷貝](http://larry850806.github.io/2016/09/20/shallow-vs-deep-copy/)
