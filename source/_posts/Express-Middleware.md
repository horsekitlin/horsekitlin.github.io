---
title: Express-Middleware
author: TomasLin
tags:
  - Javascript
  - IThome2018
  - Reason
  - BuckleScript
categories:
  - Reason
date: 2018-10-27
---

# Middleware

昨天有用 Reason 寫出了一個 `helloworld`

今天來增加一些東西

* use
* Route
  * Middleware
  * 多個 Middleware
* Json

## use

`Express` 的 middleware 有兩種形式

一種是 `app.use`

他的 input 是 `handler`

```reason
/* 在上面的範例中  `require` 了一個 `express` 他是一個函式 它會回傳一個 `app` 的物件
然和對 `app` 的這個物件 有使用到兩個函式
`listen` 和 `get`
listen 會丟入一個參數(int)
get 會丟入兩個參數(string, function)
而在 get 中丟入的 function 會有兩個物件 `req`, `res`
因為只有使用到 `res.send`
大致上我們可以先宣告剛剛有提到函式 和參數的類型 */
type res = {.
  [@bs.meth] "send": string => string
 };

type nextFun = unit => string;
type handler = (string, res, nextFun) => string;

type expressApp = {.
  [@bs.meth] "use": handler => unit,
  [@bs.meth] "listen": (int) => unit,
  [@bs.meth] "get": (string, handler, handler) => string
};

[@bs.module] external express: unit => expressApp = "express";

let app = express();

app##use((_, _, next) => {
  Js.log("here is use function");
  next();
});

app##get("/", (_, _, next) => {
  Js.log("hello next");
  next();
}, (_, res, _) => res##send("Hello World!"));

app##listen(3000);
```

當你打開瀏覽器 `http://localhost:3000` 之後 

終端機會顯示 

```
here is use function
hello next
```

這樣就完成了 use 的使用

簡單吧!
