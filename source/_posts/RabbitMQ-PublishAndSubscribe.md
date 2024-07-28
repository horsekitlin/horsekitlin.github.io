---
title: RabbitMQ-PublishAndSubscribe
author: TomasLin
date: 2017-05-26
tags:
  - MessageQueue
  - Nodejs
categories: RabbitMQ
---

# Publish and Subscribe

為了說明發布與訂閱

我們將會建立一個簡單的 log system

這包含了兩隻程式

一隻會發布 log

另一隻則會接收並且 print 在 console上

若我們有多個接收的程式

他們就都會接收到同樣的訊息

如此的話

我們就可以一個程式在接收到 Log 後寫入檔案

另一個接收到 Log 則將訊息顯示在螢幕上

也就是說也就是說發布的訊息將會被所有接收者接收

##  Exchanges

我們之前教學的內容

* 生產者負責發送訊息
* Queue 是任務的暫存區
* 客戶是負責接收訊息

RabbitMQ 的核心是生產者不直接發送任何訊息進入Queue

甚至也不知道 Message 發送後會進入哪一個Queue

生產者只需要將 Message 發送給 Exchange 就好了

Exchange 必須十分清楚接收到了訊息之後要如何處理

加入特定的 Queue?

加到多個 Queue?

或是應該捨棄

規則則由 Exchange type 定義

有幾種 Exchange type 可以使用

* Direct
* Topic
* headers
* fanout

這個範例是以 fanout 為主

先建立一個 fanout 類型的 type 命名為 log

```js
ch.assertExchange('logs', 'fanout', {durable: false});
```

fanout 主要就是廣播給所有的 channel 知道

很適合這次的 Log 範例

```
//Listing exchanges

列出可以使用的 Exchange type 可以使用命令列查詢

  $ sudo rabbitmqctl list_exchanges

列表會顯示 amq.*

發送預設的 Exchange
```
```js
  ch.sendToQueue('hello', new Buffer('Hello World!'));
```

我們發送一個 訊息

```js
ch.publish('logs', '', new Buffer('Hello World!'));
```

第二個值給空字串代表我們沒有要發送給其他 chaneel, 只有要發送給 log

### Temporary queues

可以將 Queue 定義一個 name

而 producers 要與 consumers 要共享時

就可以依據 name 做為指定 Queue 的依據

而對於每一個 Queue 重視的是當前的訊息

對於已經取得過的訊息並不重視

所以我們在取得一個新的 Queue 時有兩個事情是很重要的

1. 初始化必須是空的一個 Queue
2. 所有連結者斷線後，必須刪掉Queue

### Binding

剛剛有建立了一個 fanout 的 channel 名為 log

現在我們希望告訴這個 log 有訊息的時候可以通知我

這個行為叫做 binding

```js
ch.bindQueue(queue_name, 'logs', '');
```

```commandline
# 可以列出目前有binding 的 queue list

rabbitmqctl list_bindings
```

### Example

#### emeit_log.js

```js
const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (err, conn) {
  conn.createChannel(function (err, ch) {
    var ex = 'logs';
    var msg = process.argv.slice(2).join(' ') || 'Hello World!';

    ch.assertExchange(ex, 'fanout', { durable: false });
    ch.publish(ex, '', new Buffer(msg));
    console.log(" [x] Sent %s", msg);
  });

  setTimeout(function () { conn.close(); process.exit(0) }, 500);
});
```

#### recive_log.js

```js
var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (err, conn) {
  conn.createChannel(function (err, ch) {
    var ex = 'logs';

    ch.assertExchange(ex, 'fanout', { durable: false });

    ch.assertQueue('', { exclusive: true }, function (err, q) {
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
      ch.bindQueue(q.queue, ex, '');

      ch.consume(q.queue, function (msg) {
        console.log(" [x] %s", msg.content.toString());
      }, { noAck: true });
    });
  });
});
```