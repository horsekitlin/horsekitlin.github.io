---
title: TypeScript-TypeScriptIn5Minutes
author: TomasLin
date: 2017-10-27
categories: Javascript
tags:
  - Javascript
  - Typescript
  - Translate
---

# 翻譯來源

[TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

# TypeScript in 5 minutes

使用 `TypeScript` 建立第一個簡單的 網頁應用

## Installing TypeScript

有兩個主要的安裝方式

  * 使用 [NPM](https://docs.npmjs.com/cli/install) 安裝
  * 安裝 [Visual Studio plugins]

### Visual Studio

Visual Studio 2017 和 Visual Studio 2015 預設已經有使用 `TypeScript` ，但若是你不希望安裝 Visual Studio 你也可以安裝 [TypeScript](https://www.typescriptlang.org/#download-links)

### NPM

```
  $ npm install -g typescript
```

#### 建立你的第一個 TypeScript 檔案

greeter.ts

```typescript
function greeter(person) {
  return "Hello, " + person;
}

var user = "Jane User";

document.body.innerHTML = greeter(user);
```

#### Compiling your code

```
  $ tsc greeter.ts
```

經過編譯，你會多了一個 `greeter.js` 的 Javascript 檔案

而這個檔案可以在前端或 Nodejs 中使用

接下來我們要開始接下來我們要開始嘗試 `TypeScript` 的幾個功能

就是先在 Function greeter 中的 `person` 這個參數加上類別的識別

```typescript
function greeter(person: string) {
  return "Hello, " + person;
}
// var user = "Jane User";
var user = [0, 1, 2];

document.body.innerHTML = greeter(user);
```

當編譯的時候就會看到一個錯誤

```
greeter.ts(7,35): error TS2345: Argument of type 'number[]' is not assignable to parameter of type 'string'.
```

同樣的若是你使用 `Function greeter` 的時候移除了參數

```typescript
function greeter(person: string) {
  return "Hello, " + person;
}

document.body.innerHTML = greeter();
```

你也會得到一個錯誤訊息

```
greeter.ts(7,27): error TS2554: Expected 1 arguments, but got 0.
```

`TypeScript` 會協助分析你的程式並且提醒你還需要提供相關的資訊

雖然這些錯誤訊息提醒，但是你的 `greeter.js` 仍然會產生 `TypeScript` 僅僅會警告你這些程式碼執行會得到不是你的預期結果

#### interfaces

然後我們可以進一步的開發我們的範例，我們增加一個 `interface` 他描述了一個物件擁有兩個欄位 `firstName` 和
`lastName` 

在 `TypeScript` 中容許一個結構內擁有兩種類型只需要描述物件的輪廓

而不需要過於明確的解釋物件的值

```typescript
interface Person {
  firstName: string;
  lastName: string;
}

function greeter(person: Person) {
  return "Hello, " + person;
}

var user = { firstName: "Jane", lastName: "User" };

document.body.innerHTML = greeter(user);
```

#### Classes

最後我在做一些延伸

`TypeScript` 支援 Javascript 使用 `class-based object-oriented programming`

[Javascipt 的物件導向設計](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript)

我們再多建立一個 `Student` 的 class 中擁有 constructor 和一些 public 的欄位

讓 classes 和 interface 可以很好的共同使用，並且讓開發者可以選擇正確的抽象化他的程式碼

```
constuctor 是一個簡潔並且方便我們建立 object 的參數 的函式
```

```typescript
class Student {
  fullName: string;
  constructor(
    public firstName: string,
    public middleInitial: string,
    public lastName: string
  ) {
    this.fullName = firstName + " " + middleInitial + " " + lastName;
  }
}

interface Person {
  firstName: string;
  lastName: string;
}

function greeter(person: Person) {
  return "Hello, " + person.firstName + " " + person.lastName;
}

var user = new Student("Jane", "M.", "User");

document.body.innerHTML = greeter(user);
```

```command
  $ tsc greeter.ts
```

然後你可以建立一個 greeter.html

```html
<!DOCTYPE html>
<html>
    <head><title>TypeScript Greeter</title></head>
    <body>
        <script src="greeter.js"></script>
    </body>
</html>
```

然後使用瀏覽器開啟這個 HTML 檔案 就可以看到相關的結果