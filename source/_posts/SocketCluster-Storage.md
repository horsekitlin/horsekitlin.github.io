---
title: SociekCluster-Storage
author: TomasLin
tags:
  - Nodejs
  - SocketCluster
date: 2020-09-21
categories:
  - Nodejs
---

# Mongodb

以 Mongodb 為範例

```
  $ git clone git@github.com:SocketCluster/scc-broker.git scc-mongo-broker && cd scc-mongo-broker
  $ yarn install
  $ yarn add mongoose dotenv
  $ mkdir models
```

**models/tankModel.js**

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new mongoose.Schema({ name: 'string', size: 'string' });
const Tank = mongoose.model('Tank', schema);
// Tank.create({ size: 'small' }, function (err, small) {
//   if (err) return handleError(err);
//   // saved!
// });


Tank.find().then(result => {
  console.log('AL: result', result)
}).catch(error => {
  console.log('AL: error', error)
})

module.exports = Tank;
```

**server.js**

```javascript
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/test?poolSize=4';
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology:true});
// mongoose.createConnection(uri, {useUnifiedTopology: true});

const Tank = require('./models/tankModel');
dotenv.config();

```

# 參考資料

[mongoose](https://mongoosejs.com/)

[scc-broker](https://github.com/SocketCluster/scc-broker)

[sc-redis](https://github.com/SocketCluster/sc-redis)

[sc-rabbitmq](https://github.com/SocketCluster/sc-rabbitmq)

[sc-error](https://github.com/SocketCluster/sc-errors)
