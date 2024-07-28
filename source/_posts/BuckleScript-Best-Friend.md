---
title: BuckleScript-Best-Friend
author: TomasLin
tags:
  - Javascript
  - IThome2018
  - Reason
  - BuckleScript
categories:
  - Reason
date: 2018-10-14
---

# BuckleScript

## OCaml

`BuckleScript` 的基礎

如果需要對 OCaml 有興趣可以參考 [官方文件](https://realworldocaml.org/)

如果對 Reason 有興趣可以參考 [官方文件](https://reasonml.github.io/)

## Reason

OCaml 的另一種語法，對 `Javascript` 的開發者比較親切

## OPAM

官方的套件管理， 自從 `BuckleScript` 支援 NPM/YARN 之後就不需要使用他了

## External/Interop/FFI

都是 `BuckleScript <-> JavaScript` 交互編譯的術語

* External - 在 `BuckleScript` 中使用 JS 值得一種方式
* Interop - interoperability 的縮寫
* FFI - `Foreign Function Interface` 的縮寫, "external", "wrapper" 和 "interop" 的通用術語, 基本上就是在一個語言中呼叫另一個語言的值

| 值 | bs | 意義 |
|---|---|---|
| val | [@bs.val]  | global value |
| scope | [@bs.scope] | use names as a namespace |
| new | [@bs.new] | new constructor |
| module | [@bs.module] | 從某一個 mobule 綁定其中一個值 |
| send | @bs.send | function chaining |
| send.pipe | @bs.send.pipe | function chaining includes parameters |
| splice | [@bs.splice] | 具有不定長度參數的函式 |

**note:這只是一小部分**

### 使用場景

* 在 `Reason` 中直接寫 Javascript
* 引用 js lib 使用 (global, default, other libs)
* 使用現有 `Bucklescript` 所提供的lib

### 原生 Javascript

```reason

[%%raw "var a = 1, b = 2"];
let add = [%raw "a + b"];
let myFunction = [%raw "(a, b) =>  a + b"]
Js.log(myFunction(1)(2));
```

### 字串 Unicode 和 template string

```reason
Js.log({js|你好，
世界|js});

let world = "world";
let helloWorld = {j|hello, $world|j};
```

### 全域變數

**note: 先看看官方是否有先幫你完成的 [API](https://reasonml.github.io/api/index.html) 再決定是否要自己處理**

```reason
[@bs.val] external setTimeout/* 在 Reason 中使用的模組名稱 */: (unit => unit, int) => float = "setTimeout";/* 對應到 Javascript 中的模組名稱 */

let eventId = setTimeout(() => Js.log("hello setTimeout"), 1000);
Js.log(eventId);
```

### function chaining

亦或是利用 `map` 和 `filter` 做一些陣列處理的時候

```reason
[@bs.send] external map: (array('a), 'a => 'b) => array('b) = "";
[@bs.send] external filter: (array('a), 'a => 'b) => array('b) = "";

let mapResult = map([|1, 2, 3|], a => a + 1);
let result = filter(mapResult, a => a mod 2 === 0);
Js.log(result);
```

上面的範例 `map` 和 `filter` 為什麼要使用 `send` 呢？

也有另外一個比較漂亮的做法

```reason
[@bs.send] external map: (array('a), 'a => 'b) => array('b) = "";
[@bs.send] external filter: (array('a), 'a => 'b) => array('b) = "";

[|1, 2, 3|]
->map(a => a+1)
->filter(a => a mod 2 === 0)
->Js.log
```

但是這部分之後再探討

### 全域模組

```reason
[@bs.val] [@bs.scope "Math"] external random: unit => float = "random";
let someNumber = random();
/**/

/* front end demo */
[@bs.val] [@bs.scope ("window", "location", "ancestorOrigins")] external length: int = "length";
```

#### 可空值

```reason
let a = Some(5);
let b = None;
```

```reason
let JsNullable = Js.Nullable.null;
let JsUndefined = Js.Nullable.undefined;

let result1: Js.Nullable.t(string) = Js.Nullable.return("hello"); /* hello */
let result2: Js.Nullable.t(int) = Js.Nullable.fromOption(Some(10)); /* 10 */
let result3: option(int) = Js.Nullable.toOption(Js.Nullable.return(10)); /* 10 */
```

這一部份在後續章節也會做更詳細的討論

#### 模組

##### 預設輸出 ES6

LeftPad.re
```reason
let default = (name: string, age: int) => Js.log({j|$name 年紀 $age|j});
```
##### Import Module
ImportModule.re
```reason
[@bs.module "./LeftPad.bs"] external leftPad : (string, int) => string = "default";

leftPad("hello", 123);
```

因為 `bsconfig.js` 中的 `suffix` 設定為 `.bs.js`

所以當我們要 import 的時候需要加上 .bs

他編譯後的結果會是
```javascript
var LeftPadBs = require("./LeftPad.bs");

LeftPadBs.default("hello", 123);
```

否則會找不到這個檔案

##### Global Module
```reason
[@bs.module "path"] external dirname: string => string = "";

Js.log(dirname("/foo/bar/baz/asdf/quux"));
```

```javascript
var Path = require("path");

console.log(Path.dirname("/foo/bar/baz/asdf/quux"));
```

`@bs.module` 會將模組引入

`external` 則是指定輸出的名稱 (在`Reason` 使用的名稱)

最後則是要引入的名稱，但是如果同名則可以設為空字串

#### 參數長度可變

使用 module `path` 中的 `join` 來做 demo

```reason
[@bs.module "path"] [@bs.splice]
external join : array(string) => string = "";

Js.log(join([|"/", "hello", "/", "world"|]));
```

`bs.module` 先指定來源 `path`

再加上 `bs.splice` 來告訴 `Reason` 他是一個具有不固定長度參數的 function

利用 `array` 的 長度是彈性的優點來做彈性的多參數處理

