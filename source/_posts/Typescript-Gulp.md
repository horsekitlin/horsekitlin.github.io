---
title: TypeScriptWithGulp
author: TomasLin
date: 2017-10-29
categories: Javascript
tags:
  - Javascript
  - Typescript
  - Translate
---

# 翻譯來源

[TypeScriptWithGulp](https://www.typescriptlang.org/docs/handbook/gulp.html)

# Gulp

此篇是使用 `TypeScript` 和 `Gulp` 並且利用 `Gulp` 的 pipeline增加 `Browserify` , `uglify` 或 `watchify` 以及 `Babelify`等等功能

## Minimal project

在此範例中建立一個資料夾  `proj` 但是你可以建立一個你希望的名字的資料夾

```
  $ mkdir proj
  $ cd proj
```

先簡單建立資料結構

```
  proj/
   ├─ src/
   └─ dist/
```

### 初始化

```
 $ mkdir src dist
 $ yarn init
```

### 安裝相關的套件

```
  $ npm install -g gulp-cli
  $ yarn add typescript gulp gulp-typescript -D
```

### Example

在 `src` 中建立一個新的 `main.ts`

```typescript
function hello(compiler: string) {
    console.log(`Hello from ${compiler}`);
}
hello("TypeScript");
```

在 `proj` 中建立一個 `tsconfig.json`

```json
{
    "files": [
        "src/main.ts"
    ],
    "compilerOptions": {
        "noImplicitAny": true,
        "target": "es5"
    }
}
```

建立一個 gulpfile.js

```javascript
var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("default", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});
```

#### 測試 App

```
  $ gulp
  $ node dist/main.js
  //result: Hello from TypeScript
```

#### 增加模組

建立一個新的檔案 `src/greet.ts`

```typescript
export function sayHello(name: string){
  return `Hello from ${name}`;
}
```

然後再修改 `src/main.ts`

```typescript
import { sayHello } from "./greet";

console.log(sayHello("TypeScript"));
```

最後再修改 `tsconfig.json` 將 `src/greet.ts` 加入編譯

```json
{
    "files": [
        "src/main.ts",
        "src/greet.ts"
    ],
    "compilerOptions": {
        "noImplicitAny": true,
        "target": "es5"
    }
}
```

#### 執行

```
 $ gulp && node dist/main.js
```

然後就可以看到編譯後執行的結果

```
Hello from TypeScript
```

`Note: 雖然我們使用 ES2015 但是 TypeScript 使用 commonJS 模組，但是你也可以在 options 中設定 module 來改變它`


#### Browserify

我們開始寫前端的程式

我們希望可以把所有 modules 打包到一個 Javascript 檔案

而這些事情就是 `browserify` 所做的事情，而這會使用到 `CommonJS` 模組，而這也正好是 `TypeScript` 預設使用的，也就是我們可以在 `TypeScript` 直接使用 `browserify`

先安裝 `browserify`, `tsify`, `vinyl-source-stream`

`tsify` 是 browserify 的 plugin 做的事情就像是 `gulp-typescript` 一樣，而`vinyl-source-stream` 則是提供一種方便我們了解的檔案輸出格式

```
  $ yarn add browserify tsify vinyl-source-stream -D
```

在 `src` 中建立一個 index.html 的檔案

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <title>Hello World!</title>
</head>

<body>
  <p id="greeting">Loading ...</p>
  <script src="bundle.js"></script>
</body>

</html>
```

然後修改 `main.ts`

```typescript
import { sayHello } from "./greet";

function showHello(divName: string, name: string) {
  const elt = document.getElementById(divName);
  elt.innerText = sayHello(name);
}

showHello("greeting", "TypeScript");
```

接著再修改 gulpfile.js

```javascript
const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify')

const paths = {
  pages: ['src/*.html']
};

gulp.task('copy-html', () => {
  return gulp.src(paths.pages)
  .pipe(gulp.dest('dist'));
});

gulp.task('default', ['copy-html'], () => {
  return browserify({
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {}
  })
  .plugin(tsify)
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('dist'));
});
```

增加一個 `copy-html` 的task 並且將其加入在 `default` 的 task中，也就是代表當 `default`執行的時候會先執行 `copy-html` 並且也修改 `default` 的 function 加入呼叫 `Browserify` 和 `tsify` 的 plugin，將 `tsify` 取代 `gulp-typescript` 也丟入一些參數在 `Browserify` 之中, 在 bundle 之後 再利用 `vinyl-source-stream` 輸出檔案 `bundle.js`

然後我們可以執行之後再用瀏覽器開啟 `dist/index.html`來觀看結果

`Note: 設定 debug: true 是因為 在打包成為一個檔案之後， SourceMap 可以對照你打包後的檔案，當你發生錯誤的時候，就可以找到相關錯誤位置，提高 debug 的效率`

#### watchify, Babel and Uglify

現在我們已經有 `tsify`, `browserify` 我們還可以再加入一些套件

* `Watcherify` 利用 `gulp` 啟動，可以保證程式持續執行，並且在修改後同步修改重啟，你的瀏覽器也可以立即 refresh 觀看結果

* Babel 是一個大型並且彈性的編譯 Lib 可以將 ES2015 轉回 ES5 和 ES3，可以自行增加擴充編譯套件，而這些是 `typescript` 沒有支援的

* `Uglify` 則是將你的程式最小化，讓你下載的時間可以大大減少下載的時間

##### Watcher

安裝 watchify和 gulp-util

```
  $ yarn add watchify gulp-util -D
