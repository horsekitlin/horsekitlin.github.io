---
title: Express-MongoDB-PartII
author: TomasLin
tags:
  - Javascript
  - IThome2018
  - Reason
  - BuckleScript
categories:
  - Reason
date: 2018-10-28
---


在準備 `MongoDBManager` 的時候遇到兩個蠻大的問題

今天先補上這兩個部分的筆記

* Promise
* Pipe

## Promise

callback 在之前就有範例了

但是如何在 Reason 中實作 `Promise` 呢？

我們知道 `Promise` 最常用的是 `resolve` `then` 和 `catch`

這部分 [BuckleScript](https://bucklescript.github.io/bucklescript/api/Js.Promise.html) 已經有實作支援

* Js.Promise.resolve: 'a => Js.Promise.t('a)
* Js.Promise.then_: ('a => Js.Promise.t('b), Js.Promise.t('a)) => Js.Promise.t('b)
* Js.Promise.catch: (Js.Promise.error => Js.Promise.t('a), Js.Promise.t('a)) => Js.Promise.t('a)

但是這只是表示了 JS 中 Reason 的型態

在 Reason 中新增一個 `Promise` 其實 BuckleScript 也有提供建立的方法

* Js.Promise.make: ( ( ~resolve: (. 'a) => unit, ~reject: (. exn) => unit ) => unit ) => Js.Promise.t('a)

### 範例

```reason
let myPromise = Js.Promise.make((~resolve, ~reject) => resolve(. 2));
myPromise
|> Js.Promise.then_(value => {
  Js.log(value);
  Js.Promise.resolve(value + 2);
})
|> Js.Promise.then_(value => {
  Js.log(value);
  Js.Promise.resolve(value + 3);
})
|> Js.Promise.catch(err => {
  Js.log2("Failure!!", err);
  Js.Promise.resolve(-2);
});
/*
2
4
*/
```

我們要如何寫一個 `function` 裡面包含 `Promise` 呢？

```javascript
const sleep = (ms = 1000) => {
  return new Promise(resolve => {
    setTimeout(() => console.log('wake up'), ms);
  });
}

sleep(2000);
```

```reason
[@bs.val] external setTimeout: (unit => unit, int) => unit = "";

let sleep = (ms: int) => 
  Js.Promise.make((~resolve, ~reject) =>
    setTimeout(() => resolve(. () => Js.log("wake up")), ms));
```

那麼上方的範例也可以更改為

```reason
let addTwoPromise = (value: int) => 
  Js.Promise.make((~resolve, ~reject) => {
    Js.log(value);
    resolve(. value + 2);
  });

let addThreePromise = (value: int) =>
  Js.Promise.make((~resolve, ~reject) => {
    Js.log(value);
    resolve(. value + 3);
  });

let errorHandler = (error) =>
  Js.Promise.make((~resolve, ~reject) => {
    Js.log2("Failure!!", error);
    resolve(. -2);
  });

myPromise
|> Js.Promise.then_(addTwoPromise)
|> Js.Promise.then_(addThreePromise)
|> Js.Promise.catch(errorHandler);
```

因為我們準備做一個 `MongoDBModule`

所以也要試試在 module 中實作 `Promise method`

```reason
module MyPromiseModule {
  let value = 2;

  let myPromise = Js.Promise.make((~resolve, ~reject) => resolve(. value));

  let addTwoPromise = (value) => 
  Js.Promise.make((~resolve, ~reject) => {
    Js.log(value);
    resolve(. value + 2);
  });

  let addThreePromise = (value) =>
  Js.Promise.make((~resolve, ~reject) => {
    Js.log(value);
    resolve(. value + 3);
  });

  let errorHandler = (error) =>
  Js.Promise.make((~resolve, ~reject) => {
    Js.log2("Failure!!", error);
    resolve(. -2);
  });
};

MyPromiseModule.myPromise
|> Js.Promise.then_(MyPromiseModule.addTwoPromise)
|> Js.Promise.then_(MyPromiseModule.addThreePromise)
|> Js.Promise.catch(MyPromiseModule.errorHandler);
```

## Pipe

其實上面已經有使用 `Pipe`

在這裡補充一下

`->` 是 Reason 提供的運算子

可以幫助將 `b(a)` 轉換為 `b->a`

`validateAge(getAge(parseData(person)))`

這個 function 其實有點難以閱讀

但是經過 `->` 運算子之後

```reason
person
  ->parseData
  ->getAge
  ->validateAge
```

可以很清楚地瞭解他的脈絡順序

`a(one, two, three)` 也可以寫為 `one->a(two, three)`

還有一些 function chain 的延伸
