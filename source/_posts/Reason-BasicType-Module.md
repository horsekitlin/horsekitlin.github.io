---
title: Reason-BasicType-Module
author: TomasLin
tags:
  - Javascript
  - IThome2018
  - Reason
categories:
  - Reason
date: 2018-10-27
---


# Module

模組就像是一個小的檔案

可以用 `let binding` 內嵌 module

## 建立

使用 `module` 這個關鍵字來宣告

```reason
module School = {
  type profession = Teacher | Director;

  let person1 = Teacher;
  let getProfession = (person) =>
    switch(person) {
    | Teacher => "A teacher"
    | Director => "A director"
    };
};
```

模組中的值(包含型別) 可以像 `record` 一樣使用 `.` 來存取

```reason
module School = {
  type profession = Teacher | Director;

  let person1 = Teacher;
  let getProfession = (person) =>
    switch(person) {
    | Teacher => "A teacher"
    | Director => "A director"
    };
};

let anotherPerson: School.profession = School.Teacher;
print_endline(School.getProfession(anotherPerson));
```

上面的範例中使用了 `School.profession` 的類型來宣告變數

巢狀的 `module` 也是一樣的使用方式

```reason
module Mymodule = {
  module NestedModule = {
    let message = "Hello";
  };
};

let message =  Mymodule.NestedModule.message;
print_endline(message);
```

## open Module

要一直前置加上模組名稱會很繁瑣

所以可以利用 `open` 來簡化

```reason
/* let p: School.profession = School.getProfession(School.person1); */
/*上述程式碼可以修改為*/
open School;
let p: profession = getProfession(person1);
```

**note: 要謹慎使用 open 最好在 local scope 中使用，否則會很難了解變數來源**

```reason
let p = {
  open School;
  print_endline("hello!");
  getProfession(person1);
};
```

## 擴充模組

使用 `include` 讓 module 靜態擴展到另一個新的模組

這句話很難理解吧！

看個範例

```reason
module BaseComponent = {
  let defaultGreeting = "Hello";
  let getAudience = (~excited) => excited ? "hello" : "world";
};

module ActualComponent = {
  include BaseComponent;
  let defaultGreeting = "Hey";
  let render = () => defaultGreeting ++ " " ++ getAudience(~excited=true);
};

print_endline(BaseComponent.defaultGreeting); /* Hello */
print_endline(ActualComponent.defaultGreeting); /* Hey */
```

上述範例中 `ActualComponent` 因為有 `include BaseComponent;`

所以會擁有 `BaseComponent` 的特性和方法

但是也可以在下面使用 `let` 來複寫某些參數或方法

**note: `open` 和 `include`是完全不一樣的 前者是將內容帶到你的 scope 你就不用每次都要加上模組名稱來取值，後者則是複製一份值到新的模組內**

在 `Reason` 中每一個檔案都是一個模組

```reason
/*FileA.re*/
let a = 1;
let b = 2;

/*FileB.re*/
include FileA;
print_endline(a);
```

### 標記式

模組的類型稱為 `signature`

模組的實作是 `re` 模組的宣告是 `rei`

要建立一個 signature 要使用關鍵字 `module type`

signature 名稱必須是大寫字母開頭

可以放置在 `rei` 檔案內

可以放在定義的 `{}` scope 內

```reason
module type EstablishmentType = {
  type profession;
  let getProfession: profession => string;
};
```

signature 宣告了 module 必須滿足的型態要求

使 module 和 signature 相同

形式如下:

* `let x: int;` 要求 `let` 繫結名稱必須是 `x`，型別是 `int`
* `type t = someType;` 要求型別欄位 `t` 必須與 `someType` 相同
* `type t;` 要求型別欄位 `t`，但並不強迫任何要求於 t 的實際、具體型別。 我們不能在標記式內使用 `t` 於其他項目來描述關係，例如 `let makePair: t => (t, t)` 

上述 `EstablishmentType` 範例中

* 宣告一個類型 `profession`
* 必須要有一個函式來取得 `profession` 的值

### 擴展 Module 類型

就像 Module 一樣

可以利用 include 來做擴展 module type

```reason
module type BaseComponent = {
  let defaultGreeting: string;
  let getAudience: (~excited: bool) => string;
};

module type ActualComponent = {
  /* the BaseComponent signature is copied over */
  include BaseComponent;
  let render: unit => string;
};
```

