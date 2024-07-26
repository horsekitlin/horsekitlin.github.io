---
title: Express-MongoDB
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

# MongoDB

之前有提過如何使用 `NPM` 上的 package

今天來試試看串接一下 `MongoDB`

做最簡單的 `CRUD`

## Install

```
  $ npm install mongodb
```

### Nodejs version

```javascript
const express = require('express');
const userRouter = require('./routes/usersRoutes');

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'myproject';

MongoClient.connect(url, function(err, client) {
  const db = client.db(dbName);
  const collection = db.collection('documents');
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    console.log("Inserted 3 documents into the collection");
    console.log(result);
  });
  client.close();
});

const app = express();

const port = 5000;

app.use('/user', userRouter);

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```

可以看到在 `mongodb` 中有一個 `MongoClient` 他還有一個 `connect` 的 function

`connect` 有兩個參數 `(string, (err, client) => unit)`

以此類推

轉譯成 Reason

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

type router = {.
  [@bs.meth] "get": (string, handler) => string,
  [@bs.meth] "use": handler => unit
};

type dbErrorType = Js.t({. message: string });
type jsObjectType = {. };
type insertManyResultType = {. };
type insertRespType = (dbErrorType, insertManyResultType) => unit;
type collectionType = {.
  [@bs.meth] "insertMany": (array({. "a": int}), insertRespType) => unit
};
type dbType = {.
  [@bs.meth] "collection": (string) => collectionType
};

type clientType = Js.t({.
  [@bs.meth] db: string => dbType,
  [@bs.meth] close: unit => unit
});

type mongoClientType = {.
  [@bs.meth] "connect": (string, (dbErrorType, clientType) => unit) => unit
};

[@bs.module] external express: unit => expressApp = "express";
[@bs.module "mongodb"] external mongoClient: mongoClientType = "MongoClient";
[@bs.module "./routes/UserRoutes.bs"] external userRoutes: router = "routes";

let url = "mongodb://localhost:27017";
let dbName = "myproject";
mongoClient##connect(url, (error, client) => {
  let db = client##db(dbName);
  let collection = db##collection("documents");

  let inputData = [|{"a": 1}|];

  collection##insertMany(inputData, (_, result) => {
    Js.log("Inserted 3 documents into the collection");
    Js.log(result);
  });
  client##close();
});

let app = express();

[@bs.val] external use: handler => unit = "app.use";
[@bs.val] external useWithString: (string, router) => unit = "app.use";

use((_, _, next) => {
  Js.log("here is use function");
  next();
});

useWithString("/user", userRoutes);

app##get("/", (_, _, next) => {
  Js.log("hello next");
  next();
}, (_, res, _) => res##send("Hello World!"));

app##listen(5000);
```

再重寫的時候會複習一下之前討論過的很多資料型態

發現不夠熟練

```reason
let list1 = [0,1];
let array1 = [|0, 1|];
```

這兩種的轉譯結果會是

```javascript
var list1 = /* :: */[
  0,
  /* :: */[
    1,
    /* [] */0
  ]
];

var array1 = /* array */[
  0,
  1
];
```

可以看到這兩個的結果和原本預計的會有所不同

```reason
type obj2Type = Js.t({
  .
  a: string
});

let obj1: {. "a": string} = {"a": "a"};
let obj2 = {"a": "a", "b": "b"};
```

上述的範例中 `obj1` 如果不定長度的話會引起錯誤

`obj2` 可以是任意長度 (Json)

轉譯結果

```javascript
var obj1 = {
  a: "a"
};

var obj2 = {
  a: "a",
  b: "b"
};
```