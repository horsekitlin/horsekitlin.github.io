---
title: Typescript-Classes
author: TomasLin
date: 2017-11-04
categories: Javascript
tags:
  - Javascript
  - Typescript
  - Translate
---

# Classes

傳統的 Javascript 使用 function 加上 `protyotype-based` 來繼承建立元件，但是這樣的機制對程式開發者習慣 `Object-oriented` 的感覺很尷尬， `ECMAScript 2015` 與 `ECMAScript6` 中允許開發者使用 `object-oriented class-based approach`

## Basic Classes

最基本的 class-based 範例

```typescript
class Greeter{
  greeting: string;
  constructor(messaage: string){
    this.greeting = message;
  }
  greet(){
    return "Hello, " + this.greeting;
  }
}

let greeter = new Greeter("world");
```

這樣的程式對 C# 或是 Java 的開發者應該會比較親切，

宣告了一個新的 class `Greeter`，這個 class 中有一個屬性是 `greeting` constructor 和 `greet`

看到有一個關鍵字 `this.` 之後可以呼叫這個 class 的屬性

## 繼承

在 `TypeScript` 中可以直接使用 `object-oriented patterns`，當然也可以建立一個 class 做繼承的動作，

範例 

```typescript
class Animnal {
  name: string;
  constructor(theName: string) {
    this.name = theName;
  }
  move(distanceInMeters: number = 0) {
    console.log(`${this.name} moved ${distanceInMeters}`);
  }
}

class Snake extends Animnal {
  constructor(name: string) {
    super(name);
  }
  move(distanceInMeters = 5) {
    console.log("Slithering...");
    super.move(distanceInMeters);
  }
}

class Horse extends Animnal {
  constructor(name: string) {
    super(name);
  }
  move(distanceInMeters = 45) {
    console.log("Galloping...");
    super.move(distanceInMeters);
  }
}

let sam = new Snake("Sammy the Python");
let tom: Animnal = new Horse("Tommy the Palomino");

sam.move();
tom.move(34);
```

上述範例中以 `extends` 這個關鍵字來建立一個子類， `Horse` 和 `Snake` 是繼承在 class `Animal` 之下的子類

在子類中的 constructor 必須使用 `super()` 這將會執行父類的 constructor 

這個範例也示範了如何覆寫父類的 `Function` 在 `Snake` 和 `Horse` 都有建立一個 `move` 的 `Function` 來覆寫過 `Animal` 的 `move` 執行結果後如下

```
Slithering...
Sammy the Python moved 5m.
Galloping...
Tommy the Palomino moved 34m.
```

## Public, private 和 protected modifiers

### public by default