**note: BaseComponent是 module type 而不是 module**

如果你沒有宣告 module type

可以透過實際的 module 來提取 `include (module type of ActualModuleName)`

例如我們可以繼承 OCmal 中的公用模組 `List` 

```reason
module type MyList = {
  include (module type of List);
  let myListFun: list('a) => list('a);
};
```

### 每個 `rei` 都是一個標記式

類似 `.re` 定義 Reason 模組

`rei` 定義 Reason 模組類型

React.re 的標記式預設是暴露所有模組內欄位

因為沒有包含實作檔案

`.rei` 在生態圈也用來作為相對應模組的文件

紀錄開放的 API


`Module.re`
```reason
type state = int;
let render = (str) => str;
```

`Module.rei`
```reason
type state = int;
let render: string => string;
```

### 模組函式(functors)

模組可以包含函式

就像在檔案裡面寫函式

但是這還是有些不一樣

因為 module 定義在不同層級

所以我們稱之為 `functors`

* functors 使用關鍵字 `module` 而不是 `let`
* Functors 接受一個或多個模組作為參數並傳回一個模組
* Functors 必須大寫字母開頭（就像是模組/標記式）
* Functors 必須註解參數

```reason
module type Comparable = {
  type t;
  let equal: (t, t) => bool;
};

module MakeSet = (Item: Comparable) => {
  /* let's use a list as our naive backing data structure */
  type backingType = list(Item.t);
  let empty = [];
  let add = (currentSet: backingType, newItem: Item.t) : backingType =>
    if (ListLabels.exists((x) => Item.equal(x, newItem), currentSet)) {
      currentSet;
    } else {
      [
        newItem,
        ...currentSet /* prepend to the set and return it */
      ]
    };
};
```

上述是一個 `MakeSet` Functor

他接受一個 `Comparable` 類型的 module

會回傳一個包含此類型的新集合

Functor 也可以和函式一樣使用參數

如下例

```reason
module type Comparable = {
  type t;
  let equal: (t, t) => bool;
};

module MakeSet = (Item: Comparable) => {
  /* let's use a list as our naive backing data structure */
  type backingType = list(Item.t);
  let empty = [];
  let add = (currentSet: backingType, newItem: Item.t) : backingType =>
    if (ListLabels.exists((x) => Item.equal(x, newItem), currentSet)) {
      currentSet;
    } else {
      [
        newItem,
        ...currentSet /* prepend to the set and return it */
      ]
    };
};
module IntPair = {
  type t = (int, int);
  let equal = ((x1, y1), (x2, y2)) => x1 == x2 && y1 == y2;
  let create = (x, y) => (x, y);
};

module SetOfIntPairs = MakeSet(IntPair);
```

### 模組函式類別

Like with module types, functor types also act to constrain and hide what we may assume about functors. The syntax for functor types are consistent with those for function types, but with types capitalized to represent the signatures of modules the functor accepts as arguments and return values. In the previous example, we're exposing the backing type of a set; by giving MakeSet a functor signature, we can hide the underlying data structure!

**未翻譯**

```reason
module type Comparable = {
  type t;
  let equal: (t, t) => bool;
};

module type MakeSetType = (Item: Comparable) => {
  type backingType;
  let empty: backingType;
  let add: (backingType, Item.t) => backingType;
};

module MakeSet: MakeSetType = (Item: Comparable) => {
  /* let's use a list as our naive backing data structure */
  type backingType = list(Item.t);
  let empty = [];
  let add = (currentSet: backingType, newItem: Item.t) : backingType =>
    if (ListLabels.exists((x) => Item.equal(x, newItem), currentSet)) {
      currentSet;
    } else {
      [
        newItem,
        ...currentSet /* prepend to the set and return it */
      ]
    };
};

module IntPair = {
  type t = (int, int);
  let equal = ((x1, y1), (x2, y2)) => x1 == x2 && y1 == y2;
  let create = (x, y) => (x, y);
};

module SetOfIntPairs = MakeSet(IntPair);
```

## 結論

要小心的是 `module` 和 `functor` 在不同樣的語言層級

你無法輕易的將他們傳遞給 `record` 或 `tuple`

真的不得已的話一定要小心

因為很多時候只需要一個 `record` 或是 `function` 就夠了
