---
title: Typescript-Function
author: TomasLin
date: 2017-11-05
categories: Javascript
tags:
  - Javascript
  - Typescript
  - Translate
---

# Functions

`Function` 在 Javascript 中是很基本的型態，可以用在隱藏資訊，或攥寫模組等功用

Javascript 中基本的 `Function` 有兩種

```javascript
function add(x, y){
  return x+y;
}

let myAdd = function(x, y){return x+y;}
```

在 Javascript 中的 `Function` 可以使用外部的變數，這個行為叫做 `capture` 

```javascript
let z = 100;
function addToZ(x, y){
  return x + y + z;
}
```

使用 `TypeScript` 寫一個最基本的範例

```typescript
function add (x: number, y: number): number{
  return x + y;
}

let myAdd = function(x: number, y: number): number{return x+y;};
```

完整的 `Function` Type 範例

```typescript
let myAdd: (x: number, y: number) => number = function(x: number, y: number): number{
  return x+y;
}
```

上述範例中輸入的參數可以定義類別，同時也宣告 `Function` 回傳的類別，並且有兩個相同的宣告類別，

但是做事在一開始就宣告完整的 `Function` 類別，那之後就可以省略

範例

```typescript
let myAdd = function(x: number, y: number): number{
  return x + y;
};

let myAdd2: (x: number, y: number) => number = function(x, y){return x + y;};
```

### Optional and Default Parameters

在 `TypeScript` 中指定每個參數不代表他們不能是 `null` 或是 `undefined`

```typescript
function buildName(firstName: string, lastName: string){
  return firstName + ' ' + lastName;
}

// let result1 = buildName("Bob");                  // error, too few parameters
// let result2 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
let result3 = buildName("Bob", "Adams");         // ah, just right
```

在 Javascript 中每一個 `Function` 都是非必要的，當你沒有輸入的時候值都會是 `undefined` 在 `TypeScript` 有宣告的都是必要的，但是也提供一個 `?` 來宣告非必要

```typescript
function buildName(firstName: string, lastName?: string){
  if (lastName){
    return firstName + " " + lastName;
  }else{
    return firstName;
  }
}
let result1 = buildName("Bob");                  // works correctly now
// let result2 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
let result3 = buildName("Bob", "Adams");         // ah, just right
```

`TypeScript` 非必要參數必須要在 必要參數的後面， `TypeScript` 也可以提供預設值的設定

範例

```typescript
function buildName(firstName: string, lastName = "Smith") {
    return firstName + " " + lastName;
}

let res1 = buildName("Bob");                  // works correctly now, returns "Bob Smith"
let res2 = buildName("Bob", undefined);       // still works, also returns "Bob Smith"
// let res3 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
let res4 = buildName("Bob", "Adams");         // ah, just right
```

上面的範例中可以看到，你可以先預設值給予預設值之後就不是必要參數，因為當你沒有輸入該參數的時候也會有預設輸入不會影響程式執行

### Rest Parameters

在 `ES6` 也有一種特性 [Rest](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Functions/rest_parameters)

而這個特性在 `TypeScript` 也可以應用在 `Function` 之中，當你不知道之後輸入的參數值總共有幾個，可以利用這個特性將所有後面輸入的參數值組合成一個陣列

```typescript
function buildName4(firstName: string, ...restOfName: string[]) {
  console.log(`firstName: ${firstName}`);
  console.log(`restOfName: ${restOfName}`);
  return firstName + " " + restOfName.join(" ");
}

let employeeName = buildName4("Joseph", "Samuel", "Lucas", "MacKinzie");
```

### this

```typescript
let deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    createCardPicker: function() {
        return function() {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();

alert("card: " + pickedCard.card + " of " + pickedCard.suit);
```

上述範例是可以編譯的，但是在執行的時候會有錯誤

因為在執行照 `createCadrPicker` 的時候會找不到 `suits` 這個 `Function` 因為這是 [this的作用域的問題](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/this)

因為對 Javascript 來說 `Function` 也是物件，所以在上述範例中的 `createCadrPicker` 中的 this 是指這個 `createCadrPicker` Function 本身，但是這個 Function 並沒有 `suits` 這個屬性，所以他會找到 `undefeind` 在後面 `this.suits[pickedSuit]` 的時候因為 `undefined` 在 Javascript 並不是物件，所以就會造成這個錯誤

所以我們可以把這個範例做一些修改

```typescript
let deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    createCardPicker: function() {
        // NOTE: the line below is now an arrow function, allowing us to capture 'this' right here
        return () => {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();

alert("card: " + pickedCard.card + " of " + pickedCard.suit);
```

