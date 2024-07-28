---
title: Typescript-BasicType
author: TomasLin
date: 2017-10-31
categories: Javascript
tags:
  - Javascript
  - Typescript
  - Translate
---

# 翻譯來源

[Basic Type](https://www.typescriptlang.org/docs/handbook/basic-types.html)

# Introduction

為了要讓更清楚的使用 `TypeScript` 會從最基本的元件 `numbers`, `strings`, `structures`, `boolean`, `values` 這類的動作， `TypeScript` 支援宣告這類型的 types

## Boolean

宣告最基本的 true/false 在 `TypeScript` 中稱為 `boolean`

```typescript
let isDone: boolean = false;
```

## Number

和 Javascript 一樣，在 `TypeScript` 中預設的是浮點數，而這個類別統一為 `number` 也支援十六進制，十進制，八進制，以及 binary 

```typescript
let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;
```

## String

另外一種工程師常用的類型是字串，這種形態使用 `string` 來做宣告，在 `TypeScript` 中都允許使用單引號(') 或是 雙引號(") 來做字串的宣告

```typescript
let color: string = "blue";
color = 'red';
```

你也可以使用 `template strings`，宣告使用 backtick/backquote(`)

```typescript
let fullName: string = `Bob Bobbington`;
let age: number = 37;
let sentence: string = `Hello, my name is ${fullName};

I'll be ${age + 1} years old next month`;
```

這個 `template strings` 也可以寫成

```typescript
let sentence: string = "Hello, my name is " + fullName + ".\n\n" +
    "I'll be " + (age + 1) + " years old next month.";
```

## Array

`TypeString` 和 Javascirpt依樣允許你使用 Array， 宣告時使用 `[]` 來做類型宣告

```typescript
let list: number[] = [1,2,3];
let list2: Array<number> = [1,2,3];
```

## Tuple

`Tuple` 允許你宣告每一個參數的類型

```typescript
let x : [string, number];

x = ['hello', 10]; //OK
x = [10, 'hello']; //Error
```

好處就是當你明確的定義類型的時候，使用的時候就會有明確的錯誤訊息

```typescript
let x : [string, number];

x = ['hello', 10];
console.log(x[0].substr(1)); // OK
console.log(x[1].substr(1)); // Error, 'number' does not have 'substr'
x[3] = "world"; // OK, 'string' can be assigned to 'string | number'

console.log(x[5].toString()); // OK, 'string' and 'number' both have 'toString'

x[6] = true; // Error, 'boolean' isn't 'string | number'
```

## Enum

另外一種特別的型別事 `enum` 你可以定義哪些允許的類型列表

```typescript
enum Color {Red, Green, Blue}
let c: Color = Color.Green;
```

你也可以設定 `enum` 得值

```typescript
enum Color {
  Red = 1,
  Green,
  Blue
}
let colorName: string = Color[2];

console.log(colorName);
// Green
```

也可以直接定義 key值

```typescript
enum Color {
  Red = 1,
  Green = 2,
  Blue = 4
}
let colorName: string = Color[4];

console.log(colorName);
// Blue
```

## Any

我們要描述一個變數，但是在攥寫程式的當下不知道他的類型，這個值是屬於動態的內容，所以可以利用 `any` 來做宣告

```typescript
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false;
```

`any` 類型相當的彈性，你也許會期望 `object` 也會有一樣的情況，但是 `object` 並不允許你呼叫任意的函式，即使他真的存在

```typescript
let notSuer: any = 4;
notSure.ifItExists();
notSure.toFixed();

let prettySure: object = 4;
prettySure.toFixed(); //Error: 'toFixed' not exist on type 'Object'
```

## Void

`void` 有一點像 `any` ， 他並沒有任何類型，你可以在沒有回傳的函式中使用它

```typescript
function warnUser():void{
  alert('This is my warning message');
}
```

當你宣告變數為 `void` 的時候，你只能 assign `undefined` 或是 `null`

```typescript
let unsable: void = undefined;
```

## Null 和 Undefined

在 `TypeScript` 中 `undefined` 和 `null` 有他的類型就叫做 `undefined` 和 `null`

就像 `void` ，他們沒瞎小路用

```typescript
let u: undefined = undefined;
let n: null = null;
```

預設 `null` 和 `undefined` 是各種類型的亞類型，也就是你可以 assign `null` 或是 `undefined` 給 `number` 類型的變數

然而若是你在 `tsconfig.json` 中的選項 `strictNullChecks` 設定為 true 則 `null` 和 `undefined` 只能 assign 給 `void` 和他們的各自類型。

若是一個變數有多重可能，你也可以利用 `union`  類型 

```typescript
let notSure: string | null | undefined;
```

## Never

 `never` 類型代表永遠不會發生，例如你的函式確認永遠都不會回傳任何值，那麼你就可以利用 `never` 類型

 或是某一個變數永遠都是 false 你也可以設定他為 `never`

```typescript
 function error(message: string): never{
   throw new Error(message);
 }

 function fail(){
   return error("Something failed");
 }

 // Function returning never must have unreachable end point
function infiniteLoop(): never {
    while (true) {
    }
}
```
