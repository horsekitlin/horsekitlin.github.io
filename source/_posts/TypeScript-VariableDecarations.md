---
title: TypeScript-VariableDecarations
author: TomasLin
date: 2017-11-02
categories: Javascript
tags:
  - Javascript
  - Typescript
  - Translate
---

# Variable Decarations

`let` 和 `const` 是兩種 Javascript 新的宣告方式， `let` 和 `var` 比較類似

`const` 則是定義之後禁止之後修改(常數)

`TypeScript` 也有提供 `let` 和 `const` 的宣告方式，下個部分將會解釋為什麼會推薦使用 `let` 和 `const`

## var 宣告

在 Javascript 中宣告一個變數常用的方式是

```javascript
var a = 10;
```

在上面的例子之中，你宣告了一個變數 `a` 為 `10`

你也可以再 Function 中宣告

```javascript
function f(){
  var message = 'Hello, World!';
  return message
}
```

也可以允許相同的變數在不同的 `Function scope`

```javascript
function f(){
  var a = 10;
  return function g(){
    var b = a + 1;
    return b;
  }
}
```

在上方的範例中 `g()` 中可以取得變數 `a` 得值

```javascript
function f(){
  var a = 1;
  a = 2;
  var b = g();
  b =  3;
  return b;
  function g(){
    return a;
  }
}

f(); // result 2
```

使用 var 宣告會有一些區域的規則問題

```typescript
function f(shouldInitialize: boolean){
  if(shouldInitialize){
    var x = 10;
  }
  return x;
}

f(true); // 10
f(false); //undefined
```

 因為 `var` 是在 if裡面，所以當 `shouldInitialize` 是 false 的話就部會執行 if裡面的程式碼

 所以 x 並未宣告過，就會造成 `undefined`

 這個規則可能會造成壹些不同種類型的錯誤，其中一種就是當你重複宣告同樣名稱的變數的時候彼此會互相覆蓋

```typescript
 function sumMatrix(matrix: number[][]){
   var sum = 0;
   for(var i = 0; i < currentRow.length; i++){
     var currentRow = matrix[i];
     for(var i =0;i < currentRow.length; i++>){
       sum += currentRow[i];
     }
   }

   return sum;
 }
```

 上述範例就可以發現因為 `i` 變數在雙迴圈中會被互相覆蓋造成程式執行上的錯誤，不會依據我們預想的去執行

 ### 奇怪的問題

```javascript
for(var i=0;i<10;i++){
  setTimeout(function(){console.log(i)}, 100*i);
}
```

但是結過卻是

```javascript
10
10
10
10
10
10
10
10
10
10
```

但是我們希望的是

```javascript
0
1
2
3
4
5
6
7
8
9
```

因為每次呼叫 `setTimeout` 會延遲一段時間後才開始執行 Function但是迴圈會不斷覆蓋掉 `i` 這個變數，而在延遲時間之後呼叫到的 `i` 則是最後覆蓋成 10 的 `i`

最常見要解決這件事情的方式如下

```javascript
for(var =0; i< 10; i++){
  (function(i){
    setTimeout(function(i){console.log(i);}, 100*i);
  })(i)
}
```

這個看起來有點奇怪的解決方式在 javascript 中卻是常見解決這個問題的方式

## let

現在你已經知道 `var` 會有一些問題，所以會有一些問題，所以為什麼需要介紹 `let`.`let` 和 `var` 的使用方式依樣

```javascript
let hello = 'hello';
```

### Block-scoping

使用 `let` 宣告的時候，它的作用域市 `blocking-scope`。和 `var` 宣告的作用域不一樣，他是用大括號來做區隔

```typescript
function f(input: boolean){
  let a = 100;
  if(input){
    let b = a + 1;
    return b;
  }
  return b; // b 並不存在
}
```

上述範例中有 `a` 和 `b` 兩個變數， `a` 的變數範圍在整個 `f()` Function 之中，而 `b` 只會存在 `if`之中

而變數使用 try catch 宣告的範例如下

