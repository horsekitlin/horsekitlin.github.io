var Greeter = /** @class */ (function () {
    function Greeter() {
    }
    Greeter.prototype.greet = function () {
        if (this.greeting) {
            return "Hello, " + this.greeting;
        }
        else {
            return Greeter.standardGreeting;
        }
    };
    Greeter.standardGreeting = "Hello, there";
    return Greeter;
}());
var greeter1;
greeter1 = new Greeter();
console.log(greeter1.greet());
var greeterMaker = Greeter;
var greeter2 = new greeterMaker();
console.log(greeter2.greet());
console.log(greeter1.greet());
greeterMaker.standardGreeting = "Hey there!";
console.log(greeter2.greet());
console.log(greeter1.greet());
