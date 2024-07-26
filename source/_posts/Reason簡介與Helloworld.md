---
title: Reason簡介與Helloworld
author: TomasLin
tags:
  - Javascript
  - IThome2018
  - Reason
categories:
  - Reason
date: 2018-10-01
---

# What is Reason

`Reason` 並不是一個新的語言，而是一種新的語法和工具鍊(toolchain)，[Ocaml](http://ocaml.org/)支援。並支援既有的 NPM/YARN。

藉由 [BuckleScript](https://bucklescript.github.io/)將 `Reason` 編譯為可閱讀的 `Javascript` 

## Reason 的優勢

* 型別系統: Ocaml 型別測試具有 `100%` 的覆蓋率，而且保有 `Javascript` 的型別推導，一但編譯過型別保證正確
* 保有簡單和實用性:
  * 允許 side-effect, mutable
  * 也可以使用 immutable functional
* 重視效能和大小: Reason 的建置系統 `bsb` 建置時間小於 100ms(遞增)，產生的結果也會很小
* 漸進式學習 & 程式碼庫轉換: 也可以在 `Reason` 中貼上 `Javascript` 的程式片段再慢慢調整為 `Reason` 的程式碼
* 基本使用 `immutable and functional` 但是也提供 `side-effect` 和 `mutation` 的彈性
* Reason 的 build system (bsb) 建構精簡可閱讀的 `Javascript code`
* 完整的生態圈和工具鍊: [編輯器](https://reasonml.github.io/docs/zh-TW/editor-plugins), [NPM 套件](https://reasonml.github.io/docs/zh-TW/libraries), [Reason-React](https://github.com/reasonml/reason-react), [webpack](https://webpack.js.org/)

## compiler 流程

當你完成一個簡單的 `.re` 檔案 (這是基本的 reason檔案)

會經由下圖的過程幫你編譯成 `Javascript`

![流程](../../../../images/Reason_Helloworld/compiler_flow.png)

## Install Reason on Mac

```
  $ npm install -g reason-cli@latest-macos
  $ npm install -g bs-platform 
```

* reason-cli - Reason 的環境套件
* bs-platform - BuckleScript 和 Reason 基本套件

### initial First Reason Project

```
  $ bsb -init hello-world -theme  basic-reason
```

第一次初始化之後會得到這樣的檔案結構
```
.
├── README.md
├── bsconfig.json
├── node_modules
│   └── bs-platform -> /usr/local/lib/node_modules/bs-platform
├── package.json
└── src
    └── Demo.re
```

#### bsconfig.json

`BuckleScript` 的設定 json 檔案

```json
{
  "name": "hello-world",
  "version": "0.1.0",
  "sources": {
    "dir" : "src",
    "subdirs" : true
  },
  "package-specs": {
    "module": "commonjs",
    "in-source": true
  },
  "suffix": ".bs.js",
  "bs-dependencies": [
      // add your dependencies here. You'd usually install them normally through `npm install my-dependency`. If my-dependency has a bsconfig.json too, then everything will work seamlessly.
  ],
  "warnings": {
    "error" : "+101"
  },
  "namespace": true,
  "refmt": 3
}
```

* name - 專案名稱
* version - 版本
* sources
  * dir - source 的資料夾
  * subdirs - 是否要編譯子資料夾內的 re (Boolean or Array)
* package-specs
  * module - 編譯後使用哪種 Javascript 模組 (default: commonjs)
  * in-source - 編譯的時候是否也要輸出
* suffix - 編譯後的 js 的 後綴
* bs-dependencies - 列出你使用 NPM(Yarn) 安裝的第三方 套件
* bs-dev-dependencies- 列出你使用 NPM(Yarn) 安裝的第三方 開發套件
* namespace - name 是 package 名稱，可以選擇是否開啟命名空間 (default: false)
  * 例如您有一個 `Util.re` 的檔案，如果沒有開啟命名空間，你的第三方套件也有一個 `Util` 的套件，他們會造成衝突，，這個參數影響的是這個 lib 的**使用者**，而不是自己本身
* refmt -  當你使用 [Reason V3 syntax](https://reasonml.github.io/blog/2017/10/27/reason3.html) 則明確指定為 `3`
* reason - 預設是打開的，但是若有使用 `ReasonReact`, 設定則為

```json
{
  "reason": {"react-jsx": 2},
  "refmt": 3
}
```

#### merlin

在你的專案中還隱藏了一個小小的檔案 `.merlin`

這個檔案雖然只有短短幾行

但是扮演相當重要的角色

他會協助你的 `格式檢查`, `autocompleate`...

## 執行您的第一個 Hello world

```
  $ npm run start
```

然後會開始編譯

![編譯完成](../../../../images/Reason_Helloworld/start1.png)

```
  $ node src/Demo.bs.js
  // Hello, BuckleScript and Reason!
```

Welcom Reason's World