在我們的範例中可以自由地宣告屬性，但在其他語言(C#) 需要使用 `public` 這個關鍵字來規範屬性是不是可以被瀏覽

但是在 `TypeScript` 中 `public` 是預設值

但是你也可以使用 `public` 來宣告屬性

```typescript
class Animal{
  public name: string;
  public constructor(theName: string){
    this.name = theName;
  }
  public move(distanceInMeters: number){
    console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}
```

### 了解 private

當某個屬性使用 `private` 來宣告，他不能來宣告，他不能被直接呼叫

```typescript
class Animal{
  private name: string;
  constructor(theName: string) { this.name = theName; }
}

new Animal("Cat").name; // Error: 'name' is private
```

`TypeScript` 是一個結構型態系統，我們比較兩種不同的類別，不論他們是如何產生的

只要他們的所有屬性沒有衝突，我們就可以稱這兩個類別是相容的

```typescript
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

class Rhino extends Animal {
    constructor() { super("Rhino"); }
}

class Employee {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}


let animal = new Animal("Goat");
let rhino = new Rhino();
let employee = new Employee("Bob");

animal = rhino;
animal = employee; // Error: 'Animal' and 'Employee' are not compatible
```

然而當兩個類別在比較的時候如果擁有 `private` 和 `protected` 屬性, 除非他們所這個 `private` 和 `protected` 繼承的是同一個父類別才會是兼容的，否則在形態上兩個都會是不同的

```typescript
class Animal{
  private name: string;
  constructor(theName: string){
    thie.name = theName;
  }
}

class Rhino extends Animal{
  constructor(){
    super("Rhino");
  }
}

class Employee{
  private name: string;
  constructor(theName: string){
    this.name = theName;
  }
}

let animal = new Animal("Goat");
let rhino = new Rhino();
let employee = Employee("Bob");

animal = rhino;
animal = employee; // Error: 'Animal' and 'Employee' are not compatible
```

在這個範例中我們有 `Animal` 和 `Rhino` 兩個 class， `Rhino` 是 `Animal` 的子類別

另外也有一個 `Employee` 他看起來和 `Animal` 十分相似，都有一個 `private name: string`

因為 `Rhino` 是繼承 `Animal` 所以 `Animal` 實體化後可以 assign 給 `Rhino` 的實體並不衝突

代表他們是相容的，而 `Employee` 即使有一樣的 `private name: string` 但是卻無法相容，

因為他們並不是在同一個父類的類別

### 了解 protected

`protected` 和 `private` 很相似，只是當你宣告為 `protected` 

```typescript
class Person {
  protected name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class Employee extends Person {
  private department: string;
  constructor(name: string, department: string) {
    super(name);
    this.department = department;
  }

  public getElevatorPitch() {
    return `Hello, my name is ${this.name} and I work in ${this.department}.`;
  }
}

let howard = new Employee("Howard", "Sales");
console.log(howard.getElevatorPitch());
// console.log(howard.name); // error
```

我們沒辦法直接呼叫 `name` 但是可以透過 `Employee` instance method 來使用，因為 `Employee` 繼承自 `Person`

我們也可以將 `constructor` 宣告為 `protected` 這代表這個 class 只能用來繼承，而無法直接產生 instance

```typescript
class Person {
  protected name: string;
  protected constructor(theName: string) {
    this.name = theName;
  }
}

// Employee can extend Person
class Employee extends Person {
  private department: string;

  constructor(name: string, department: string) {
    super(name);
    this.department = department;
  }

  public getElevatorPitch() {
    return `Hello, my name is ${this.name} and I work in ${this.department}.`;
  }
}

let howard = new Employee("Howard", "Sales");
//let john = new Person("John"); // Error: The 'Person' constructor is protected
```

## Readonly modifier

你可以宣告某些參數或變數是 `readonly` 使用 `readonly` 這個關鍵字來宣告，但是必須在初始化或是在 constructor 的時候進行宣告

```typescript
class Octopus{
  readonly name: string;
  readonly numberOfLegs: number = 8;
  constructor(theName: string){
    this.name = theName;
  }
}

let dad = new Octopus('Man with the 8 strong legs');
//dad.name = "Man with the 3-piece suit"; // error! name is readonly.
```

## Accessors

`TypeScript` 支援 getters/setters 去對 `Object` 中的屬性進行取值或是修改

```typescript
class Employee{
  fulllName: string;
}

let employee = new Employee();
employee.fullName = 'Bob Smith';
if(employee.fullName){
  console.log(employee.fullName);
}
```

我們希望使用者是有足夠的安全性，所以使用 `private` 宣告 `fullName` 然後允許使用 `set` 來對 `fullName` 來做修改

```typescript
let passcode = 'secret passcode';
class Employee{
  private _fulllName: string;

  get fullName(): string{
    return this._fullName;
  }

  set fullName(newName: string){
    if(passcode && passcode === 'secret passcode'){
      this._fulllName = newName;
    }else{
      console.log("Error: Unauthorized update of employee!");
    }
  }
}

let employee = new Employee();
employee.fullName = "Bob Smith";
if (employee.fullName) {
    console.log(employee.fullName);
}
```

command line

```
  $ tsc -t ES5 ./Accessors.ts
```

有兩點需要注意

* 因為必須要指定 `ECMAScript 5` 以上才可以使用 `Accessors`
* 如果你只有設定 `get` 而沒有設定 `set` 代表這個屬性是 `readonly`

## Static Properties

在這個部分我們討論的是實體的屬性，也是靜態屬性，實體的屬性，也是靜態屬性，這個屬性只能在 class 中取得，而無法被繼承

```typescript
class Grid {
  static origin = { x: 0, y: 0 };
  calculateDistanceFromOrigin(point: { x: number; y: number }) {
    let xDist = point.x - Grid.origin.x;
    let yDist = point.y - Grid.origin.y;
    return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
  }
  constructor(public scale: number) {}
}

let grid1 = new Grid(1.0); // 1x scale
let grid2 = new Grid(5.0); // 5x scale

console.log(grid1.calculateDistanceFromOrigin({ x: 10, y: 10 }));
console.log(grid2.calculateDistanceFromOrigin({ x: 10, y: 10 }));
```

## 抽象類別

抽象類別就像之前的類別一樣，也許不需要實體化，使用 `abstract` 關鍵字來宣告抽象類別與抽象函式

```typescript
abstract class Animal{
  abstract makeSound(): void;
  move(): void{
    console.log("roaming the earth..");
  }
}
```

`abstract` 中的函式並不會並不會包含在實體，也一定會使用 `abstract` 關鍵字來做宣告定義

```typescript
abstract class Department{
  constructor(public name: string){
  }
  printName():void{
    console.log("Department name: " + this.name);
  }

  abstract printMeeting():void;
}

class AccountingDepartment extends Department{
  constructor(){
    super("Accounting and Auditing");
  }

  printMeeting():void{
    console.log("The Accounting Department meets each Monday at 10am.");
  }

  generateReports():void{
    console.log("Generating accounting reports...");
  }
}

let department: Department; // ok to create a reference to an abstract type
// department = new Department(); // error: cannot create an instance of an abstract class
department = new AccountingDepartment(); // ok to create and assign a non-abstract subclass
department.printName();
department.printMeeting();
// department.generateReports(); // error: method doesn't exist on declared abstract type
```

抽象類別無法直接使用 `new` 產生物件，若是在抽象類別中並沒有宣告的類別與屬性，其子類別即使寫了也無法使用

## Advanced Techniques

### constructor function

在 `TypeScript` 中宣告一個 class 的時候，其實你已經同時執行了多個宣告

```typescript
class Greeter {
  greeting: string;
  constructor(message: string){
    this.greeting=  message;
  }
  greet(){
    return "Hello, " + this.greeting;
  }
}


let greeter: Greeter;
greeter = new Greeter("world");
console.log(greeter.greet());
```

上述範例中當 `let greeter: Greeter` 我們將會使用 `Greeter` 類別的 `instance` 賦予 class `Greeter`

當我們使用 `new` 這個關鍵字來實體化的時候，便會執行 constructor 轉譯之後的結果如下

```javascript
let Greeter = (function () {
    function Greeter(message) {
        this.greeting = message;
    }
    Greeter.prototype.greet = function () {
        return "Hello, " + this.greeting;
    };
    return Greeter;
})();

let greeter;
greeter = new Greeter("world");
console.log(greeter.greet());
```

在 `let Greeter` 就會準備指定給 constructor，而看到接下來的 `new` 關鍵字並且開始執行 constructor 就會取得一個藉由 `Gretter` 這個函式實體化的一個結果

在修改一下上面的範例

```typescript
class Greeter {
  static standardGreeting = "Hello, there";
  greeting: string;
  greet() {
    if (this.greeting) {
      return "Hello, " + this.greeting;
    } else {
      return Greeter.standardGreeting;
    }
  }
}

let greeter1: Greeter;
greeter1 = new Greeter();
console.log(greeter1.greet());

let greeterMaker: typeof Greeter = Greeter;

let greeter2: Greeter = new greeterMaker();
console.log(greeter2.greet());
console.log(greeter1.greet());
greeterMaker.standardGreeting = "Hey there!";

console.log(greeter2.greet());
console.log(greeter1.greet());
```

在這個範例中我們在 `Greeter` 宣告了一個靜態的屬性 `standardGreeting`並且給予值 `Hello, there`

第一步驟跟之前的範例一樣，利用 `Greeter` 產生了一個物件是 `greeter1` 然後將他的類別 assign 給 `greeterMaker` 並且修改了他的 `standardGreeting` 為 `Hey there!` 之後再由 `greeterMaker` 產生一個 greeter2 當它的 `greet()` 執行的時候產生的字串卻是 `Hey there!` 而且此時我再次執行 `greeter1.greet()` 的時候得到的卻也是 `Hey there!` 

也就是當我們 可以利用 這樣的方式統一管理一個靜態屬性也會互相繼承靜態屬性