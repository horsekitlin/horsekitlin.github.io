---
title: BuckleScript-Function
author: TomasLin
tags:
  - Javascript
  - IThome2018
  - Reason
  - BuckleScript
categories:
  - Reason
date: 2018-10-29
---


# MongoDB 的 CRUD

昨天我們引入了 `mongoDB` 今天來整理一下寫一個 `module`

按照慣例先來一個 `Javascript` 版本

`src/mongoManager/index.js`
```javascript
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'myproject';

class mongoDBManagerClass {
  initialDB({url, dbName}){
    return new Promise((resolve) => {
      MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
        this._client = client;
        this._db = client.db(dbName);
        this._document = this._db.collection('documents');
        resolve();
      });
    });
  }
  
  insertManyDocument(array) {
    return new Promise((resolve, reject) => {
      this._document.insertMany(array,(error, result) => {
        if(error) reject(error);
        else resolve(result);
      });
    })
  }

  closeClient() {
    this._client.close();
  }
}

const mongoDBManager = new mongoDBManagerClass({url, dbName});

module.exports = mongoDBManager;
```

`src/app.js`
```javascript
const express = require('express');
const userRouter = require('./routes/usersRoutes');
const mongoDBManager = require('./mongodbManager');

const url = 'mongodb://localhost:27017';
const dbName = 'myproject';

mongoDBManager
  .initialDB({url, dbName})
  .then(() => {
    return mongoDBManager.insertManyDocument([{a : 1}])
  })
  .then(() => mongoDBManager.closeClient());

const app = express();
const port = 5000;
app.use('/user', userRouter);
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```

