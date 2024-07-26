---
title: React Native-Platform
author: TomasLin
tags:
  - React Native
  - Javascript
  - React
categories:
  - React Native
date: 2019-02-24
---

# Platform

## Platform Specific Code

在初期的時候可以利用檔案模式來做整合

可以將檔案名稱命名為 `.ios.js` 和 `.android.js`

然後在不同的平台上 require 不同的檔案

### Example

```
BigButton.ios.js
BigButton.android.js
```

然後就可以在你想要的地方 import 檔案

```js
import BigButton from './BigButton';
```

因為 `React Native` 是跨平台的 Framework

畢竟 IOS Android 之間還是有相當的不同之處

可以利用 `Platform` 這個模組來統一的整理

```js
import {Platform, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  height: Platform.OS === 'ios' ? 200 : 100,
});
```

`Platform` module 會依據平台來執行相對應的程式碼

如果是 `ios` 的話 height 是 200

如果是 `android` 的話 height 是 100

另外也有 `Platform.select` 可以使用

```js
import {Platform, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: {
        backgroundColor: 'red',
      },
      android: {
        backgroundColor: 'blue',
      },
    }),
  },
});
```

上述程式碼中使用到 `container` Style 的都會有 `flex: 1` 的參數

但是在 `ios` 中會是紅色

在 `android` 中會是藍色的背 景色

```js
import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';

const SpecificPlatformComponent = Platform.select({
  ios: () => <Text>I am use IOS</Text>,
  android: () => <Text>I am use Android</Text>,
});

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <SpecificPlatformComponent />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

或是像是這樣也可以依據不同的平台引用 component

## OS Version

```js
import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';

const SpecificPlatformComponent = Platform.select({
  ios: () => <Text>I am use IOS</Text>,
  android: () => <Text>I am use Android</Text>,
});

const SpecificPlatformVersionComponent = Platform.select({
  ios: () => <Text>my Iphone Version is {Platform.Version}</Text>,
  android: () => <Text>my Android Version is {Platform.Version}</Text>,
});


export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <SpecificPlatformComponent />
        <SpecificPlatformVersionComponent />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```