```javascript
try{
  throw 'oh no!';
}catch(e){
  console.log('oh well');
}

console.log(e);// e not found
```

另外一個很重要的 `blocking-scope` 變數不能在宣告之前做任何動作

```javascript
a++;
let a;
```

在 `TypeScript` 中對這樣的提前宣告較為寬鬆，你需要使用 `try catch` 來取得錯誤訊息

若是沒有使用 `try catch` `TypeScrtip` 並不會顯示這個訊息，若是在 `ES2015` 則會顯示這個錯誤訊息

```javascript
function foo(){
  return a;
}

foo(); //會丟出一個錯誤訊息

 let a;
```

### 重複宣告和 shadowing

若是使用 `var` 的方式來宣告的話，他不會在意你宣告過幾次

```javascript
function f(x){
  var x;
  var x;
  if(true){
    var x;
  }
}
```

使用 `let` 宣告在同一個 scope 中只能宣告一次

```javascript
let x = 10;
let x = 20; // Error
```

```javascript
function f(x){
  let x = 100;// Error
}

function g(){
  let x = 100;
  let x = 120;// Error
}
```

只要是在不同的 `blocking-scope` 就可以做同名的宣告

```javascript
function (condition, x){
  if(condition){
    let x = 100;
    return x;
  }
  return x;
}


f(false, 0); // returns '0'
f(true, 0);  // returns '100'
```

宣告一個新的名稱在另外一個內嵌的 `block-scoping` 這個行為叫做 `shadowing`，但是這樣的行為會造成一些 bugs

例如：

```javascript
function sumMatrix(matrix: number[][]){
  let sum = 0;
  for (let i = 0; i < matrix.length; i++) {
        var currentRow = matrix[i];
        for (let i = 0; i < currentRow.length; i++) {
            sum += currentRow[i];
        }
    }

    return sum;
}
```

`shadowing` 在攥寫程式碼的時候應該要避免的狀況之一

### Block-scoped variable capturing

當我們在一個作用域中宣告一個變數與 Function ，而 Function 也是其中一個作用域，在這個 Function 使用已宣告的變數的時候，即使脫離了那個作用域，也是依舊可以使用該變數

```javascript
function theCityThatAlwaysSleeps(){
  let getCity;
  if(true){
    let city = 'Seattle';
    getCity = function (){
      return city;
    }
  }

  return getCity(); // Seattle
}
```

因為 `city` 雖然是在 `if` 的作用域宣告的，但是可以透過 Function 記住他的`指標`即使脫離作用域之後也可以透過該 Function 做呼叫使用

回憶之前 `setTimeout` 的範例， `let` 有相當大程度的不同

```javascript
for(let i=0; i < 10; i++>){
  setTimeout(function(){console.log(i)}, i * 100);
}
```

結果為

```
0
1
2
3
4
5
6
7
8
9
```

## const

`const` 是另外一種不同的宣告

```javascript
const numLivesForCat = 9;
```

雖然看起來跟 `let` 宣告一樣，雖然他們有相同的 `block-scoping` 規則，但是還是有些不同

`const` 宣告的變數是 `immutable` 的

```javascript
const numLivesForCat = 9;
const kitty = {
  name: "Aurora",
  numLives: numLivesForCat
};

kitty = {
  name: 'Danielle',
  numLives: numLivesForCat
}; // Error

// All OK
kitty.name = 'Rory';
kitty.name = 'Kitty';
kitty.name = 'Cat';
kitty.numLives--;
```

除非你要整個複寫整個物件，否則還是可以修改參數值得，

