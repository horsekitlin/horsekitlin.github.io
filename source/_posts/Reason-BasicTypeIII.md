---
title: Reason-BasicTypeIII
author: TomasLin
tags:
  - Javascript
  - IThome2018
  - Reason
categories:
  - Reason
date: 2018-10-11
---

# Basic Type

今天討論的東西會也很多(每天啃到天荒地老)

* Reason - Record
* Reason - Object
* Reason - Destructuring

## Reason - Record

Reason - `Record` 很像 Javascript 的 Object

但是他有幾個特性

* 更輕量
* 預設是不可改變的 (Immutable)
* 欄位名稱和型別都是固定的
* 很快
* 是較嚴格的類別

### 基本使用

```reason
type person = {
  age: int,
  name: string
};

let tomas = {
  age: 35,
  name: "Tomas Lin"
};

let tomasName = tomas.name;
print_endline(tomasName); /* Tomas Lin */
```

### 需要明確的定義類型跟結構

Record 需要先宣告一個基本的結構 (Type)

否則會報錯

如果符合則會自動型別推導

```reason
type person = {
  age: int,
  name: string
};

let tomas: person = {
  age: 35,
  name: "Tomas Lin"
};

let tomasName = tomas.name;
print_endline(tomasName);
let simon = {
  age: 22,
  name: "Simon"
};
```

上面的範例中 `tomas` 有指定型別是 `person`

但是 `simon` 並未指定，可是因為他的結構和 `person` 一樣

所以 Reason 會自動做型別推導為 `person`

**note:若是有兩個同樣型別結構的話則會依據較近的型別**

你也可以將型別宣告在別的檔案中

但是需要明確的指定名稱

`AnimalType.re`
```reason
type cat = {color: string, call: string};
```

`Animal.re`
```reason
let whiteCat: AnimalType.cat = {
  color: "white",
  call: "喵!"
};

print_endline(whiteCat.call);
```

### Spread 修改 (immutable update)

因為 `Record` 是不可以直接修改的

可以利用 `Spread` 來做修改的實作

範例如下

```reason
type person = {
  age: int,
  name: string
};

let tomas: person = {
  age: 35,
  name: "Tomas Lin"
};

let tomasName = tomas.name;
print_endline(tomasName);
let simon = {
  age: 22,
  name: "Simon"
};

let tomasNextYear = {...tomas, age: tomas.age + 1};

Js.log(tomasNextYear.age);/* 36 */
```

**注意:Spread修改不能夠增加新的欄位**

### mutable update

`Reason` 也保有直接修改的彈性

範例如下:

```reason
type person = {
  age: int,
  mutable name: string
};

let tomas: person = {
  age: 25,
  name: "Tomas Lin"
};

let name = "Simon";

let simon = {
  age: 25,
  name
};

tomas.age = tomas.age + 1;

Js.log(tomas.age); /* 26 */
Js.log(simon.name); /* Simon */
```

也支援 `punning` 簡化程式碼

### 不能用 Record 處理的問題

 `Reason` 中你無法宣告一個 `function` 他的參數傳入一個物件
 
 這個物件中必要參數是 `age`

 而其他參數都是可以變動的

 範例如下

 ```reason
type person = {age: int, name: string};
type monster = {age: int, hasTentacles: bool};

let getAge = (entity) => entity.age;
let kraken = {age: 9999, hasTentacles: true};
let me = {age: 5, name: "Baby Reason"};

getAge(kraken);
getAge(me); 
  /* get Error:
    This has type:
      person
    But somewhere wanted:
      monster  */
 ```

Type system 不能定義一個類型是 `person` 或 `monster`

當你有這類型需求的話

接下來介紹的 `Reason - Object` 可以滿足

## Reason - Object

有些時候 `Reason - Record` 無法滿足一些特殊情境的需求

所以便有了 `Reason - Object` 增加一些彈性

### 型別

物件不一定要宣告型別

看起來和 `Reason - Record` 十分相似

除了 `.` 和 `..`

範例如下

```reason
type tesla = {
  .
  color: string
};
```

