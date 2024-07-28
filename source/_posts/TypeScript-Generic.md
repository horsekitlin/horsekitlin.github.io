---
title: TypeScript-Generic
author: TomasLin
categories: Javascript
tags:
  - Javascript
  - Typescript
  - Translate
date: 2017-11-06
---

# 泛型

## 泛型的 Hello world

```typescript
function identity(arg: number): number {
    return arg;
}
```

或是我們用 `any` 來宣告型態

```typescript
function identity(arg: any): any {
    return arg;
}
```

使用 `any` 導致這個函式可以接受任何類型的 arg 參數，但是這樣會錯失一些訊息

我們需要一種方式讓 input 和 output 類型是一樣的

```typescript
function identity<T>(arg: T): T{
  return arg;
}
```

藉由前面輸入的 T 協助接到 input 也希望和 response 是相同的，是相同的

```typescript
function identity<T>(arg: T): T{
  return arg;
}

let output = identity<string>("Mystring");
```

### 使用泛型變量

若是我們希望取回 arg 的長度但是並沒有指明 arg 具有 `.length` 這個屬性，
因為這個變量是任意類型，所以傳入的可能是字串或數字

那就沒有 `length` 這個屬性，我們可以先宣告陣列

```typescript
function loggingIdentity<T>(arg: T[]): T[]{
  console.log(arg.length);
  return arg;
}
```

現在 `loggingIdentity` 的輸入直是包含了 `T` 屬性的陣列，回傳的也是包含了 `T` 的陣列

也可以改寫成為

```typescript
function loggingIdentity<T>(arg: Array<T>): Array<T> {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}
```

## 泛型 class

在函式忠宣告泛型的方式如下

```typescript
function identity<T>(arg: T): T{
  return arg;
}

let myIdentity: <T>(arg: T) => T = identity;
```

也可以使用不同的名稱宣告，只要變數的數量吻合就可以了

```typescript
function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: <U>(arg: U) => U = identity;
```

也可以利用 `signature` 物件的方式來做宣告

```typescript
function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: {<T>(arg: T): T} = identity;
```

上述範例可以利用 `interface` 來做宣告

```typescript
interface GenericIdentityFn{
  <T>(arg: <T>): T;
}
function identity<T>(arg: T): T{
  return arg;
}

let myIdentity: GenericIdentityFn = identity;
```

藉由上述範例使用泛型來做宣告的話，就可以把這個參數的型態作為函式的輸入值

例如: Dictionary<string>而不是單純的 Dictionary

```typescript
interface GenericIdentityFn<T> {
    (arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
```

## 泛型類別

泛型類別和泛型宣告方式是一樣的，利用 `<>` 在 class 後面

```typescript
class GenericNumber<T>{
  zeroValue: T;
  add: (x: T, y: T) => T;
}

et myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```

`GenericNumber` 很片面的 class，沒什麼去限制他使用 `number` 你可以使用字串或其他更複雜的物件

```typescript
let stringNumeric = new GenericNumber<string>();
stringNumeric.zeroValue = "";
stringNumeric.add = function(x, y) { return x + y; };

alert(stringNumeric.add(stringNumeric.zeroValue, "test"));
```

就像 `interface` 一樣，泛型類別只是確認你使用的是同一個型態，而什麼型態則不是他們限制的

在之前 [類別](./Typescript-Classes.md)中有提到，類別有分兩個部分 靜態與實例層，泛型類別只負責實例層

靜態層不能使用 泛型類別

## Generic Constraints

之前有一個簡單的範例，如果我們傳入的類別沒有 `length` 這個屬性就會報錯

```typescript
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}
```

我們不希望使用 `any` 來做檢查，因為這樣會沒有任何錯誤訊息，希望在傳入的屬性中一定要有一個 `length`

為了達到這個目的，我們宣告一個 `interface` 裡面有 `length` 的屬性，然後繼承他的屬性

```typescript
interface Lengthwise{
  length: number;
}

function logginIdentity<T extends Lengthwise>(arg: T): T{
  console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
}

// loggingIdentity(3);  // Error, number doesn't have a .length property
loggingIdentity({length: 10, value: 3});
```
這時候他就不是 `any` 參數，而是必須擁有 `length` 這個屬性
