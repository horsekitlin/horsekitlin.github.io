---
title: React-Native-Notification-Android
author: TomasLin
tags:
  - Javascript
  - React Native
date: 2020-10-04
categories:
  - React Native
---

# Android

## Initial React Native App

```
  $ react-native init rn_notification
```

## Install

```
  $ yarn add @react-native-firebase/app @react-native-firebase/messaging
```

## Firebase

[Download GoogleService-Info.plist](https://rnfirebase.io/#2-android-setup)

[configure Android](https://rnfirebase.io/#configure-firebase-with-android-credentials)

index.js
```javascript
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

async function requestUserPermission() {
  try {
    const messageinstance = messaging();
    const authStatus = await messageinstance.requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      await messageinstance.registerDeviceForRemoteMessages();
      const token = await messageinstance.getToken();
      console.log('token:', token);
    }
  } catch(error) {
  console.log("requestUserPermission -> error", error)
  }
}

requestUserPermission();
AppRegistry.registerComponent(appName, () => App);
```

### APNS Service

[wiki Apns Service](https://zh.wikipedia.org/wiki/Apple%E6%8E%A8%E6%92%AD%E9%80%9A%E7%9F%A5%E6%9C%8D%E5%8B%99)


Next - Android push notification

# 參考資訊

[react-native-permissions](https://github.com/zoontek/react-native-permissions)

[issue](https://github.com/zoontek/react-native-permissions/issues/449)

[issue2](https://github.com/invertase/react-native-firebase/issues/2657)

[firebase](https://rnfirebase.io/app/usage)