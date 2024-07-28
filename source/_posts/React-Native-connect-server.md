---
title: React-Native-connect-server
author: TomasLin
tags:
  - React Native
  - SocketCluster
  - Nodejs
  - React
  - ithome 12
date: 2020-09-15
categories:
  - SocketCluster
---

# Initial React Native

```
  $ npx react-native init imapp && cd imapp
```

## Run on ios

```
  $ npx react-native-run-ios
```

## Install SocketCluster Client

```
  $ yarn add socketcluster-client
```

## Initial Socket

App.js

```javascript
import SocketClusterClient from 'socketcluster-client';

let socket = SocketClusterClient.create({
  hostname: 'localhost',
  port: 8000
});

socket.transmit('foo', 123);
```

Server 可以收到 `data`

基本上已經可以確認接通了 SocketCluster Server 與 Client

之後就可以準備其他事情

# 參考資料

[socketcluster-Client](https://github.com/SocketCluster/socketcluster-client)
