---
title: NodeDesignPatten-01
author: TomasLin
tags:
  - Nodejs
  - DesignPatten
date: 2017-04-29
categories: Designpatten
---


# Welcome to the Node.js Platform

## Small modules

    * NPM
        * 提供一個共同的Module 下載平台
        * 分享彼此的模組，節省時間
        * DRY(Don't Reapt yourself)
    * 小型的模組
        * 易於維護與測試
        * 做好一件事情就好
        * 避免使用Global變數造成套件之間衝突
        * 容易被理解
    * package.json
        * 解決依賴性地獄的問題
        * 版本控制

## Introduction to Node.js 6 and ES2015

[ES6 瀏覽器支援現況](https://kangax.github.io/compat-table/es6/)

```
strict mode is enbend
```
[strict mode](https://www.google.com/search?q=javascript+strict+mode&ie=utf-8&oe=utf-8)

### The arrow function

[try it out](https://babeljs.io/repl/#?babili=false&evaluate=true&lineWrap=false&presets=es2015%2Creact%2Cstage-2&targets=&browsers=&builtIns=false&code=)

### Class syntax

* ES5 沒有 Class

[ES5 prototype](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype)

[ES5 prototype.call](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Function/call)

* constructor
* super

### Enhanced object literals

**object**

* object - 沒有順序的集合
* key - 為英文或數字_ 的集合
* value - 可以是任何類型的變數(string, number, boolean...)

**array**

* array - 有順序的集合
* key - 從0 開始依序往上遞增
* value - 可以是任何類型的變數(string, number, boolean...)

**seter and geter**

[Getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get)

[Setter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set)

### Map and Set collections

[Map](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Map)

[Set](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Set)

* key 與 value的配對
* 當key刪除的時候，記憶體會自動被Realse?

### WeakMap and WeakSet collections

[startwordflow 討論 weakmap](http://stackoverflow.com/questions/29413222/what-are-the-actual-uses-of-es6-weakmap)

### Template literals

字串組合方式

```
var lastname = 'Tomas';
var firstname = 'Lin';
var fullname = firstname +' ' +  lastname;
```

```
var lastname = 'Tomas';
var firstname = 'Lin';
var fullname = `${firstname} ${lastname}`;
```