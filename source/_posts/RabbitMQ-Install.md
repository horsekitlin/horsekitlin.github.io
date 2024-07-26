---
title: RabbitMQ-Install
author: TomasLin
date: 2017-05-22
tags: 
  - MessageQueue
  - Nodejs
categories: RabbitMQ
---

# Rabbit Message Queue

## Installing on Homebrew

### Step 1

```
  $ brew update
```

### Step 2

```
  $ brew install rabbitmq
```

### Step 3

```
  $ rabbitmqctl status
```

## Example

### Client

send.js

```js
const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (err, conn) {
  conn.createChannel((err, ch) => {
    const q = 'hello';
    const msg = 'Hello World!';

    ch.assertQueue(q, { durable: false });
    ch.sendToQueue(q, new Buffer('Hello world'));
    console.log(" [x] Sent 'Hello World!'");

  });
  setTimeout(function () { conn.close(); process.exit(0) }, 500);
});
```

### Server

receive.js

```js
const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (err, conn) {
  conn.createChannel((err, ch) => {
    const q = 'hello';
    const msg = 'Hello World!';

    ch.assertQueue(q, { durable: false });
    ch.sendToQueue(q, new Buffer('Hello world'));
  
  });
  setTimeout(function () { conn.close(); process.exit(0) }, 500);
});
```

### Result

![Demo Result]('../images/rabitmq/rabbitmqdemo.png')

## 參考文章

[install](https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html)
