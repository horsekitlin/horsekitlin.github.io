---
title: TypeScript-ReactAndWebpack
author: TomasLin
date: 2017-10-31
categories: Javascript
tags:
  - Javascript
  - Typescript
  - Translate
---

# 參考來源

[React & Webpack](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html)

# React & Webpack

這一個篇章會帶你使用 `TypeScript` 使用 webpack 開發 React

如果你還不知道如何初始化一個新的 React 可以參考這篇[文章](https://www.typescriptlang.org/samples/index.html)

換句話說，我們假設你已經會使用 nodejs 和 npm

## Lay out the project

開始建立一個新的資料夾 `proj`

```
mkdir proj && cd proj
```

然後我們建立一個新的資料結構

```
proj/
├─ dist/
└─ src/
   └─ components/
```

`TypeScript` 放置於 `src` 的資料夾中，經過 `TypeScript compiler` 後再經由 `Webpack` 最後在 `dist` 產生一個 `bundle.js` 的檔案，每一個 components 都會放在　`src/components` 的資料夾內

## 初始化專案

```
  $ yarn init
  $ yarn add react react-dom
  $ yarn add @types/react @types/react-dom -D
```

`types/` 這類的套件代表我們需要他取得 `TypeScript` 的宣告，通常當你 import 一個套件路徑 `react`，才找得到 `react` 的套件，然而並不是所有套件都需要這種宣告套件
，然而並不是所有套件都需要這種宣告套件

安裝開發用套件

```
  $ yarn add typescript awesome-typescript-loader source-map-loader -D
```

這兩個套件一起幫你編譯你的程式碼， `awesome-typescript-loader` 會依據 `tsconfig.json` 這個檔案所描述的 `TypeScript` 標準來做編譯。

而 `source-map-loader` 可以在你開發的時候可以做編譯前與編譯後的 mapping 方便追蹤錯誤的程式碼

## 增加 TypeScript 設定檔案

若你希望你的 `TypeScript` 整合在一起，你需要一個 `tsconfig.json` 

```json
{
  "compilerOptions": {
    "outDir": "./dist/",
    "sourceMap": true,
    "noImplicitAny": true,
    "module": "commonjs",
    "target": "es5",
    "jsx": "react"
  },
  "include": ["./src/**/*"]
}
```

若是你希望學習更多的 `tsconfig.json` 可以參考這篇[文章](https://www.typescriptlang.org/docs/tsconfig-json.html)

## 範例程式

在 `src/components` 建立一個新的 `Hello.tsx`

```typescript
import * as React from "react";

export interface HelloProps {
  compiler: string;
  framework: string;
}

export const Hello = (props: HelloProps) => (
  <h1>
    Hello from {props.compiler} and {props.framework}!
  </h1>
);
```

然後在 `src` 中新增一個 `index.tsx`

```typescript
import * as React from "react";
import * as ReactDOM from "react-dom";

import { Hello } from "./components/Hello";

ReactDOM.render(
  <Hello compiler="TypeScript" framework="React" />,
  document.getElementById("example")
);
```

在 `index.tsx` 中只是引入了 `Hello.tsx` 然後將 Hello component 顯示在頁面上

為了顯示這個 component 我們需要建立一個 `index.html`

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>Hello React!</title>
    </head>
    <body>
        <div id="example"></div>

        <!-- Dependencies -->
        <script src="./node_modules/react/umd/react.development.js"></script>
        <script src="./node_modules/react-dom/umd/react-dom.development.js"></script>

        <!-- Main -->
        <script src="./dist/bundle.js"></script>
    </body>
</html>
```

## 建立一個 webpack 設定檔案

```javascript
module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist"
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM"
  }
};
```

你可能會好奇 `externals` 這個欄位在做什麼的？

我們希望在打包的時候希望可以共用一些 package 就好像 `global variable` 就像 `jQuery` 或是 `_` 一樣

這叫做 `namespace pattern`， webpack 允許我們使用這個方式來引用套件。

```
  $ webpack
```