其實我們做的修改只是將 `function(){}` 修改為 `() => {}` 但是因為在 Javascript 中的 [arrow function的特性](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Functions/Arrow_functions) 所以他找到的 `this` 是指 desk 這個物件，就可以指導 `suits` 這個屬性這個屬性

### this parameters

但是在上面範例中的 this 的型別依舊是 `any` 如果我們希望在 `Function` 定義 `this` 的型態就要將這個宣告放在 `Function` 的第一個參數

```typescript
function f(this: void){
  // ....
}
```

加上兩個 `interface`， `Card` 和 `Deck`

```typescript
interface Card{
  suit: string;
  card: number
}
interface Deck{
  suits: string[];
  cards: number[];
  createCardPicker(this: Deck): () => Card;
}

let deck: Deck = {
  suits: ["hearts", "spades", "clubs", "diamonds"],
  cards: Array(52),
  createCardPicker: function(this: Deck){
            return () => {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
  }
}
```

在 `interface` 中的 `createCardPicker` 有宣告了 this 的型態是 `Deck` 而不是 `any` 所以 `--noImplicitThis` 不會有錯誤

#### this parameters in callbacks

你在 `callback` 中使用 `this` 的話依舊會產生一些錯誤，因為 `this` 會是 `undefine` 你可以宣告一個 `interface` 來避免這種錯誤

```typescript
interface UIElement{
  addClickListener(onClick: (this: void, e: Event => void): void)
}
```

`this: void` 代表 `addClickListener` 預計 `onClick` 是一個 `Fucntion` 並沒有 `this` 的類別

```typescript
class Handler {
    info: string;
    onClickBad(this: Handler, e: Event) {
        // oops, used this here. using this callback would crash at runtime
        this.info = e.message;
    }
}
let h = new Handler();
uiElement.addClickListener(h.onClickBad); // error!
```

### Overloads

Javascript 是一個動態繼承的程式語言，一個函式藉由輸入值得到不同的回傳值是十分常見的

```typescript
let suits = ["hearts", "spades", "clubs", "diamonds"];

function pickCard(x): any {
  if (typeof x == "object") {
    let pickedCard = Math.floor(Math.random() * x.length);
    return pickedCard;
  } else if (typeof x == "number") {
    let pickedSuit = Math.floor(x / 13);
    return { suit: suits[pickedSuit], card: x % 13 };
  }
}

let myDeck = [
  { suit: "diamonds", card: 2 },
  { suit: "spades", card: 10 },
  { suit: "hearts", card: 4 }
];
let pickedCard01 = myDeck[pickCard(myDeck)];
console.log("card: " + pickedCard01.card + " of " + pickedCard01.suit);
console.log(`pickedCard01: ${JSON.stringify(pickedCard01)}`);
let pickedCard02 = pickCard(15);
console.log("card: " + pickedCard02.card + " of " + pickedCard02.suit);
console.log(`pickedCard02: ${JSON.stringify(pickedCard02)}`);
```

`pickCard` 會依據我們傳進去的參數不同，回傳不同的資訊這樣的話我們該如何去定義呢？

```typescript
let suits02 = ["hearts", "spades", "clubs", "diamonds"];

function pickCard1(x: { suit: string; card: number }[]): number;
function pickCard1(x: number): { suit: string; card: number };
function pickCard1(x): any {
  if (typeof x == "object") {
    let pickedCard = Math.floor(Math.random() * x.length);
    return pickedCard;
  } else if (typeof x == "number") {
    let pickedSuit = Math.floor(x / 13);
    return { suit: suits02[pickedSuit], card: x % 13 };
  }
}

let myDeck02 = [
  { suit: "diamonds", card: 2 },
  { suit: "spades", card: 10 },
  { suit: "hearts", card: 4 }
];
let pickedCard001 = myDeck02[pickCard1(myDeck02)];
console.log("card: " + pickedCard001.card + " of " + pickedCard001.suit);

let pickedCard002 = pickCard1(15);
console.log("card: " + pickedCard002.card + " of " + pickedCard002.suit);
```

為了要讓 `TypeScript` 編譯的時候能夠選擇正確的型態，會宣告兩個不同的 `PickCard1` 然後分別宣告不同的 parmeter 而產生的不同的 response，然後在最後真正宣告 `function pickCard1():any` 設定回傳值是 `any`
，之後再真正使用 `pickCard1` 的時候就會依據不同的 parmeter 檢查不同的形態和 response