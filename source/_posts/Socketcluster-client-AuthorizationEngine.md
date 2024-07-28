---
title: Socketcluster-client-AuthorizationEngine
author: TomasLin
tags:
  - SocketCluster
  - Nodejs
date: 2020-09-22
categories:
  - Nodejs
---

# 需求

處理 `JWT` 的時候如果在瀏覽器可以將 token 存在 `localStorage` 中的 `socketcluster.authToken`

但是如果在 React Native 中沒有 localStorage 的模組

可以使用 [jest-localstorage-mock](https://github.com/clarkbw/jest-localstorage-mock/tree/master/src)

來處理這個問題

但是這樣很醜

希望可以自己控制 Authorization 流程

所以去爬了一下 source code

資訊在參考資料

這部分文件沒有寫得很清楚

所以花了一個篇幅來記錄一下如何客製化 Authorization

## Server

server.js

在 `agOptions` 中加入 `authKey: SCC_AUTH_KEY`

這時候就會把這個參數帶入 `agServer.signatureKey`

所有對外的服務可以放入同樣的 `authKey`

彼此就可以共用同樣的 `token`

### Login

```javascript
expressApp.get('/login', async (req, res) => {
  const signedTokenString = await agServer.auth.signToken(
    myTokenData,
    agServer.signatureKey
  )
  res.status(200).json({
    token: signedTokenString,
  })
})
```

### Websocket flow

```javascript
agServer.setMiddleware(
  agServer.MIDDLEWARE_INBOUND,
  async (middlewareStream) => {
    for await (let action of middlewareStream) {
      let authToken = action.socket.authToken
      if (isEmpty(authToken)) {
        const notAllowError = new Error('not allow')
        notAllowError.name = 'InvalidActionError'
        action.block(notAllowError)
        action.request.error(notAllowError)
        console.log('AL: action.request.error', action.request.error)
        return
      }
      try {
        await agServer.auth.verifyToken(bearerToken, agServer.signatureKey)
      } catch (error) {
        const notAllowError = new Error('not allow')
        notAllowError.name = 'InvalidActionError'
        action.block(notAllowError)
        action.request.error(notAllowError)
        console.log('AL: action.request.error', action.request.error)
        return
      }

      action.allow()
    }
  }
)
```

websocket 連線上之前可以在 inbound 的 middleware 中做檢查

### HTTP flow

因為 API 每個 Route 希望可以更彈性的來處理驗證問題

可以依據 Express 的一般驗證模式

```javascript
const jwtverify = async (req, res, next) => {
  try {
    const bearerHeader = req.headers['authorization']
    if (!bearerHeader) throw new Error('unauthorization')

    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]
    req.user = await agServer.auth.verifyToken(
      bearerToken,
      agServer.signatureKey
    )
    next()
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

expressApp.get('/health-check', jwtverify, (req, res) => {
  res.status(200).send('OK')
})
```

可以在需要驗證的 route 加入 驗證的 Middleware

## Client

### Browser

最簡單的方式

```javascript
localStorage.setItem('socketcluster.authToken', token)
```

另外也可以 `AuthEngine` 可以自訂

source code 在參考資料中可以參考

```javascript
let socket = socketClusterClient.create({
  secure: false,
  authTokenName: "socketcluster.authToken",
  authEngine: {
    _internalStorage: {
      "socketcluster.authToken": ${token}
    },
    isLocalStorageEnabled: true,
    saveToken: (name, token, options) => {
      this._internalStorage[name] = token;
      return Promise.resolve(token);
    },
    removeToken: function(name) {
      const loadPromise = this.loadToken(name);
      delete this._internalStorage[name];
      return loadPromise;
    },
    loadToken: function(name) {
      const token = this._internalStorage[name] || null;
      return Promise.resolve(token);
    }
  },
});
```

`secure` 是否要使用 `wss`

`authTokenName` 設定 `_internalStorage[name]` 的 name

`authEngine` 可以自行定義針對 `authToken` 的行為

## React Native

因為在 React Native 沒有 `localStorage`

所以無法利用 `localStorage` 處理

但是可以利用 [jest-localstorage-mock](https://www.npmjs.com/package/jest-localstorage-mock)

來建立

但是這個做法比較不優

所以會選用 AuthEngine 來處理

```javascript
let socket = SocketClusterClient.create({
  hostname: hostname(ip),
  port: 1234,
  secure: false,
  authTokenName: 'socketcluster.authToken',
  authEngine: {
    _internalStorage: {
      'socketcluster.authToken': token,
    },
    isLocalStorageEnabled: true,
    saveToken: (name, token, options) => {
      this._internalStorage[name] = token
      return Promise.resolve(token)
    },
    removeToken: function (name) {
      const loadPromise = this.loadToken(name)
      delete this._internalStorage[name]
      return loadPromise
    },
    loadToken: function (name) {
      const token = this._internalStorage[name] || null
      return Promise.resolve(token)
    },
  },
})

;(async () => {
  let myChannel = socket.channel('myChannel')
  for await (let data of myChannel) {
    console.log('forawait -> data', data)
  }
})()
```

這時候會發生這個問題

```
TypeError: Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.
```

oh!shit!

所以跑去研究了 `Symbol.iterator`

結果是因為 array like 的問題

所以找不到 `[Symbol.iterator]() method`

解決方案只要用 `Array.from` 轉換型態就可以了

所以變成

```javascript
const connectSocketCluster = async () => {
  try {
    let socket = SocketClusterClient.create({
      hostname: hostname(ip),
      port: 1234,
      secure: false,
      authTokenName: 'socketcluster.authToken',
      authEngine: {
        _internalStorage: {
          'socketcluster.authToken': token,
        },
        isLocalStorageEnabled: true,
        saveToken: (name, token, options) => {
          this._internalStorage[name] = token
          return Promise.resolve(token)
        },
        removeToken: function (name) {
          const loadPromise = this.loadToken(name)
          delete this._internalStorage[name]
          return loadPromise
        },
        loadToken: function (name) {
          const token = this._internalStorage[name] || null
          return Promise.resolve(token)
        },
      },
    })

    ;(async () => {
      const errorChannel = socket.listener('error')
      try {
        for await (let { error } of Array.from(errorChannel)) {
        }
      } catch (error) {}
    })()
  } catch (error) {
    console.log('connectSocketCluster -> error.message', error.message)
  }
}

connectSocketCluster()
```

終於可以連上了

以及可以做基本的驗證

只要同一個 token 就可以在各個服務中聯繫

如果還要開其他的 `broker`

只要注意 `SSC_AUTH_KEY` 的一致性

就可以基本上保證彼此之間的 token 共用

# 參考資料

[socketcluster](https://github.com/SocketCluster/socketcluster-client/tree/master/lib)

[authengine](https://github.com/SocketCluster/socketcluster-client/blob/master/lib/clientsocket.js#L138-L142)

[auth.js](https://github.com/SocketCluster/socketcluster-client/blob/master/lib/auth.js)

[iterable](https://javascript.info/iterable)
