function myCoolFunction(f: (x: number) => void, nums: number[]): void;
function myCoolFunction(f: (x: number) => void, ...nums: number[]): void;

function myCoolFunction() {
  if (arguments.length == 2 && Array.isArray(arguments[1])) {
    var f = arguments[0];
    var arr = arguments[1];

    arr.map(value => f(value));
  } else {
    var f = arguments[0];
    var arr = arguments[1];
    console.log("arguments: ", arguments);
  }
}

myCoolFunction(
  function(x) {
    console.log(x);
  },
  [1, 2, 3, 4]
);
myCoolFunction(
  function(x) {
    console.log(x);
  },
  1,
  2,
  3,
  4
);
