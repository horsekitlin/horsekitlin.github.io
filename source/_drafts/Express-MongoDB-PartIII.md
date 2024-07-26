---
title: Express-MongoDB-PartIII
author: TomasLin
tags:
  - Javascript
  - IThome2018
  - Reason
  - BuckleScript
categories:
  - Reason
---

# MongoDB

之前有寫過一個簡單的 `MongoDB` 的版本

但是使用上很複雜

其實到今天我回去看的時候還是覺得很頭痛

之前有提到 `module`

那麼可不可以利用 `module` 來寫應該會更清楚

找到了 [bs-mongodb](https://github.com/stroiman/bs-mongodb)

參考他的程式碼來寫一個版本

## bs-mongodb Usage

```
  $ npm install mongodb
  $ npm install -D bs-mongodb @stroiman/async
```

*bsconfig.json*
```json
{
  ...
  "bs-dev-dependencies": [
    "@glennsl/bs-jest"
  ],
  "bs-dependencies": [
    "bs-mongodb",
    "@stroiman/async"
  ]
}
```

```reason
open MongoDB;

module AsyncHandler : CallbackHandler with type t('a) = Async.t('a) = {
  type t('a) = Async.t('a);
  let callbackConverter = (x:callback('a)) : Async.t('a) => x |> Async.from_js;
};

include Make(AsyncHandler);

let url = "mongodb://localhost:27017";
let dbName = "myproject";

connect(url) |> Js.log; /* Function */
```

這邊還有點困惑怎麼去取得連線

他這個 Function 應該是 `callbackConverter`

先跟著他打一次會比較了解

## 自己跟著學 bs-mongodb

### callback

首先遇到的第一個難關是 `callback`

之前沒寫過強型態

所以光看懂這個 `callback` 和之後的 `callbackConvert` 就花很多時間了

甚至再加上 `pipe` 根本世界末日

先來一個一個解決

```reason
type callback('a) = ((string) => unit) => unit;
let func = (par1: string) => {
  Js.log(par1);
};

let cb: callback('a) = (func) => {
  func("123");
};

cb(func);
```

先用 `'a` 取代 `MongoError.t`不然一次太多很難理解

先實做一個  `callback`

針對 `connect` 這個 function 會有兩個參數

第一個參數是 `error` 第二個參數 是 `client`

所以會變成

### Make

看完 `bs-mongodb` 頭其實蠻大的

之前有看過 module 的章節

但是對於 module 不太了解

為什麼 module 還可以定義 `function`?

還叫做 `functor` ?

