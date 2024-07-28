---
title: SocketCluster Cluster initial.md
author: TomasLin
tags:
  - Nodejs
  - SocketCluster
date: 2020-09-09
categories:
  - Nodejs
---


# Basic Install

## Install

[nvm](https://github.com/nvm-sh/nvm)

```
  $ nvm install 14.9.0
  $ nvm use 14.9.0
  $ npm install -g socketcluster@16.0.1
  $ socketcluster --help
  $ socketcluster create helloworld
  $ cd helloworld
  $ yarn start // yarn start
  $ socketcluster run // run on docker
  $ curl http://localhost:8000/health-check // will get OK
```

也可以試著 使用瀏覽器打開 `http://localhost:8000/index.html`

預設會有一個簡單的頁面連線 websocket

初始化之後會有一個基礎的骨架來處理 http request 與 socket connections

### HTTP Request Handler

```javascript
;(async () => {
  for await (let requestData of httpServer.listener('request')) {
    expressApp.apply(null, requestData)
  }
})()
```

http 的部分不需要再增加程式碼

可以直接使用

### Socket connections

```javascript
;(async () => {
  for await (let { socket } of agServer.listener('connection')) {
    console.log('forawait -> socket.id', socket.id)
    // Handle socket connection.
  }
})()
```

#### Listen custom Event in socket

##### Server

```javascript
// SocketCluster/WebSocket connection handling loop.
;(async () => {
  for await (let { socket } of agServer.listener('connection')) {
    console.log(
      'forawait -> socket.id',
      socket.id
    )(
      // Handle socket connection.
      async () => {
        // Set up a loop to handle remote transmitted events.
        for await (let data of socket.receiver('helloworld')) {
          try {
            console.warn('forawait -> helloworld -> data', data)
          } catch (error) {
            console.log('forawait -> error.message', error.message)
          }          
        }
      }
    )()
  }
})()
```

可以再加上 `try catch` 來處理 Error

##### Client

```javascript
setTimeout(() => {
  socket.transmit('helloworld', 123)
}, 1000)
```

#### 也可以透過 `procedure` 回傳一些資訊

##### Server

```javascript
;(async () => {
  // Set up a loop to handle and respond to RPCs.
  for await (let request of socket.procedure('customProc')) {
    try {
      if (request.data && request.data.bad) {
        let badCustomError = new Error('Server failed to execute the procedure')
        badCustomError.name = 'BadCustomError'
        throw badCustomError
      }
      request.end('Success')
    } catch (error) {
      console.log('forawait -> customProc -> error.message', error.message)
      request.error(error)
    }
  }
})()
```

也可以利用 `request.error(error)` 來處理回傳錯誤

Client 也可以利用 `try catch` 來接收到錯誤

## Subscribe and Publish

另外也可以建立 `channel` 來處理 subscribe 與 publish

在 `Client` 中加上

```javascript
(async () => {
  let channel = socket.subscribe('foo');
  for await (let data of channel) {
    // ... Handle channel data.
  }
})();
```

就可以在開始聽取 `foo` 的頻道

接受該頻道的訊息

不只是 Server 的訊息會接收

其他 `Client` 也可以透過這些頻道彼此溝通

#### Client

不需要 acknowledgment 的訊息

```javascript
socket.transmitPublish('foo', 'This is some data');
```

需要 acknowledgment 的訊息

```javascript
await socket.invokePublish('foo', 'This is some more data');
```

#### Server

不需要 acknowledgment 的訊息

```javascript
agServer.exchange.transmitPublish('foo', 'This is some data');
```

需要 acknowledgment 的訊息

```javascript
await agServer.exchange.invokePublish('foo', 'This is some more data');
```

不管是 `Client` 或是 `Server` 如果是需要 acknowledmgment 的訊息
需要配合 `Consumers` 的配合

# 參考資料

[Basic Usage](https://socketcluster.io/docs/basic-usage/)
