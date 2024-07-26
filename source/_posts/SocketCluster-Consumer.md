---
title: SocketCluster-Consumer
author: TomasLin
tags:
  - Nodejs
  - SocketCluster
date: 2020-09-09
categories:
  - Nodejs
---

# Chennel

之前有聊到 Chennel 

但是當訊息量越來越大的時候

可以有一些機制來做傳遞與管理

在前端 Subscribe Channel 

```javascript
(async () => {
  let channel = socket.subscribe("foo");
  for await (let data of channel) {
    console.log("forawait -> data", data);
  }
})();
```

在多個前端可以 subscribe 同一個 channel 

代表各個前端可以互相溝通

# Consumers

SocketCluster 有多個函式可以針對 Channel 做控制

* socket.listener
* socket.receiver
* socket.procedure
* socket.channel

上述的 function 都會回傳 [async iterables](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of#Iterating_over_async_iterables)

代表可以透過這個方式來取得 `data`

```javascript
(async () => {
  for await (let { socket } of agServer.listener("connection")) {

    (async () => {
      for await (let data of socket.receiver('foo')) {
        console.log("forawait -> data", data)
      }
    })();
  }
})();
```

這個可以建立很多個不同的 並行 loop 在同一個 stream  上

但是有可能會需要更加有彈性的作法

或是需要有一些緩衝區域

再慢慢消耗的數據

[WritableConsumableStream repo](https://github.com/SocketCluster/writable-consumable-stream#writable-consumable-stream)

 可以參考這個做法

 ## WritableConsumableStream

 `for-await-of loop` 可以利用 `ConsumableStream class` 

 [ConsumableStream class Example](https://github.com/SocketCluster/consumable-stream)

 ## 可以自定義 socket consumer

 ```javascript
const connectionConsumerA = agServer.listener('connection').createConsumer();
const connectionConsumerB = agServer.listener('connection').createConsumer();

(async () => {
  for await (let {socket} of connectionConsumerA) {
    console.log(`Consumer ${connectionConsumerA.id} handled connection: ${socket.id}`);
  }
})();

(async () => {
  for await (let {socket} of connectionConsumerB) {
    console.log(`Consumer ${connectionConsumerB.id} handled connection: ${socket.id}`);
  }
})();

setTimeout(() => {
  // Kill only connectionConsumerA.
  connectionConsumerA.kill();
}, 1000);
 ```

 上述範例會建立兩個 stream 

 當一個 socket 連上也會同時連上兩個 consumer 

 兩個的 `socket.id` 也會是一致的

 而在一秒後會把 `connectionConsumerA` 的 socket 關閉

 所以一秒後只會有 `connectionConsumerB` 可以連上

 這樣可以更加彈性的控制 socket 的連線


## 可以在執行之前做一些事情

```javascript
(async () => {
  for await (let {socket} of agServer.listener('connection')) {

    (async () => {
      console.log('doSomethingWhichTakesAFewSeconds', socket.id)

      for await (let data of socket.receiver('foo')) {
        console.log("forawait -> data", data)
        // ...
      }
    })();

  }
})();
```

在每個連線之前都可以執行一段程式碼

共用邏輯可以放置在這邊

### 特殊情境

backend

```javascript
const sleep = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('doSomethingWhichTakesAFewSeconds');
      resolve();
    }, 1000)
  });
}
(async () => {
  for await (let {socket} of agServer.listener('connection')) {

    (async () => {
      await sleep();

      for await (let data of socket.receiver('foo')) {
        console.log("forawait -> data", data)
      }
    })();

  }
})();
```

frondend

```javascript
let socket = socketClusterClient.create();

for await (let event of socket.listener('connect')) {
  socket.transmit('foo', 123);
}
```

上述程式碼執行的時候

Backend 會因為 `await sleep();` 非同步問題

`socket.receiver('foo')` 在非同步之後

會無法執行到 `console.log("forawait -> data", data)`

所有的情境都會造成訊息的丟失

所以需要做一些調整

### 調整後

如果只是調整順序的話並不能解決問題

Backend <p style="color: red;">Bad</p>

```javascript
(async () => {
  for await (let {socket} of agServer.listener('connection')) {

    (async () => {
      // This will not work because the iterator is not yet created at this point.
      let fooStream = socket.receiver('foo');

      // If any messages arrive during this time, they will be ignored!
      await doSomethingWhichTakesAFewSeconds();

      // The iterator gets created (and starts buffering) here!
      for await (let data of fooStream) {
        // ...
      }
    })();

  }
})();
```

Backend <p style="color: green;">Good</p>

```javascript
(async () => {
  for await (let {socket} of agServer.listener('connection')) {

    (async () => {
      // This will create a consumable which will start buffering messages immediately.
      let fooStreamConsumable = socket.receiver('foo').createConsumer();

      await sleep();

      // This loop will start from the beginning of the buffer.
      for await (let data of fooStreamConsumable) {
        console.log("forawait -> data", data)
      }
    })();

  }
})();
```

下一個章節再來繼續處理一下 `API` 相關問題

# 參考資料

[Consumer](https://socketcluster.io/docs/consumers/)
