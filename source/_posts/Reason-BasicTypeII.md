---
title: Reason-BasicType Part-II
author: TomasLin
tags:
  - Javascript
  - IThome2018
  - Reason
categories:
  - Reason
date: 2018-10-10
---

# Basic Type

上一章節已經有討論了幾種基本類型

這是今天要了解的幾種型態

* Function
* Array
* Tuple
* List

## Function

`Function` 在日常 coding 是相當常見與重要的部分

`Reason` 中是以箭頭以及回傳表達式

以逗號隔開參數

```reason
let greet = (hello, name) => hello ++ " " ++ name;
Js.log(greet("Hello", "Tomas"));
```

### 無參數

有時候 `Function` 中不需要傳入參數

這裡稱為 `unit`

```reason
let sayHello = () => "Hello";
Js.log(sayHello()); /* Hello */
```

### 參數的標籤

```reason
let subNumber = (x, y) => {
  return x - y;
};

Js.log(subNumber(1, 2)); /* 1 */
```

這裡其實很難知道哪個是 `x`,  哪個是 `y`

我們可以加上 `~` 這樣的話會變成

```reason
let subNumber = (~x, ~y) => {
  return x - y;
};

Js.log(subNumber(~x=1, ~y=2));
```

也可以利用 `as` 加上別名

```reason
let drawCircle = (~radius as r, ~color as c) => {
  setColor(c);
  startAt(r, r);
  /* ... */
};

drawCircle(~radius=10, ~color="red");
```

事實上，(~radius) 只是 (~radius as radius) 的速寫法(稱之為 `雙關(punning)`)

### Optional 參數

```reason
let saySomeThing = (~name, ~title) => {
  switch title {
  | None => "Hello " ++ name;
  | Some(t_) => t_ ++ name;
  };
}

Js.log(saySomeThing(~name="Tomas"));
```

`title` 並不是一定要輸入的參數

如果為空預設值是 `None`

利用 `switch` 來涵蓋相對的 回傳值

## Tuple

在 `Javascript` 中並沒有 `Tuple` 的概念 而被整合在 `Array` 之中

`Reason` 中的 Tuple 需要符合幾種特性

* 不可變(immutable)
* 有順序性的
* 一開始就已經固定長度
* 允許包含不同的值

**tuple 長度不會是 1。若長度為 1 就是值本身。**

### Pair operations

官方提供 `fst` 和 `snd` 來快速取得 `Tuple`中第一 二個值

若是要取得其他更多的值，可以多多利用解構

```reason
type testTuple = (int, int, int);
let test: testTuple = (1, 2, 3);

let (_, second, _) = test;

Js.log(second);/* 2 */

/* Js.log(fst(test));  get compiler Error */
type test2Tuple = (int, int);
```

盡量在 **區域性** 使用 `Tuple`，若是有經常傳遞的需求則可以考慮使用 `record`

而且 `Tuple` + `Switch` 是十分強大的應用，可以解決 **category bug** 

因為 `Reason` 會強迫你列出 **2*2=4**的所有可能情況而不用使用 `if` `else` 來做處理

```reason
switch (isWindowOpen, isDoorOpen) {
| (true, true) => "window and door are open!"
| (true, false) => "just window open"
| (false, true) => "just door open"
| (false, false) => "window and door are not open"
}
```

但是總會有些時候必須要修改某個 `Tuple` 中的一個值

對 Reason 來說這就是一個新的 `Tuple` 範例如下:

```reason
let tuple1 = (1, 2);
let tuple2 = (fst(tuple1), 4);
Js.log(tuple2);
```

## List

### 特性

* 包含的參數需要同型態
* 不可變的(immutable)
* 在陣列前面 `shift` 元素會效率很好

```reason
let myList: list(int) = [1, 2, 3];
let anotherList = [0, ...myList];
```

`myList` 的值不會被改變， antherList現在是 `[0, 1, 2, 3]`

為什麼他的效能式常數而不是線性的?

因為在 `anotherList` 中的 `myList` 是 shared 的

**note:** 但是並不允許 `[0, ...aList, ...bList]`

你可以使用 `ListLabels.concat` 來實現

`Reason` 提供了一些基本的 [API](https://reasonml.github.io/api/List.html)

但是在使用的時候名稱是 `ListLabels`

```reason
let myList: list(int) = [1,2,3];
let anotherList = [0, ...myList];
Js.log(ListLabels.length(myList)); /* 3 */
Js.log(ListLabels.length(anotherList)); /* 4 */
```

### Switch

也可以搭配 `pattern matching`

```reason
let myList: list(int) = [1, 2];
let message = 
  switch (myList) {
  | [] => "This list is Empty"
  | [a, ...rest] => "a: " ++ string_of_int(a) ++ " rest.length is " ++ string_of_int(ListLabels.length(rest))
  };

Js.log(message); /* a: 1 rest.length is 1 */
```

## Array

### 特性

* 可變的
* 快速的任意存取和修改
* 原生固定長度 (Javascript 彈性長度)

前後需要使用 `[|` 和 `|]`

可以使用 [Array](https://reasonml.github.io/api/Array.html) 和 [ArrayLabels](https://reasonml.github.io/api/ArrayLabels.html) 而針對 JS compiler 也可以使用 [Js.Array](https://bucklescript.github.io/bucklescript/api/Js.Array.html) API

```reason
let arrayTest = [|"hello", "eeee", "yo"|];

Js.log(arrayTest[0]);

arrayTest[1] = "gggg";

Js.log(arrayTest[1]); /* gggg */
```

如果要編譯 `Javascript` Reason 中的 `Array` 可以直接對應 Javascript 的 `Array`

雖然在 Reason 中無法直接修改長度，可以利用 `Js.Array` 來修改

範例如下

```reason
let array1 = [|0,2,3,4,5,6|];
let array2 = Js.Array.copyWithin(~to_=3, array1);
Js.log(array1);/* [ 0, 2, 3, 0, 2, 3 ] */
Js.log(array2);/* [ 0, 2, 3, 0, 2, 3 ] */
let array3 = Js.Array.push(1, array1);
Js.log(array3);/* [ 0, 2, 3, 0, 2, 3, 1 ] */
```

陣列在一般寫程式過程中扮演相當重要的一個角色

篇幅會太多

明天再來聊聊另一種基本型到 `Record` 和 `Object`
