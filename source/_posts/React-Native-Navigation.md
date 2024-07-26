---
title: React-Native-Navigation
author: TomasLin
tags:
  - React Native
date: 2020-09-15
categories:
  - React Native
---

# React-Native-Navigation

## Install

依據以下動作即可完成
[Install](https://wix.github.io/react-native-navigation/docs/installing/)

## Basic Usage

```javascript
// In index.js of a new project
const { Navigation } = require('react-native-navigation');
const React = require('react');
const { View, Text, StyleSheet } = require('react-native');

const HomeScreen = (props) => {
  return (
    <View style={styles.root}>
      <Text>Home Screen</Text>
    </View>
  );
};

//可以直接在 options 設定參數
HomeScreen.options = {
  topBar: {
    title: {
      text: 'Home',
      color: 'white'
    },
    background: {
      color: '#4d089a'
    }
  }
}

Navigation.registerComponent('Home', () => HomeScreen);

Navigation.events().registerAppLaunchedListener(async () => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'Home'
            }
          }
        ]
      }
    }
  });
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'whitesmoke'
  }
});
```

:::info
`Navigation.registerComponent` 會建立一個 uniqueId `CompoenntId` 這個 Id 會是換頁的主要依據
:::

## 導頁

```javascript
// In index.js of a new project
const { Navigation } = require('react-native-navigation');
const React = require('react');
const { View, Text, StyleSheet } = require('react-native');
const { Button } = require('react-native');

const HomeScreen = (props) => {
  return (
    <View style={styles.root}>
      <Text>Home Screen</Text>
      <Button
        title='Push Settings Screen'
        color='#710ce3'
        onPress={() => Navigation.push(props.componentId, {
          component: {
            name: 'Settings',
            options: {
              topBar: {
                title: {
                  text: 'Settings'
                }
              }
            }
          }
        })}/>
    </View>
  );
};

const SettingScreen = (props) => {
  return (
    <View style={styles.root}>
      <Text>Setting Screen</Text>
    </View>
  );
};


HomeScreen.options = {
  topBar: {
    title: {
      text: 'Home',
      color: 'white'
    },
    background: {
      color: '#4d089a'
    }
  }
}

Navigation.registerComponent('Home', () => HomeScreen);
Navigation.registerComponent('Settings', () => SettingScreen);

Navigation.events().registerAppLaunchedListener(async () => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'Home'
            }
          }
        ]
      }
    }
  });
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'whitesmoke'
  }
});
```

## App Theme

使用的 Style Framwork 是 `react-native-elements`

裡面也有 Theme 

React Native Navigation 也可以設定 Theme

```javascript
Navigation.setDefaultOptions({
  statusBar: {
    backgroundColor: '#4d089a'
  },
  topBar: {
    title: {
      color: 'white'
    },
    backButton: {
      color: 'white'
    },
    background: {
      color: '#4d089a'
    }
  }
});
```

## Tab Stack

一般的App 都會有 Bottom 的 Tap navigation

在 React Native Navigation 中

把剛剛的 `Home` `Settings` 頁面換成兩個 Tab Statck

```javascript
const { Navigation } = require('react-native-navigation');
const React = require('react');
const { View, Text, Button, StyleSheet } = require('react-native');

const HomeScreen = (props) => {
  return (
    <View style={styles.root}>
      <Text>Hello React Native Navigation 👋</Text>

      <Button
        title='Push Settings Screen'
        color='#710ce3'
        onPress={() => Navigation.push(props.componentId, {
          component: {
            name: 'Settings'
          }
        })} />
    </View>
  );
};
HomeScreen.options = {
  topBar: {
    title: {
      text: 'Home'
    }
  },
  bottomTab: {
    text: 'Home'
  }
};

const SettingsScreen = () => {
  return (
    <View style={styles.root}>
      <Text>Settings Screen</Text>
    </View>
  );
}
SettingsScreen.options = {
  topBar: {
    title: {
      text: 'Settings'
    }
  },
  bottomTab: {
    text: 'Settings'
  }
}

Navigation.registerComponent('Home', () => HomeScreen);
Navigation.registerComponent('Settings', () => SettingsScreen);

Navigation.setDefaultOptions({
  statusBar: {
    backgroundColor: '#4d089a'
  },
  topBar: {
    title: {
      color: 'white'
    },
    backButton: {
      color: 'white'
    },
    background: {
      color: '#4d089a'
    }
  },
  bottomTab: {
    fontSize: 14,
    selectedFontSize: 14
  }
});

Navigation.events().registerAppLaunchedListener(async () => {
  Navigation.setRoot({
    root: {
      bottomTabs: {
        children: [
          {
            stack: {
              children: [
                {
                  component: {
                    name: 'Home'
                  }
                },
              ]
            }
          },
          {
            stack: {
              children: [
                {
                  component: {
                    name: 'Settings'
                  }
                }
              ]
            }
          }
        ]
      }
    }
  });
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'whitesmoke'
  }
});
```

Bottom Tab 會有 `Home` 和 `Settings`

但是在 `Home` 會有 Button 

點擊後還是會 push `Settings` 進入 Home Stack

這是一般的 App Navigation 的邏輯

## Replace Root 

Navigation 也提供了覆蓋 Root Stack 的 function 

`Navigation.setRoot(${rootObject})`

執行這個 function 會將 Root 整個覆蓋

範例如下


```javascript
const { Navigation } = require('react-native-navigation');
const React = require('react');
const { View, Text, Button, StyleSheet } = require('react-native');

const LoginScreen = () => {
  return (
    <View style={styles.root}>
      <Button
        title='Login'
        color='#710ce3'
        onPress={() => Navigation.setRoot(mainRoot)}
      />
    </View>
  );
};

const HomeScreen = (props) => {
  return (
    <View style={styles.root}>
      <Text>Hello React Native Navigation 👋</Text>

      <Button
        title='Push Settings Screen'
        color='#710ce3'
        onPress={() => Navigation.push(props.componentId, {
          component: {
            name: 'Settings'
          }
        })} />
    </View>
  );
};
HomeScreen.options = {
  topBar: {
    title: {
      text: 'Home'
    }
  },
  bottomTab: {
    text: 'Home'
  }
};

const SettingsScreen = () => {
  return (
    <View style={styles.root}>
      <Text>Settings Screen</Text>
    </View>
  );
}
SettingsScreen.options = {
  topBar: {
    title: {
      text: 'Settings'
    }
  },
  bottomTab: {
    text: 'Settings'
  }
}

Navigation.registerComponent('Login', () => LoginScreen);
Navigation.registerComponent('Home', () => HomeScreen);
Navigation.registerComponent('Settings', () => SettingsScreen);

const mainRoot = {
  root: {
    bottomTabs: {
      children: [
        {
          stack: {
            children: [
              {
                component: {
                  name: 'Home'
                }
              },
            ]
          }
        },
        {
          stack: {
            children: [
              {
                component: {
                  name: 'Settings'
                }
              }
            ]
          }
        }
      ]
    }
  }
};

const loginRoot = {
  root: {
    component: {
      name: 'Login'
    }
  }
};


Navigation.setDefaultOptions({
  statusBar: {
    backgroundColor: '#4d089a'
  },
  topBar: {
    title: {
      color: 'white'
    },
    backButton: {
      color: 'white'
    },
    background: {
      color: '#4d089a'
    }
  },
  bottomTab: {
    fontSize: 14,
    selectedFontSize: 14
  }
});
Navigation.events().registerAppLaunchedListener(async () => {
  Navigation.setRoot(loginRoot);
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'whitesmoke'
  }
});
```

基本上定義了一個 `loginRoot` 和 `mainRoot` 

在登入的時候如果成功則切換到 `mainRoot`

登出的時候則再度切換回 `loginRoot`

來簡單的實現了登入登出機制

但是在實際的產品中這樣卻是不足的

因為會先看到 `LoginScreen`

如果是登入狀態

加上在 React Native 讀取 AsyncStorage 的資料都是非同步的

會看到閃一下 再跳到 `MainRoot`

在使用者體驗上會很糟糕

所以會需要做一些調整來避免這個狀況

但是這篇篇幅太多

留著後面再說吧
