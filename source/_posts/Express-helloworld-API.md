---
title: Express-helloworld-API
author: TomasLin
tags:
  - Javascript
  - IThome2018
  - Reason
  - BuckleScript
categories:
  - Reason
date: 2018-10-21
---

# Express API

之前聊了很多基本的型態和使用

開始來做一些實際的東西(不然有點無聊)

在 `Nodejs` 中似乎想到 API

都會先想到 `Express`

今天先用 Reason 寫一個 Express 的 hello world API

但是在這之前

我們先用最簡單的 nodejs 寫一個 Express hello world API

然後再慢慢轉為 Reason

## Hello world

安裝 `express` 和開始 watch `re` 檔案

```
  $ npm install express
  $ yarn start 
```

app.js
```javascript
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port);
```

![Image](../../../../images/express_helloworld/helloworld.png)

### 步驟

在上面的範例中  `require` 了一個 `express` 他是一個函式 它會回傳一個 `app` 的物件

然和對 `app` 的這個物件 有使用到兩個函式

`listen` 和 `get`

listen 會丟入一個參數(int)

get 會丟入兩個參數(string, function)

而在 get 中丟入的 function 會有兩個物件 `req`, `res`

因為只有使用到 `res.send`

大致上我們可以先宣告剛剛有提到函式 和參數的類型

再寫上 `express` 的程式

結果如下

```reason
type res = {.
  [@bs.meth] "send": string => string
 };
type handler = (string, res) => string;
type expressApp = {.
  [@bs.meth] "listen": (int) => unit,
  [@bs.meth] "get": (string, handler) => string
};

[@bs.module] external express: unit => expressApp = "express";

let app = express();

app##get("/", (_, res) => res##send("Hello World!"));

app##listen(3000);
```

有一些東西看不懂

### BuckleScript - Class

裡面有些東西和 `BuckleScript` 的 `Class` 有關係

先來聊聊 在 `Reason` 中如何使用 class `new` 出一個物件

#### @bs.new

以 `Date` 為範例

```reason
type t;
[@bs.new] external createDate: unit => t = "Date";

let date = createDate();
```

上面的程式碼會編譯為
```javascript
var date = new Date();
```

如果你想要用 [moment](http://momentjs.com/)

可以利用 `@bs.new` 和 `@bs.module`

並且設定回傳可以使用的 `method`

```reason
type momentResult = {.
  [@bs.meth] "format": (string) => string
};

[@bs.new] [@bs.module]  external moment: unit => momentResult = "";

let date = moment();
Js.log(date##format("YYYY"));
```

上面的程式碼會轉為

```javascript
var Moment = require("moment");

var date = new Moment();

console.log(date.format("YYYY")); /* 2018 */
```

主要是因為在 `moment` 增加一個回傳的 `momentResult` 的類型

代表回傳了一個 Javascript 物件 裡面有一個 `format` 的函式可以使用

需要傳入一個 string 會回傳一個 string

#### 綁定 JS Class

JS Class 其實就是 Object 和 Class 利用一些方式連接起來

OCaml 通常會增加 `[@bs]` 將 class 轉為 `Js.t` 類型

```reason
class type _moment =
  [@bs]
  {
    pub format: (string) => string;
  };
type momentResult = Js.t(_moment);

[@bs.new] [@bs.module]  external moment: unit => momentResult = "";
let date = moment();
Js.log(date##format("YYYY")); /* 2018 */
```

這個做法也是可以

結果是同樣的

但是這個做法可以使用 `[@bs.meth]` 來宣告非 `arrow function`

這些值會被視為 `properties`

`[@bs.set]` 則會將這些參數視為可以更動的 (`mutable`)

之後要修改值的時候要使用 `#=`

刪除 `[@bs.set]` 則會變為 不可變動的(`immutable`)

**這部分之後在 JS package 中會做更詳細的討論**

### Middleware

先實做一個 簡單的 `Middleware`

```reason
type res = {.
  [@bs.meth] "send": string => string
 };

type nextFun = unit => string;
type handler = (string, res, nextFun) => string;

type expressApp = {.
  [@bs.meth] "listen": (int) => unit,
  [@bs.meth] "get": (string, handler, handler) => string
};

[@bs.module] external express: unit => expressApp = "express";

let app = express();

app##get("/", (_, _, next) => {
  Js.log("hello next");
  next();
}, (_, res, _) => res##send("Hello World!"));

app##listen(3000);
```

但是每次多一個 middleware 都要對一個 type 做一次修改

感覺很麻煩啊

今天先到這邊吧

之後再來處理 `Middleware` 的問題了