```

再修改 `gulpfile.js`

```javascript
const gulp = require("gulp");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const tsify = require("tsify");
const watchify = require('watchify');
const gutil = require('gulp-util');

const watchedBrowserify = watchify(browserify({
    basedir: ".",
    debug: true,
    entries: ["src/main.ts"],
    cache: {},
    packageCache: {}
})).plugin(tsify);

const paths = {
  pages: ["src/*.html"]
};

gulp.task("copy-html", () => {
  return gulp.src(paths.pages).pipe(gulp.dest("dist"));
});

function bundle(){
  return watchedBrowserify
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("dist"));
}
gulp.task("default", ["copy-html"],bundle);

watchedBrowserify.on('update', bundle);
watchedBrowserify.on('log', gutil.log);
```

`gulpfile.js`做了三個改變

1. 在 `browserify` 外面包覆了一層 `watchify`
2. 我們監聽了 `watchedBrowserify` 的 update Event 每次修改的時候就會自動重新打包並產生新增檔案到 `dist` 到資料夾內
3. 我們也監聽了 `log` 的 Event 使用 `gulp-util` 的 log 來做紀錄顯示

綜合以上 1, 2 的步驟我們將 `browserify` 移出了 `default task` 放到了 function `bundle`裡然後透過 監聽 `update` 的 Event 來隨時重新編譯程式

而 3 則是會列印出過程的訊息方便我們開發程式的時候查閱

然後我們開始啟動則會看到下方的訊息

```
16:31:53] Starting 'copy-html'...
[16:31:53] Finished 'copy-html' after 15 ms
[16:31:53] Starting 'default'...
[16:31:54] 2690 bytes written (0.09 seconds)
[16:31:54] Finished 'default' after 1.12 s
```

並且當你修改 `main.ts` 時會自動重新編譯

也就是當你重新 refresh 網頁的時候

就可以看到最新的更新狀態

#### Uglify

因為 `Uglify` 會撕裂你的程式碼，所以需要安裝 `vinyl-buffer` 和 `gulp-sourcemaps` 來讓 `sourcemaps` 持續動作

```
  $ yarn add gulp-uglify vinyl-buffer gulp-sourcemaps -D
```

`gulpfile.js`修改為

```javascript
const gulp = require("gulp");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const tsify = require("tsify");
const watchify = require("watchify");
const gutil = require("gulp-util");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const buffer = require("vinyl-buffer");

const watchedBrowserify = watchify(
  browserify({
    basedir: ".",
    debug: true,
    entries: ["src/main.ts"],
    cache: {},
    packageCache: {}
  })
).plugin(tsify);

const paths = {
  pages: ["src/*.html"]
};

gulp.task("copy-html", () => {
  return gulp.src(paths.pages).pipe(gulp.dest("dist"));
});

function bundle() {
  return watchedBrowserify
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("dist"));
}

gulp.task("default", ["copy-html"], bundle);

gulp.task("production", ['copy-html'], () => {
  return browserify({
    basedir: ".",
    debug: true,
    entries: ["src/main.ts"],
    cache: {},
    packageCache: {}
  })
    .plugin(tsify)
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("dist"));
});

watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);
```

```
  $ gulp production
```

`Note: Uglify 只需要做一次，buffer和 sourcemaps 會產生一個獨立的檔案 bundle.map.js 你也可以確認 bundle.js 中的程式事不是已經最小化了`
