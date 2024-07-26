---
title: ReasonReact-Helloworld
author: TomasLin
tags:
  - Javascript
  - IThome2018
  - Reason
  - React
categories:
  - Reason
date: 2018-11-04
---


# Install

這部分和 Reason 一樣

只是提供了一個 react theme

```
  $ npm install -g bs-platform
  $ bsb -init reason-react-demo -theme react
  $ cd reason-react-demo && npm install && npm start
```

`npm start` 僅僅是將 `.re` 編譯為 `.js`

我們還需要使用 `npm run webpack` 作打包的動作

另外要再開一個 `web-develop-server`

所以另外也還要再開一個 `npm run server`

這些指令在初始化的時候就會產生

工程師都是懶惰的

所以現在要利用 `concurrently` 來幫我們簡化一下

## concurrently

這個套件可以一行指令一次執行多個 process

使用上也很方便

```
  $ npm install -g concurrently
```

*command*

```
  $ concurrently -n reason,webpack,server "yarn start" "yarn webpack"  "yarn server"
```

*package.json*
需要使用 `\` 跳脫字元

```json
  ...,
  "dev": "concurrently -n reason,webpack,server \"yarn start\" \"yarn webpack\"  \"yarn server\"",
  ...
```

```
  $ npm run dev
```

# 檔案結構

```
.
├── README.md
├── bsconfig.json
├── lib
│   └── bs
│       ├── ReactTemplate.cmi
│       ├── ReactTemplate.cmj
│       ├── ReactTemplate.cmt
│       ├── ReactTemplate.js
│       ├── ReactTemplate.mlmap
│       ├── build.ninja
│       └── src
│           ├── Component1-ReactTemplate.cmi
│           ├── Component1-ReactTemplate.cmj
│           ├── Component1-ReactTemplate.cmt
│           ├── Component1.mlast
│           ├── Component1.mlast.d
│           ├── Component2-ReactTemplate.cmi
│           ├── Component2-ReactTemplate.cmj
│           ├── Component2-ReactTemplate.cmt
│           ├── Component2.mlast
│           ├── Component2.mlast.d
│           ├── Index-ReactTemplate.cmi
│           ├── Index-ReactTemplate.cmj
│           ├── Index-ReactTemplate.cmt
│           ├── Index.mlast
│           └── Index.mlast.d
├── package-lock.json
├── package.json
├── src
│   ├── Component1.bs.js
│   ├── Component1.re
│   ├── Component2.bs.js
│   ├── Component2.re
│   ├── Index.bs.js
│   ├── Index.re
│   └── index.html
└── webpack.config.js
```

`lib` 裡面放的是  BuckleScript 的檔案

這部分之後再做研究

`src` 中放的是 `.re` 檔案 以及編譯過後的 `.js` 檔案

`webpackconfig.js` 就是 webpack 的設定檔案

他會以 `index.bs.js` 為進入點

所以第一次要先編譯之後產生這個檔案再跑 webpack 才不會出錯

`src` 中主要有四個檔案 `index.html` `Index.re` `Component1.re` `Component2.re`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ReasonReact Examples</title>
</head>
<body>
  Component 1:
  <div id="index1"></div>
  Component 2:
  <div id="index2"></div>

  <script src="Index.js"></script>
</body>
</html>
```

這邊有一個比較特別的地方

以前使用 create-react-app 建立出來的都只會有一個 `<div id="root"></div>`

會以這個為最外層的 div

其他的 Component 都在這個 div 之下做 render

這個範例一開始建立了兩個 `div`

各自 render `Component1` 和 `Component2`

或許這之後會解釋這樣的實作有和優劣？

還是只是範例而已

*Component1.re*
```reason
/* This is the basic component. */
let component = ReasonReact.statelessComponent("Page");

/* Your familiar handleClick from ReactJS. This mandatorily takes the payload,
   then the `self` record, which contains state (none here), `handle`, `reduce`
   and other utilities */
let handleClick = (_event, _self) => Js.log("clicked!");

/* `make` is the function that mandatorily takes `children` (if you want to use
   `JSX). `message` is a named argument, which simulates ReactJS props. Usage:

   `<Page message="hello" />`

   Which desugars to

   `ReasonReact.element(Page.make(~message="hello", [||]))` */
let make = (~message, _children) => {
  ...component,
  render: self =>
    <div onClick=(self.handle(handleClick))>
      (ReasonReact.string(message))
    </div>,
};
```

`Component1.re` 很簡單

先將原始的 Compoennt assign 之後做解構

但是在綁定 Event 就比較特別的是

先寫了一個 `function handleClick`

在 `div` 的 `onClick` 去 trigger

使用的方式是 `onClick=(self.handle(handleClick))`

變數部分也改用 `()` 而不是以前 React 使用的 `{}`

看到這邊其實跟之前的 React 會有一些不同

先做一些調整

**src/index.html**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ReasonReact Examples</title>
</head>
<body>
  <div id="root"></div>

  <script src="Index.js"></script>
</body>
</html>
```

**App.re**
```reason
let component = ReasonReact.statelessComponent("App");

let make = (_children) => {
  ...component,
  render: (_) =>
    <>
      (ReasonReact.string("Component1:"))
      <Component1 message="Hello!" />
      (ReasonReact.string("Component2:"))
      <Component2 greeting="Hello!" />
    </>
};
```

## Hot Reload

這時候會發現當我們更新了程式碼之後還是不會自動 Reload

還是有點麻煩

其實只要稍微調整一下 `webpack.config.js`

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const outputDir = path.join(__dirname, 'build/');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/Index.bs.js',
  mode: isProd ? 'production' : 'development',
  output: {
    path: outputDir,
    publicPath: outputDir,
    filename: 'Index.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    })
  ],
  devServer: {
    compress: true,
    contentBase: outputDir,
    port: process.env.PORT || 8000,
    historyApiFallback: true
  }
};
```

這樣就完成囉!

Have fun!