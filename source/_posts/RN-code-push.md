---
title: RN-code-push
author: TomasLin
date: 2019-01-02
tags:
  - React Native
  - Javascript
  - React
categories: 
  - React Native
---

# Initial React Native App

```
  $ npx react-native init codepushdemo && cd codepushdemo
```

# Install code push

```
  # Install the CLI
  $ npm install -g code-push-cli
  $ npm install -g appcenter-cli

  # Register for an account via github or email (if you have code-push account you could use **code-push login**)
  $ code-push register

  # Register your app. We call it AwesomeApp.
  $ code-push app add codepushdemo-ios ios react-native
  $ code-push app add codepushdemo-android android react-native

  # prepare app center
  $ yarn add appcenter appcenter-analytics appcenter-crashes --save-exact

  $ cd ios && pod install && cd ..
```

```
**Note:**

link 完之 IOS 會自動使用 Pod 

所以在 local 端 Xcode 要開啟 `XXXXX.xcworkspace` 才能正常開發
```

### IOS

[releasing-updates](https://github.com/microsoft/react-native-code-push#releasing-updates)

# Git

`code-push` 官方只支援 `github` `bitbucket` 和 `microsoft devops` 三種版控

這次使用 `bitbucket` 做 Demo

要先在 bitbucket 建立一個新的 repo


# 參考資料來源

[Get started with ‘CodePush’ (React-Native)](https://medium.com/@rajanmaharjan/get-started-with-wonderful-technology-d838aafdc2d3)

[IOS Setup](https://github.com/Microsoft/react-native-code-push/blob/master/docs/setup-ios.md)

[Android Setup](https://github.com/Microsoft/react-native-code-push/blob/master/docs/setup-android.md)
