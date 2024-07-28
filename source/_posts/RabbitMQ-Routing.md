---
title: RabbitMQ-Routing
author: TomasLin
date: 2017-05-27
tags:
  - MessageQueue
  - Nodejs
categories: RabbitMQ
---

# Routing

之前完成了 fanout 的 logging system

但是我們不希望每一則訊息都會通知到每一個人

也希望會有一些特定的訊息推送

這時就可以利用 direct 來做訊息的發送

可是 direct 並沒有辦法做到多個條件分類 Route

因為不希望 logging system 只能依據嚴重性來發送訊息

例如 unix 中的 syslog 中就可以依據嚴重性或是設備其他條件來發訊息傳遞

會更加彈性化

此時為了要達到這個需要

必須使用較為複雜的 **topic exchange**

## Topic Exchange

當訊息發送到 topic exchage 的時候 *route_key* 是由多個字使用 **.** 來做分隔組成

這些字也不是隨意選定

通常都代表著 features

Example:

* "stock.usd.nyse"
* "nyse.vmw"
* "quick.orange.rabbit".

上述都是可以當成 Routing 的範例

最多可以接受 255 bytes 的大小

### Binding Key

可以有兩種特別的綁定方式

* '*' (star) 可以取代一個字
* '#' (hash) 可以取代零或多個字

### Example

範例中我們發送關於描述動物的訊息

訊息將會以三個字(兩個.)的方式來發送

第一個字描述速度

第二個字描述描述顏色

第三個描述種類

建立建立三種不同的 Binding key

1.  "*.orange.*" //所有橘色的動物
2. "*.*.rabbit" // 所有兔子類的動物
3. "lazy.#" // 所有 lazy 的動物

若發送一個 "quick.orange.rabbit" 會發送給兩個 Queue

"lazy.orange.elephone" 也會發送給兩個 Queue

"quick.orange.fox" 只會發送給一個 Queue

"quick.brown.fox" 則不會發送給任何 Queue 而被棄用

若我們發送單一字節 如"Orange" 

這些都不會符合 binding routing

發送四個字節 "quick.orange.male.rabbit"

因為最後一個字節有符合

將會被傳到第二個 Queue

```
Topic  Exchange

Topic Exchange 是相當強大的 Exchange

而且可以模仿其他不同的 Exchange

如果有你使用 "#" 則可以取得所有 Exchange 

效果就如同 fanout

若是沒有使用 "*", "#" 來做 Routing

效果則是如同 direct一樣

## Putting it all together

### emit_log_topic.js

```js
const amqp = require('amqplib/callback_api');

amqp.connect('amqp:localhost', function (err, conn) {
  conn.createChannel(function (err, ch) {
    const ex = 'topic_logs';
    const args = process.argv.slice(2);
    const key = (args.length > 0) ? args[0] : 'anonymous.info';
    const msg = args.slice(1).join(' ') || 'Hello World';

    ch.assertExchange(ex, 'topic', { durable: false });
    ch.publish(ex, key, new Buffer(msg));
    console.log(" [x] Sent %s:'%s'", key, msg);
  });

  setTimeout(function () { conn.close(); process.exit(0) }, 500);
});
```

### receive_logs_topic.js

```js
const amqp = require('amqplib/callback_api');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Usage: receive_logs_topic.js <facility>.<severity>");
  process.exit(1);
}

amqp.connect('amqp://localhost', function (err, conn) {
  console.log(err);
  conn.createChannel(function (err, ch) {
    const ex = 'topic_logs';

    ch.assertExchange(ex, 'topic', { durable: false });

    ch.assertQueue('', { exclusive: true }, function (err, q) {
      console.log(' [*] Waiting for logs. To exit press CTRL+C');

      args.forEach(function (key) {
        ch.bindQueue(q.queue, ex, key);
      });

      ch.consume(q.queue, function (msg) {
        console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
      }, { noAck: true });
    });
  });
});
```
