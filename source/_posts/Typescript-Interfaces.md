---
title: Typescript-Interfaces
author: TomasLin
date: 2017-11-03
categories: Javascript
tags:
  - Javascript
  - Typescript
  - Translate
---

# Interfaces

## 簡介

`TypeScript` 有一種類型宣告方式，有時候這個模式叫做 `duck typing` 或是 `structural subtyping`， 或統稱為 `interface` 

### 第一個 interface

最簡單的的 `interface`

```typescript
function printLabel(labelledObj: {label: string}){
  console.log(labelledObj.label);
}

let myObj = {size: 10, label: 'Size 10 Object'};
printLabel(myObj);
```

呼叫 `printLabel` 的時候會進行 type-check，而在 `printLabel` 中就有參數檢查， `label` 必須是 `string`, 實際上可能有更多的屬性，不只是 `label`, 檢查只會檢查 `label` 屬性是不是字串，有些狀況 `TypeScript` 並不寬鬆，之後會慢慢做解釋

依據上面的範例可以使用 `interface` 指定 `label` 為必要參數

```typescript
interface LabelledValue{
  label: string
}

function printLabel(labelledObj: LabelledValue){
  console.log(labelledObj.label);
}

let myObj = {size: 10, label: 'Size 10 Object'};
printLabel(myObj);
```
`LabelledValue` 是我們可以描述參數必要性的範例，代表輸入值必須要有一個 `label` 變數型態為字串，我們並不需要非常明確的指定 `printLabel` 這個 Function 的輸入參數，只要符合這個 `interface` 就會允許使用

### Optional Properties

也可以定義不一定會存在的參數

```typescript
interface Squareconfig{
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): {color: string, area: number}{
  let newSquare = {color: "white", area: 100};
    if (config.color) {
        newSquare.color = config.color;
    }
    if (config.width) {
        newSquare.area = config.width * config.width;
    }
    return newSquare;
}

let mySquare = createSquare({color: "black"});
```

### 唯讀

有些 properties 應該只能被修改，無法整個被覆寫

```typescript
interface Point {
  readonly x: number;
  readonly y: number;
}

let p1: Point = {x: 10, y: 20};
p1.x = 5; // Error
```

也可以定義一個唯讀的陣列

```typescript
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12; //Error
ro.push(8); //Error
ro.length = 100; // Error
a = ro; //Error
```

最後一行中，當你定義為普通 `ReadArray` 要 assign 給一個 `Array` 是不允許的

#### readonly vs const

`const` 只是禁止你的物件被覆寫，而 `readonly` 則是設定你的物件中的參數被覆寫

### Excess Property Checks

在第一個範例中，雖然我們寫了一個 `interface` 是 `{size: number, label: string}` 但是我們真正有使用的只有 `{label: string}`, 我們在剛剛也有提到 `optional properties` 或是稱為 `option bags`

但是這兩個一起使用的話也有可能產生一些問題

```typescript
interface SquareConfig{
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): {color: string, area: number}{
  //...
}

let mySquare = createSquare({colour: "red", width: 100});
```

上述範例中 `creteSquare` 中的 `colour` 拼錯了，正確應該是 `color`, 並且 `TypeScript` 會顯示編譯錯誤，然而你可以辯解說因為 `width` 是正確的， `color` 並不存在，但是 `colour` 名稱的錯誤是微不足道的

```
// error: 'colour' not expected in type 'SquareConfig'
let mySquare = createSquare({ colour: "red", width: 100 });
```

這時候正規的實作方式可以是

```typescript
interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
}
```

我們將會討論 `index signatures` 但是在這裡可以說 `SquareConfig` 可以有任意數量的 properties 不論是不是 `color` 或是 `width` 他們並不在意

另外還有一種方法，你直接宣告一個 `SquareOptions` 物件來放入 `createSquare` 中也不會有錯誤出現

```typescript
let squareOptions = { colour: "red", width: 100 };
let mySquare = createSquare(squareOptions);
```

請記得上述的範例，不應該讓這些檢查類別變得更加的複雜，你應該要持續檢查這些類型，因為大多數的錯誤都會造成 bugs。如果你允許 在 `createSquare` 中使用 `color` 或是 `colour` 這兩個參數，你應該修改 `squareConfig` 來顯示這兩種使用情境

## Function Types

`interfaces` 可以用來描述物件的輪廓，然而為了要可以描述物件的 `properties` 所以 `interfaces` 應該也是可以描述 `Function types`

`interfaces` 描述一個 `function type` 的時候只需要定義 parameter 列表和回傳值，每一個 parameter 都需要明確的定義名稱和類別

```typescript
interface SearchFunc{
  (source: string, subString: string): boolean;
}
```

只需要定義一次之後就可以拿這個 `interface` 來建立變數

```typescript
interface SearchFunc{
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string){
  let result = source.search(subString);
  return result > -1;
}
```

在宣告 `Function ` 的時候 parameter 的名字不一定要一樣

```typescript
interface SearchFunc{
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(src: string, sub: string): boolean{
  let result = src.search(sub);
  return result > -1;
}
```

宣告也可以只宣告一次，，之後依據同類型宣告的 `Function` 也會依照之前宣告的 `interface` 做檢查，不避在重複定義。

```typescript
interface SearchFunc{
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(src, sub) {
    let result = src.search(sub);
    return result > -1;
}
```

### Indexable Types

基本上我們可以用 `interface` 來定義 `Function` 也可以來定義 `index`

```typescript
interface StringArray{
  [index: number]: string;
}

let myArray: StringArray;
myArray = ["Bob", "Fred"];

let myStr: string = myArray[0];
```

在上方的範例中， `StringArray` 中有宣告一個 index type 為 `number`。

