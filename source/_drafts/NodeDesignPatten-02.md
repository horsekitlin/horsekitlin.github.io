---
title: NodeDesignPatten-02
author: TomasLin
tags: [Nodejs, DesignPatten]
---

# Chapter 2: Node.js Essential Patterns

## JavaScript is a great language for callbacks

## The callback pattern

* blocking: 執行的時候會等待收到Response
才會開始下一個步驟
  *  Function 回傳值時使用 
 * non-blocking 執行的時候不等待執行完畢
直接執行下一個步驟

#### synchronous and asynchronous

synchronous Example

```
function add(a, b){
  return a + b;
}
var result = add(1, 2);
console.log(result); // 3
```

asynchronous Example

我定義一個 callback Function 處理結果

```
function callback(result){
  console.log(result);
  return result;
}

function add(a, b, cb){
  var result = a + b;
  cb(result);
}

var result = add(1, 2, callback); // 3

console.log(result); // undefined
```

將定義後的callback傳入add中

當執行完畢之後的結果傳入 **callback** 中回傳

#### Closures

'''

'''

### The continuation-passing style

#### direct style (not CPS)

#### synchronous continuation-passing

#### asynchronous continuation-passing

#### non continuation-passing callbacks


### Synchronous or asynchronous?
#### an unpredictable function 

#### unleashing Zalgo 

#### using synchronous APIs 

#### deferred execution 

### Node.js callback conventions
#### callbacks come last

#### error comes as the first argument of callback

#### The error must always be of type Error 

#### propagating errors

#### uncaught exceptions

## The module system and its patterns

### the revealing module pattern

#### module of JavaScript's style

### Node.js modules explained
#### a homemade module loader

#### defining a module

####  defining globals

#### require is synchronous

#### the resolving algorithm

#### the module cache
- Each module is only loaded and evaluated the first time it is required, since any subsequent call of `require()` will simply return the cached version.
- Caching is crucial for performance
- It makes it possible to have cycles within module dependencies
- The same instance is always returned when requiring the same module from within a given package
- The module cache is exposed via the `require.cache` variable
#### circular dependence

### Module definition patterns
#### named exports - CommonJS compatible 

#### exporting a function - small surface

#### exporting a constructor

#### class

#### guard - factory

#### guard - ES2015 style

#### exporting an instance

#### modifying other modules or the global scope - monkey-patching

## The observer pattern

### Creating and using EventEmitter

### Propagating errors

### Making any object observable

### Synchronous and asynchronous events

### Combining callbacks and EventEmitter

## 參考資料

[Zalgo 的來源](http://blog.izs.me/post/59142742143/designing-apis-for-asynchrony)

[Simen 相關影片](https://www.youtube.com/watch?v=ouuRKq6tZsI&t=654s)

[Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)

[process.nexttict](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)

針對Process.nexttick 的Demo Code

```
const fs = require('fs');
const http = require('http');
const options = {  host: 'www.stackoverflow.com', port: 80,  path: '/index.html'};
describe('deferredExecution', (done) => {  it('deferredExecution', () => { console.log('Start');    setTimeout(() => console.log('TO1'), 0);  setImmediate(() => console.log('IM1'));    process.nextTick(() => console.log('NT1'));    setImmediate(() => console.log('IM2')); process.nextTick(() => console.log('NT2'));    http.get(options, () => console.log('IO1'));    fs.readdir(process.cwd(), () => console.log('IO2'));    setImmediate(() => console.log('IM3')); process.nextTick(() => console.log('NT3'));    setImmediate(() => console.log('IM4'));    fs.readdir(process.cwd(), () => console.log('IO3'));    console.log('Done');
setTimeout(() => done, 1500);  });
});
```

NextTick

一個 tick 的時間長度，是 Event Loop 繞完一圈，把所有 queues 中的 callbacks 依序且同步地執行完，所消耗的總時間。因此，一個 tick 的值是不固定的。可能很長，可能很短，但我們希望它能盡量地短。
所以再一次，所有 Node.js 開發者一再強調：「不要在 callback 中執行 long-running 的工作！」因為你會阻塞 Event Loop，當每一個 tick 的時間被你拉長，代表每單位時間 Event Loop 可以繞行而檢測出 I/O 事件的次數就會降低，非同步程式碼的效能因而折損

[Private variables vs. Static variables](http://stackoverflow.com/questions/21861677/javascript-module-pattern-private-variables-vs-static-variables)

[CommonJS 規格說明](http://wiki.commonjs.org/wiki/Modules/1.1.1)

[Module 的補充說明](http://wiki.commonjs.org/wiki/Modules/1.1.1)