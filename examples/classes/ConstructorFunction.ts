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
