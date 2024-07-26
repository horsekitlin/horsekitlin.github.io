---
title: Reason-ExternalPromiseAPI
author: TomasLin
tags:
  - Javascript
  - IThome2018
  - Reason
categories:
  - Reason
date: 2018-11-04
---


# External Mongo client

```reason
let url = "mongodb://localhost:27017";
let dbName = "myproject";

[@bs.module "mongodb"] external connect: (string) => Js.Promise.t('a) = "";
let connection = (url) => connect(url);
```

`connection`會取得一個 `Promise` 的回傳值

之後只要利用它就可以用 `Promise` 的模式來對 MongoDB 進行控制

```reason
[@bs.module "mongodb"] external connect: (string) => Js.Promise.t('a) = "";
let connect = (url) => connect(url);

module ObjectID = {
  type t;
  [@bs.send.pipe : t] external toHexString : string = "";
  [@bs.new] [@bs.module "mongodb"] external from_string : string => t = "ObjectID";
  [@bs.new] [@bs.module "mongodb"] external make : t = "ObjectID";
};

module type TConfig = {
  let url: string;
  let dbName: string;
};

module CreateConnection = (Config: TConfig) => {
  let url = Config.url;
  let dbName = Config.dbName;

  module Db = {
    type t;
  };

  module Client = {
    type t;
    [@bs.send] external db : (t, string) => Db.t = "";
    let db = (client, name) => db(client, name);
  };

  module Collection = {
    type t;
  };

  let clientPromise: Js.Promise.t(Client.t) = connect(url);

  let createDB: string => Js.Promise.t(Db.t) = (name) => 
    clientPromise |> Js.Promise.then_((client) => {
      Js.Promise.resolve(Client.db(client, name));
    });
}

module Config = {
  let url = "mongodb://localhost:27017";
  let dbName = "myproject";
};

module Connection = CreateConnection(Config);
```

幾本的程式碼

其中也有一部分利用 `functor` 建立一個 `module`

但是總覺得這樣並不好

詳細要怎樣時做可能還需要一點時間處理

要準備開始 ReasonReact 了

先繼續往下走吧