開頭 `.` 代表這是一個閉鎖的物件

任何基於這個型別的物件都必須完全符合結構

```reason
type car(`a) = {
  ..
  color: string
} as `a;
```

開頭 `..` 則代表這是開放型的物件，所以可以包含其他值或 `function`

開放型的物件代表是多型

所以需要一個參數

### Example

#### Simple

```reason
type tesla = {
  .
  color: string,
};

let obj: tesla = {
  val red = "Red";
  pub color = red;
};

Js.log(obj#color) /* "Red" */
```

在這個物件中含有兩個屬性

私有屬性 `red` 和 `color` method

因為 `color` 是一個公開的 method

所以我們可以利用 `object notation` 來標記取得值

**物件只導出Method，所有屬性都是Private的**

#### Advanced

```reason
type tesla = {.
  drive: (int) => int
};

let obj: tesla = {
  val hasEnvy = ref(false);
  pub drive = (speed) => {
    this#enableEnvy(true);
    speed;
  };
  pri enableEnvy = (envy) => hasEnvy := envy
};
```

在這個範例中 `tesla` 中一個公開的 `drive` 也有一個私有的 `enableEnvy` method

私有的 method 只可以在物件內部取用

Reason 也有 `this` 和 Javascript 的 `this` 不一樣的地方在於

Reason 的 `this` 永遠都會指向物件本身

#### 開放式物件的範例

```reason
type tesla('a) = {
  ..
  drive: int => int
} as 'a;

type teslaParams = {.
  drive: int => int,
  doYouWant: unit => bool
};

let obj: tesla(teslaParams) = {
  val hasEnvy = ref (false);
  pub drive = (speed) => {
    this#enableEnvy(true);
    speed;
  };
  pub doYouWant = () => hasEnvy^;
  pri enableEnvy = (envy) => hasEnvy := envy
};

Js.log(obj#doYouWant());
Js.log(obj#drive(11));
Js.log(obj#doYouWant());
```

上面的 `tesla` 中為開放型物件

但是需要有一個參數 `teslaParams` 定義所有開放的的 `method`

但是如果你要找由 `Javascript` 的物件，你需要的不是 `Reason - Object`

而是特別的 `BukleScript - Record` [special Record](https://bucklescript.github.io/docs/en/object.html#record-mode)

## Reason - Destructuring (解構)

解構是很清楚簡單的方式來取得物件或陣列中的變數

### 用法

下面綁定 `ten = 10` 和 `twenty = 20`

```reason
let someInts = (10, 20);
let (ten, twenty) = someInts;
Js.log(ten);
Js.log(twenty);
```

下列綁定變數 `name = "Guy"` 和 `age = 30`

```reason
type person = {name: string, age: int};
let somePerson: person = {name: "Tomas", age: 30};
let {name, age} = somePerson;
Js.log(name);
Js.log(age);
```

取回變數後可以重新命名 

```reason
type person = {name: string, age: int};
let somePerson: person = {name: "Tomas", age: 30};
let {name: n, age: a} = somePerson;
Js.log(n);
Js.log(a);
```

也可以定義型態

```reason
type person = {name: string, age: int};
let somePerson: person = {name: "Tomas", age: 30};
let {name: (n: string), age: (a: int)} = somePerson;
Js.log(n);
Js.log(a);
```

當然函式的標籤式參數也可以解構

```reason
type person = {
  name: string,
  age: int
};

let tomas = {name: "Tomas", age: 25};

let someFunction = (~person as {name}) => {
  Js.log(name);
};

let otherFunction = (~person as {name} as thePerson) => {
  Js.log(thePerson);
  Js.log(name);
};

someFunction(~person=tomas);
otherFunction(~person=tomas);
```

### Mutable

有時候我們會需要可以變更的變數

Reason 也有保留這部分的彈性

```reason
type total = ref(int);
let x: total = ref(5);
x := x^ + 1;
Js.log(x); // 6
```

`ref` 只是一個語法糖

透過 `:=` 修改

`^` 代表取出他的值

這樣就可以簡單地在 Reason 中使用 Mutation 的技巧
