---
title: BasicType-OptionsAndSomeAndNone
author: TomasLin
tags:
  - Javascript
  - IThome2018
  - Reason
  - BuckleScript
categories:
  - Reason
date: 2018-10-20
---

# Null 和 Undefined 和 Option

Reason 並沒有 `null` 和 `undefined` 的概念

這是很棒的事情，因為可以減少很多型態的 bugs

再也看不到 `undefined is not a function` 或是 `cannot access foo of undefined`

但是 這些值其實依舊存在但是在 Reason 可以安全的存在

因為是通過 Option 來表示值是否存在

```reason
type option('a) = None | Some('a);
```

這代表這個值得類型是 `None` (無) 或是實際值包含在 `Some` 中

## 範例

```reason
let personHasCar = false;

if(personHasCar) {
  Some(5);
} else {
  None;
}
```

如果要表示一個數可能會是 `None` 

但是可以利用另一種寫法

```reason

let licenseNumber = Some(5);

switch (licenseNumber) {
  | None => print_endline("The person doesn't have a car")
  | Some(number) =>
    print_endline("The person's license number is " ++ string_of_int(number))
  };
```

透過將數字串為選項

強迫您列舉出所有可能的選項和回應

杜絕錯誤處理或忘記處理的情況

## Option

Option 其實就是等於 `Some('a)` 或 `None`

這在 Javascript 中十分常見

### 警告1

```reason
let aaa = Some(Some(Some(5)))
```

這個依舊會被編譯為 `let aaa = 5;`

但是下面的狀況會比較麻煩

```reason
let bbb = Some(None);
```

上面那一行會被編譯為

```javascript
var bbb = Js_primitive.some(undefined);
```

什麼是 `Js_primitive` ?

怎麼不直接編譯為 `var bbb = undefined;` 這樣就好了？

在處理多種 `Option` 的型態的時候

如果沒有用一些特殊註解來標記這些值的話

很多操作上都會變得棘手

以下有幾個原則可以遵守

* 永遠不要內嵌 `Option` (Ex: `Some(Some(Some(5)))`)
* 不要指定 `Option('a)` 給來源是 Javascript 的值，給予準確的型態

### 警告2

但是很多時候在 Javascript 總是會有 `null` 或是未定義

在這種情況下我們無法輸入這種值

因為 `option` 只會檢查 `undefined` 而不會檢查 `null`

#### 解法: Js.Nullable

有提供 `Js.Nullable` 這個模組來檢查 `undefined` 和 `null`

 要建立 `undefined` 可以使用 `Js.Nullable.undefined` 

 當然你也可以使用 `None` 這並不衝突

 #### 範例

```reason
[@bs.module "MyIdValidator"] external myId: Js.Nullable.t(string) = "MyID";

[@bs.module "MyIdValidator"] external validate: Js.Nullable.t(string) => bool = "validate";

let personId: Js.Nullable.t(string) = Js.Nullable.return("abc123");

let result = validate(personId);
```

`Js.Nullable.return` 可以回傳的是一個允許他是 `null` 的字串

而不僅僅是單純的字串格式

`None` 和 `Js.Nullable` 是很重要的一部分

因為他補足了強形態中處理 `null` 和 `undefined` 的問題


## More on Type

型別是可以接受參數的

類似別種語言的(generics)

參數必須使用 `'` 開頭

```reason
type intCoordinates = (int, int, int);
type floatCoordinates = (float, float, float);

let buddy: intCoordinates = (10, 20, 20);
```

這是基本的使用方法

可以改為

```reason
type coordidate('a) = ('a, 'a, 'a);

type coordidateAlias = coordidate(int);

let buddy: coordidateAlias = (10, 20, 20);
```

其實型別會自動幫你推導

所以更簡潔的寫法是

```reason
let buddy = (10, 20, 20);
```

這時候會自動推導它為 `(int, int, int)` 型別

```reason
let greetings = ["hello", "world", "how are you"];
```

會自動推導為 `list(string)`

型別也可以接受多個參數

```reason
type result('a, 'b) =
  | Ok('a)
  | Error('b);
type myPayload = {data: string};

type myPayloadResults('errorType) = list(result(myPayload, 'errorType));

let payloadResults: myPayloadResults(string) = [
  Ok({data: "hi"}),
  Ok({data: "bye"}),
  Error("Something wrong happened!")
];
```

### 相互遞迴型別

```reason
type student = {taughtBy: teacher}
and teacher = {student: list(student)};
```

第一行沒有分號

第二行開頭沒有 `type`

## 設計決策

型別系統基本上允許階層

例如: `list(int)`

實際是 `list` 型別 中接受 `int` 型別

其他語言有的會稱之為泛型

遵循 [The principle of least power](https://en.wikipedia.org/wiki/Rule_of_least_power)原則

在解決方法中選擇最不複雜的一個來使用