也就是此物件性質為 `唯讀` 的，[詳情參閱](https://www.typescriptlang.org/docs/handbook/interfaces.html)

## let vs. const

為什麼需要兩個不同的語意卻擁有相同的 `block-scoping` 的宣告方式呢？

基於 [最小權限原則](https://zh.wikipedia.org/wiki/%E6%9C%80%E5%B0%8F%E6%9D%83%E9%99%90%E5%8E%9F%E5%88%99)
若之後變數都不需要修改或是物件僅僅提供修改參數的權限時，則使用 `const`，換句話說若是變數之後有可能會被覆寫則使用 `let` 來宣告

## Destructuring

`ES2015` 的特性在 `Typescript` 中依舊可以使用

### Array destructuring

```typescript
let input = [1, 2];
let [first, secode] = input;

console.log(first); // 1
console.log(secode); // 2
```

這個解構也可以在 Function 中使用

```typescript
function f([first, second]: [number, number]){
  console.log(first);
  console.log(second;
}

f([1, 2]);
```

也可以將大量的變數指定給某一個變數

```javascript
let [first, ...rest] = [1, 2, 3, 4];
console.log(first); // 1
console.log(rest); // [2, 3, 4]
```

當然你也可抵應某些參數

```javascript
let [first] = [1, 2, 3, 4];
console.log(first); //1
```

也可以單存指定某些特定的參數

```javascript
let [, second, , fourth ] = [1, 2, 3, 4];
```

### Object destructuring

你也可以解構 `object`

```javascript
let o = {
  a: "foo",
  b: 12,
  c: "bar"
}

let = {a, b} = o;
```

你可以單純指定 `a`, `b` 而 `c` 可以因為不使用而跳過

你也可以使用 `...` 這個形態來指定變數

```javascript
let {a, ...passthrogh} = o;
let total = passthrough.b + passthrogh.c.length;
```

### property renaming

你可以對變數重新命名

```javascript
let {a: newName1, b: newName2} = o;
```

也可以將 `a:newName1` 改為 `a as newName1` 也是一樣的效果

在 `TypeScript` 也是需要宣告類型

```typescript
let {a, b}: {a: string, b: number} = o;
```

### Default vaules

在你解構的時候也可以提供預設值

```typescript
function keepWholeObject({a: string, b?: number}){
  let {a, b = 1001} = wholeObject;
}
```

`keepWholeObject` 中的 `b` 若是有參數則指定該參數，若是 `undefined` 或是 `null` 則指定為預設值 `1001`

### 宣告 Function

解構依舊可以使用在宣告函式之中

```typescript
type C = {a: string, b?:number};
function({a, b}: C){
  // ...
}
```

也可以解構時預先放入預設值

```typescript
function f({a, b} = {a: "", b: 0}): void{
  //...
}

f(); // ok, default to {a: "", b: 0}
```

參數與設定型態都可以給予預設值，但是這兩個又有什麼不同呢？

```typescript
function({a, b=0}: {a: ""}): void{
  //...
}
 f({a: 'yes'}); // ok default b  = 0
 f(); // default to a = {a: ""}, default b = 0;
 f({}); // error 'a' is required 
```

## Spread

`ES2015` 中的 `Spread` 特性也是支援的

```typescript
let first = [1, 2];
let second = [3, 4];
let bothPlus = [0, ...first, ...second, 5];
console.log(bothPlus); // [0, 1, 2, 3, 4, 5]
```

`Spread` 也可以使用在 `object`

```typescript
let defaults = {food: 'spicy', price: '$$', ambiance: 'noisy'};
let search = {...defaults, food: 'rich'};
console.log(search); // {food: 'rich', price: '$$', ambiance: 'noisy'}
```

在上述範例中 `search` 會解構 `defaults` 而且後面的 food 因為和 `defaults` 中重複而且順序在 `defaults` 的後面，所以會被覆蓋

```typescript
let defaults = {food: 'spicy', price: '$$', ambiance: 'noisy'};
let search = {food: 'rich', ...defaults};
console.log(search); // {food: 'spicy', price: '$$', ambiance: 'noisy'}
```

但是 `Spread` 只會繼承特性，部會繼承 Function

```typescript
class C{
  p = 12;
  m(){
    //...
  }
}

let c = new C();

let clone = {...c};

console.log(clone.p); // 12
console.log(clone.m); // undefined
```

另外 `TypeScript` 編譯過程並不允許 `generator function` 的 `Spread` 參數傳遞
