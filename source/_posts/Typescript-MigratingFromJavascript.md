---
title: Typescript-Migrating from Javascript
author: TomasLin
date: 2017-10-30
categories: Javascript
tags:
  - Javascript
  - Typescript
  - Translate
---

# 翻譯來源

[Migrating from JavaScript
](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html)

# 從 Javascript 搬移你的程式到 TypeScript

`TypeScript` 不會憑空存在， 他還是依存於 `Javascript` 的生態圈內，有很多舊的 `Javascript` 要轉譯為 `TypeScript` 過程中很無趣的。

如果你是要轉譯 `React project` 我們會推薦你先閱讀這份[文件](https://github.com/Microsoft/TypeScript-React-Conversion-Guide#typescript-react-conversion-guide)

## 設定你的資料結構

基本的檔案架構會如下

```
projectRoot
├── src
│   ├── file1.js
│   └── file2.js
├── built
└── tsconfig.json
```

如果你有想要用測試的話，在 `src` 再加上 `tests` 並且在 `tsconfig.json` 除了 `src` 之外再加上 `tests`

## 寫一個設定檔案

`TypeScript` 使用 `tsconfig.json` 來做專案的設定

```json
{
    "compilerOptions": {
        "outDir": "./built",
        "allowJs": true,
        "target": "es5"
    },
    "include": [
        "./src/**/*"
    ]
}
```

我們利用這個設定檔案 對 `TypeScript` 做一些設定

1. 包含 `include` 讀取 `src` 中所有檔案
2. 允許 `Javascript` 文件直接輸入
3. 可以在 `build` 輸出所有編譯後文件
4. 將 ES6或是ES7 轉譯為 ES5

如果你是使用 `tsc` 轉譯你的專案，你應該會在 `built` 資料夾裡面看到編譯成功的檔案

### 優勢

如果你使用的是[VS code](https://code.visualstudio.com/) 或是 [Visual Studio](https://visualstudio.com/) 你可以使用相當多的工具，例如自動完成。也可以增加一些設定方便你 `debug`

* `noImplicitReturns` 可以防止你在 function 的最後忘記回傳值
* `noFallthroughCasesInSwitch` 可以協助你補上 `break` 在 `switch` 中的 `case`

`TypeScript` 依舊會對無法訪問的標籤的錯誤顯示，你可以利用 `allowUnreachableCode` 和 `allowUnusedLabels` 來取消

### 整合你的編譯工具

每個人都有自己的編譯步驟

下個範例是我們覺得目前最佳的方式

#### Gulp

相關的 `gulp` 使用可以參考我們另外一個[文件](https://www.typescriptlang.org/docs/handbook/gulp.html)

#### Webpack

`Webpack` 是一個相當簡單的工具！

你可以使用 `awesome-typescript-loader` 這是一個 `TypeScript` Loader

另外也可以使用 `source-map-loader` 讓你更易於 debug

```
  $ yarn add awesome-typescript-loader source-map-loader
```

將上述兩個套件加入你的 `webpack.config.js`

```javascript
module.exports = {
  entry: './src/index.ts'
  output: {
    filename: './dist/bundle.js'
  },

  devtool: 'source-map',

  resolve: {
    extensions: ['', 'webpack.js', '.web.js', '.ts', '.tsx', 'js']
  },

  moudle: {
    loaders: [
      {test: /\.tsx?$/, loader: 'awesome-typescript-loader'}
    ],

    preLoaders: [
      {test: /\.js$/, loader: 'source-map-loader'}
    ]
  }
}
```

`awesome-typescript-load` 必須在所有的 loader 的前面 `ts-loader` 也是一樣的道理，你可以在[這邊](https://github.com/s-panferov/awesome-typescript-loader#differences-between-ts-loader)獲得更多資訊

### 將 .js 轉換成為 .ts 

我們可以開始對檔案做一些動作開始轉換

第一個步驟就是將所有的 `.js` 換成 `.ts`

若是你的檔案有使用 `JSX` 則需要將檔案名稱換成 `.tsx`

當然你會覺得怪怪的，這樣就結束了麻？

當然不是！

接著你可以打開你的編輯器或是使用 `command line`

```
  $ tsc --pretty
```

你可以看到一些 `紅色` 的波浪底線

這些就像是 微軟的 word 軟體提醒你這些並不符合 `TypeScript` 的規範

如果這些對你說太寬鬆，你希望可以更加嚴謹的話你也可以使用 `noEmitOnError` 這一個選項來讓檢查更加嚴謹

如果你希望使用嚴謹模式可以參考這篇[文章](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html#getting-stricter-checks)

例如你不希望變數型態使用不明確的 `any` 你可以在編輯檔案之前使用 `noImplicitAny`。

#### 解決錯誤相關問題

就像剛剛提到的，你會修改 `.js` 為 `.ts` 或是 `.tsx` 的時候會有相當多的錯誤訊息

你會發現這些錯誤雖然是屬於合法的錯誤，但是透過這些錯誤可以發現 `TypeScript` 對你開發程式碼的好處。

##### import 模組

你可能會得到錯誤訊息是 `Cannot find name 'require'` 或是 `Cannot find name 'deffined'`

在這些狀況在這些狀況應該是 `TypeScript` 找不到這些模組

你需要預先選擇使用引入模組的方式，可以使用 `commonjs`, `amd`, `system` 和 `umd`

如果你有使用 Nod/CommonJS 

```javascript
var foo = require('foo');
foo.doStuff();
```

或是 RequireJS/AMD

```javascript
define(["foo"], function(foo){
  foo.doStuff();
});
```

你可以修改為

```typescript
import foo = require('foo');
foo.doStuff();
```

##### TypeScript 的宣告

如果你編譯檔案的時候有安裝 `foo` module

但是依然看到 `Cannot find module 'foo'`

這個錯誤訊息，很有可能是你並未有宣告的檔案來宣告你的 library，

要處理這個問題也很簡單


```
  $ yarn add @types/lodash -D
```

如果你有使用 module 選項是 `commonjs` 你另外需要設定 `moduleResolution` 為 `node`

然後你才可以正常沒有錯誤訊息的引用 lodash

##### Export 模組

通常在 export 模組的時候都是使用 `export` 或是 `module.exports`

`TypeScript` 允許你使用 `export` 參數，例如:

```javascript
module.exports.feedPets = function(pets){
  //....
}
```

你可以改為 


```typescript
export function feedPets(pets){
  //...
}
```

有時候你會直接複寫 `exports object`

這是屬於 `commonJS` 的設計

在引用這類的模組的時候

```javascript
var express = require('express');
var app = express();
```

你在之前會有像這樣的範例程式

```javascript
function foo(){
  //...
}
module.exports = foo;
```

在 `TypeScript` 你可以修改為 export = consturct

```typescript
function foo(){
  //...
}
export = foo;
```

有時候你呼叫函式的時候會有太多或是太少的參數，

通常這是一種 bug

但是在有些狀況中你可以宣告函示使用 `arguments object` 來代替寫出的所有參數

```javascript
function myCoolFunction() {
  if (arguments.length == 2 && Array.isArray(arguments[1])) {
    var f = arguments[0];
    var arr = arguments[1];

    arr.map(value => f(value));
  } else {
    var f = arguments[0];
    var arr = arguments[1];
    console.log("arguments: ", arguments);
  }
}

myCoolFunction(
  function(x) {
    console.log(x);
  },
  [1, 2, 3, 4]
);
myCoolFunction(
  function(x) {
    console.log(x);
  },
  1,
  2,
  3,
  4
);
```

result:

```
1
2
3
4
arguments:  { '0': [Function], '1': 1, '2': 2, '3': 3, '4': 4 }
```

在這個範例中因為有兩種 input 方式

所以在 `TypeScript` 需要改為

```typescript
function myCoolFunction(f: (x: number) => void, nums: number[]): void;
function myCoolFunction(f: (x: number) => void, ...nums: number[]): void

function myCoolFunction() {
  if (arguments.length == 2 && Array.isArray(arguments[1])) {
    var f = arguments[0];
    var arr = arguments[1];

    arr.map(value => f(value));
  } else {
    var f = arguments[0];
    var arr = arguments[1];
    console.log("arguments: ", arguments);
  }
}

myCoolFunction(
  function(x) {
    console.log(x);
  },
  [1, 2, 3, 4]
);
myCoolFunction(
  function(x) {
    console.log(x);
  },
  1,
  2,
  3,
  4
);
```

```
  $ tsc src/demo1.ts && node src/demo1.js
```

result

```
1
2
3
4
arguments:  { '0': [Function], '1': 1, '2': 2, '3': 3, '4': 4 }
```

在 `TypeScript` 中宣告了 myCoolFunction 兩個不同的宣告，

定義一個 f 為 `function : (x: number) => void`

然後也對多個變數使用 `...nums: number[]` 來宣告是一個數字陣列

##### 增加參數

有些人對一個物件增加參數使用下述方式

```javascript
let options = {};
options.color = 'red';
options.volume = 11;
```

`TypeScript` 則會表示這樣無法新增 color 和 volume 因為 property 不存在

```typescript
interface Options {color: string, volume: number};

var options = {}; // Error
var options = {} as Options; // Success

options.color = 'red';
options.volume = 11;
```

你可以將 type 定義為 `object` 或是 `{}` 這樣也可以自由地增加物件特性，但是比較常使用的是 `any` 來宣告這類型自由的型態

例如你有一個物件類型宣告為 `object` 你將無法呼叫 `toLowerCase()` 這個函式，但是若是你宣告的是 `any` 的類型的話，就可以呼叫這個函式。也就是當你宣告為 `any` 這個類型的話就不會有太多的錯誤提示你的型別問題

##### 嚴謹模式

`TypeScript` 可以幫你檢查並且分析你的程式，讓你的錯誤減少

###### 不推薦使用 any

使用了 `any` 這個類型會造成遇到錯誤時 `TypeScript` 也不會提醒你，也就喪失使用 `TypeScript` 的意義，你可以設定 `noImplicitAny` 這個選項來控制禁止使用 `any`

##### 更嚴謹的檢查 undefined 和 null

在 `TypeScript` 中 `undefined` 和 `null` 的類型宣告都是 `any`，但是 `undefined`和 `null` 在 `Javascript` 和 `TypeScript` 造成許多的 Bug，所以你可以設定 `strictNullChecks` 來做更嚴謹的檢查。

當你設定 `strictNullChecks` 的時候 `undefined` 和 `null` 也會擁有他們自己的類型 `undefined` 和 `null` ， 若是有些變數同時可能是數字或是 null 的時候，可以利用 `union` 來宣告類型， 例如

```typescript
declare var foo: string[] | null;

foo.length; // error - 'foo' 有可能是null
foo!.length; // okay - foo! 只可能是 'string[]'
```

#### 不可宣告 this 為 any

當你使用 `this` 這個keyword 的時候，預設是 `any`，例如

```typescript
class Point{
  constructor(public x, public y){}
  getDistance(p: Point){
    let dx = p.x - this.x;
    let dy = p.y - this.y;
    return Math.sqrt(dx ** 2 + dy ** 2);
  }
}

interface Point{
  distanceFromOrigin(point: Point): number;
}

Point.prototype.distanceFromOrigin = function(point: Point){
  return this.getDistance({x: 0, y: 0});
}
```

這部分就像我們上面談的問題其實是一樣的

我們沒辦法去檢查 `this` 這個變數的型態

`TypeScript` 也有一個 `noImplicitThis` 的選項

當這個選項被設定為 true 的時候， `TypeScript` 會提醒你在使用 `this` 時要設定型態

```typescript
Poing.prototype.distanceFromOrigin = function(this: Point, point: Point){
  return this.getDistance({x: 0, y: 0});
}
```