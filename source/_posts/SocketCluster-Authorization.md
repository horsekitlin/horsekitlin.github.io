---
title: SocketCluster-Authorization
author: TomasLin
tags:
  - Nodejs
  - SocketCluster
date: 2020-09-09
categories:
  - Nodejs
---


# Authorization

在 SocketCluster 預設使用 `JWT` 處理驗證問題

在AGServer 之中有一個參數 `authKey` 是一個字串，提供 `JWT` 的 token 建立與驗證使用

`Client` 也可以使用 `socket.authenticate`

因為可能一個服務或多個服務 同時會有 HTTP 與 Websocket 

所以會希望同一個 `token` 可以在各服務內使用

做使用者的驗證

## 建立 JWT Token

### HTTP 

最基本的使用方式是透過 `Express` 來建立 token

然後再將此 token 送到客戶短提供使用

客戶端獲得這個 token 的之後必須要加到 `socketcluster.authToken` 中

這是 `SocketCluster` 的預設 `JWT` localStorage token

建立新連線的時候或是重新連線時 SocketCluster 會自動在 localStorage 取得 `JWT`

#### Server

新增一個 Express 的 route

因為是 demo

所以先用 `GET` 來測試

```javascript

expressApp.get('/login', async (req, res) => {
  const myTokenData = {
    username: 'bob',
    language: 'English',
    company: 'Google',
    groups: ['engineering', 'science', 'mathematics']
  };

  let signedTokenString = await agServer.auth.signToken(myTokenData, agServer.signatureKey);

  res.status(200).json({
    token: signedTokenString
  });
});
```

之後在瀏覽器測試可以取得 `token`

```json
{
  "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJvYiIsImxhbmd1YWdlIjoiRW5nbGlzaCIsImNvbXBhbnkiOiJHb29nbGUiLCJncm91cHMiOlsiZW5naW5lZXJpbmciLCJzY2llbmNlIiwibWF0aGVtYXRpY3MiXSwiaWF0IjoxNTk5NTczMzA1fQ.TBwhqJlhVlpEwCcqsv9-JT5Vx7Z32D4YpCUebEDZSHQ"
}
```
#### Websocket

利用 WebSocket 建立 token 的範例

##### Server

```javascript
(async () => {
      for await (let request of socket.procedure('login')) {
        try {
          console.log("forawait -> request.data", request.data)
          //chgeck use done
  
          
        
          socket.setAuthToken({username: request.data.username});
          request.end();
          return;
        } catch(error) {
          console.log("forawait -> error", error)
          let loginError = new Error(`Could not find a ${request.data.username} user`);
          console.log("forawait -> loginError", loginError)
        loginError.name = 'LoginError';
        request.error(loginError);
  
        return;
        }        
      }
    })();
```

##### Client

```javascript
 (async () => {
        
        try {
          // Invoke a custom 'login' procedure (RPC) on our server socket
          // then wait for the socket to be authenticated.
          const [, authResult] = await Promise.all([
            socket.invoke("login", credentials),
            socket.listener("authenticate").once(),
          ]);
        console.log("authResult", JSON.stringify(authResult))
      } catch (error) {
        console.log("error", error)
        // showLoginError(err);
        return;
      }
      })();
```

Client 可以拿到的 Resonse 是

```json
{
	"signedAuthToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFsaWNlMTIzIiwiaWF0IjoxNTk5NTc2MDkyLCJleHAiOjE1OTk2NjI0OTJ9.fccJ4zBdCqpoXrHW-NWxEK9r5ykMYyA0aokQRZitUmw",
	"authToken": {
		"username": "alice123",
		"iat": 1599576092,
		"exp": 1599662492
	}
}
```

## 驗證 JWT Token

在 SocketCluster 中不論是 `HTTP` 和 `WebSocket` 的驗證方式都是一樣的

但是在這之前要先了解 SocketClsuter 的 Middleware 的使用方式

### Middleware

SocketCluster 中可以註冊 `Middleware`

支援的類別總共四種

* agServer.MIDDLEWARE_HANDSHAKE	
* agServer.MIDDLEWARE_INBOUND_RAW
* agServer.MIDDLEWARE_INBOUND
  - from client -> server
* agServer.MIDDLEWARE_OUTBOUND
  - from server -> client

### 註冊 Middleware

```javascript
agServer.setMiddleware(agServer.MIDDLEWARE_INBOUND, async (middlewareStream) => {
  for await (let action of middlewareStream) {
    console.log("forawait -> action.type", action.type)
    if (action.type === action.TRANSMIT) {
      if (!action.data) {
        let error = new Error(
          'Transmit action must have a data object'
        );
        error.name = 'InvalidActionError';
        action.block(error);
        continue;
      }
    } else if (action.type === action.INVOKE) {
      if (!action.data) {
        let error = new Error(
          'Invoke action must have a data object'
          );
          error.name = 'InvalidActionError';
          action.block(error);
          continue;
        }
        // token 的物件
        console.log("forawait -> action.data", action.data)
    }
    action.allow();
  }
});
```

利用註冊 `IN_BOUIND` 與 `OUT_BOUND` 的註冊 middleware 

來達成驗證 `JWT` token

# 參考資料

[Authorization](https://socketcluster.io/docs/authentication/)