基本上只有 兩種類型的 `index`， 就是 `number` 和 `string`，也可以同時支援兩種類別，但是在支援兩種類別的時候若是為 `100` 則必須是回傳 `'100'`，也就是兩種類別必須要統一

```typescript
class Animal{
  name: string;
}

class Dog extends Animal{
  breed: string;
}

interface NotOkay{
  [x: number]: Animal;
  [x: string]: Dog;
}
```

`string` 是非常實用的宣告 `index` 方式，
因為 `obj.property` 也可以視為 `obj['property']`

這一個範例因為 `name` 的類別並不匹配，所以在檢查類別的時候會有錯誤

```typescript
interface NumberDictionary{
  [index: string]: number;
  length: number; //ok, length is a number
  name: string; //error name is not a subtype of the indexer
}
``` 

最後我們試著宣告一個唯讀的 `interface`

```typescript
interface ReadonlyStringArray{
  readonly [index: number]: string
}

let myArray: ReadonlyStringArray = ["Alice", "Bob"];

myArray[2] = "Mallory"; // Error
```

## Class Type

### 實現一個 class 的 type

```typescript
interface ClockInterface{
  currentTime: Date;
}

class Clock implements ClockInterface{
  currentTime: Date;
  constructor(h: number, m: number){}
}
```

也可以描述在 class 中的 method， 例如在 `Clock` 中描述一個 `setTime` 的 method

```typescript
interface ClockInterface{
  currentTime: Date;
  setTime(d: Date): void;
}

class Clock implements ClockInterface{
  currentTime: Date;
  setTime(d: Date){
    this.currentTime = d;
  }
  constructor(h: number, m: number){}
}
```

### Difference between the static and instance sides of classes

當我們要使用 `interface` 來宣告 `class` 的時候，要記得 `class` 有兩種類型，一種是 public 一種是 static 當你要宣告一個 `class` 的 constructor 的時候會有錯誤

```typescript
interface ClockConstructor{
  new (hour: number, minute: number);
}

class Clock implements ClockConstructor{
  currentTime: Date;
    constructor(h: number, m: number) { }
}
```

這是因為當一個 `class` 轉為 `instance` 的時候，只有 `instance` 這邊有做 typing-check 而再 static-side 並沒有包含這個檢查

所以在下面的這個範例，需要定義兩個 `interface` ，`ClockContructor` 是為了 constructor 而 `ClockInterface` 是為了實體化後的物件定義，而會了方便我們定義 constructor 所以又建立一個 `createClock` 來做這件事情

```typescript
interface ClockConstructor {
  new (hour: number, minute: number);
}
interface ClockInterface {
  tick();
}

function createClock(
  ctor: ClockConstructor,
  hour: number,
  minute: number
): ClockInterface {
  return new ctor(hour, minute);
}

class DigitalClock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log("beep beep");
  }
}

class AnalogClock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log("tick tock");
  }
}

let digital = createClock(DigitalClock, 12, 18);
let analog = createClock(AnalogClock, 7, 21);
```

因為 `createClock` 的第一個參數是 `ClockConstructor` 在 `createClock(AnalogClock, 7, 21)` 中檢查 `Analogclock` 的 constructor 是否有正確的參數類型

就像 `classes` 一樣 `interface` 可以利用繼承將他們的屬性傳給自己的 `Children`

```typescript
interface Shape {
  clolor: string;
}

interface Square extends Shape {
  sideLength: number;
}

let square = <Square>{};
square.color = 'blue';
square.sideLength = 10;
```

也允許多重繼承，建立一個集合體

```typescript
interface Shape {
  color: string;
}

interface PenStroke {
  penWidth: number;
}

interface Square extends Shape, PenStroke {
  sideLength: number;
}

let s = <Square>{};
s.color = "blue";
s.sideLength = 10;
s.penWidth = 5.0;
```

### Hybird Type

Javascript 常常會有很豐富的一個 多次繼承，也可以使用 `Hybird Type` 來做多個繼承

```typescript
interface Conter{
  (start: number): string;
  interval: number;
  reset():void;
}

function getCounter():Counter{
  let counter = <Counter>function(start: number){};
  counter.interval = 123;
  counter.reset = function(){};
  ;return counter;
}

let c = getCounter();
c(10);
c.reset()
c.interval = 5.0;
```

### Interfaces Extending Classes

當一個 `interface` 繼承了一個 class 只是繼承了他的屬性而不是他的實體只是繼承了他的屬性而不是他的實體，這就是說當你要實踐這個 `interface` 的同時也必需繼承同一個 class 來實現他的所有屬性

當你有一個很大的繼承架構，但是又想要自訂一個程式碼專為某一個 subclass 中的某些屬性 又不希望她繼承所有的父輩繼承

```typescript
class Control {
    private state: any;
}

interface SelectableControl extends Control {
    select(): void;
}

class Button extends Control implements SelectableControl {
    select() { }
}

class TextBox extends Control {

}

// Error: Property 'state' is missing in type 'Image'.
class Image implements SelectableControl {
    state = 1;
    select() { }
}

class Location {

}
```

上述範例中 `SelectableControl` 包含了所有的 `Control` 的屬性，包含 `private` 的 state，這意味著之後要實現 `SelectableControl` 的同時只能 extends `Control` 一個類別去承接他的 `private` 的 state

在 `Control` 之中允許透過 `SelectableControl` 來取得 `private` state，而 `SelectableControl` 就像是 `Control` 知道他還會有一個 `function select`， `Button` 和 `TextBox` 是 `SelectableContorl` 的子類，因為他們都是繼承魚 `Control` 但是 `Image` 和 `Location` 則不是