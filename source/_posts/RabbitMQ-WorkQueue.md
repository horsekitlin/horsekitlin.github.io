---
title: RabbitMQ-WorkQueue
author: TomasLin
date: 2017-05-24
tags:
  - MessageQueue
  - Nodejs
categories: RabbitMQ
---

# Work Queues

避免一些佔用大量資源或是時間的工作，

我們幫每份工作定義一個 channel

透過 MessageQueue 發送文字訊息

通知增加一個 Task 

而 Queue 會自動在未來某個時間點處理這件事情

### Round-robin dispatching

使用任務隊列的優點之一是能夠輕鬆地併行工作

如果我們正在建立許多的的工作

我們可以增加更多的worker

這樣可以輕易地擴充架構

#### 範例

下列的範例可以開三個 Terminal console

兩個執行 work.js

而一個執行 new_task.js

```
# shell 1
  $ node worker.js
```

```
  $ node worker.js
```

在第三個我們將發布新的任務

一旦您開始使用消費者

您可以發布一些消息

```
  # shell 3
  ./new_task.js First message.
  ./new_task.js Second message..
  ./new_task.js Third message...
  ./new_task.js Fourth message....
  ./new_task.js Fifth message.....
```

執行結果

```
  # shell 1
  ./worker.js
  # => [*] Waiting for messages. To exit press CTRL+C
  # => [x] Received 'First message.'
  # => [x] Received 'Third message...'
  # => [x] Received 'Fifth message.....'
```

```
  # shell 2
  ./worker.js
  # => [*] Waiting for messages. To exit press CTRL+C
  # => [x] Received 'Second message..'
  # => [x] Received 'Fourth message....'
```

## Message acknowledgment

如果有一個長時間的任務

在執行過程中 crash

我們將會失去這個執行的任務

但是我們不希望失去任務

所以我們可以把任務交給其他的 **worker**

為了確保任務不會消失

所以提供了 **Message acknowledgment (消息確認)**

若是 worker Crash 連接關閉或 TCP 連接結束

並不發送確認訊息

**RabbitMQ** 將會重新排隊

若有其他 worker 則會將任務轉給其他 worker

所以即使有長時間執行的任務

也會確保該任務執行完成不會丟失

在上一個例子中

消息確認功能被關閉

** {noAck: false} **

```js
ch.consume(q, function(msg) {
  var secs = msg.content.toString().split('.').length - 1;

  console.log(" [x] Received %s", msg.content.toString());
  setTimeout(function() {
    console.log(" [x] Done");
    ch.ack(msg);
  }, secs * 1000);
}, {noAck: false});
```

上述範例可以確認任務會執行

若 worker Crash 也會把任務重新執行



```note
忘記確認

錯過這個錯誤是一個常見的錯誤

這是一個容易的錯誤

但後果是嚴重的

當您的客戶端退出（可能看起來像隨機重新傳遞）時

消息將被重新傳遞

但是RabbitMQ將會消耗越來越多的內存

因為它將無法釋放任何未包含的消息
```

## Message durability

我們已經學會瞭如何確保即使 worker Crash

任務也不會丟失

但是如果RabbitMQ服務器停止

我們的任務仍然會丟失

當RabbitMQ退出或崩潰時

它會忘記隊列和消息

需要兩件事來確保消息不會丟失：我們需要將 **Queue** 和消息 durable 設定為 true

```
ch.assertQueue('hello', {durable: true});
```

雖然這個命令本身是正確的

但是在我們目前的設置中是不行的

這是因為我們已經定義了一個不耐用的名為 **hello** 的隊列。

**RabbitMQ** 不允許您重新定義具有不同參數的現有隊列

並會向嘗試執行此操作的任何程序返回錯誤

但是有一個快速的解決方法 - 讓我們用不同的名稱聲明一個隊列

例如task_queue

```
ch.assertQueue('task_queue', {durable: true});
```

這種持久的選項更改需要適用於 **new_task** 和 **worker**代碼。

在這一點上 我們確信

即使RabbitMQ重新啟動

**task_queue** Queue也不會丟失

現在我們需要使用持久化選項 **Channel.sendToQueue** 來將消息標記為持久性

```
ch.sendToQueue(q, new Buffer(msg), {persistent: true});
```

```

注意消息持久性

將消息標記為持久性不能完全保證消息不會丟失

雖然它告訴RabbitMQ將消息保存到硬碟

但是當RabbitMQ接受消息並且還沒有保存時

仍然有一個很短的時間窗口

RabbitMQ不會對每個消息執行fsync（2） - 它可能只是保存到緩存中

而不是真正寫入磁盤

持久性保證不強

但對我們的簡單任務隊列來說已經足夠了

如果您需要更強大的保證

那麼您可以使用發布商確認

```

### Fair dispatch

您可能已經注意到

dispatching 仍然無法正常工作

例如在兩個 **worker** 的情況下

當所有奇怪的信息都很消耗資源與時間

甚至信息很小的時候

一個**worker**將不斷忙碌

另一個**worker**幾乎不會做任何工作

那麼 **RabbitMQ** 還會平均分配消息

這是因為當消息進入隊列時

**RabbitMQ**只會分派消息

它不看 **sender** 的未確認消息的數量

它只是盲目地向第n個 **sender** 發送每個第n個消息。

```
ch.prefetch(1);
```

```
注意 Queue大小

如果所有的 **worker** 都忙

你的Queue可以填滿

你會想要注意的是

也許增加更多的 worker 或者有其他的策略

```

## Server

```js
const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (err, conn) {
  conn.createChannel(function (err, ch) {
    var q = 'task';

    ch.assertQueue(q, { durable: true });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function (msg) {
      var secs = msg.content.toString().split('.').length - 1;

      console.log(" [x] Received %s", msg.content.toString());
      setTimeout(function () {
        console.log(" [x] Done");
        ch.ack(msg);
      }, secs * 1000);
    }, { noAck: false });
  });
});
```

## Client

new_task.js

```js
const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (err, conn) {
  conn.createChannel(function (err, ch) {
    const q = 'task';
    const msg = process.argv.slice(2).join(' ') || 'Hello world!';
    ch.assertQueue(q, { durable: true });
    ch.sendToQueue(q, new Buffer(msg), { persistent: true });

    console.log(" [x] Sent '%s'", msg);
  });
  setTimeout(function () { conn.close(); process.exit(0) }, 500);
});
```
