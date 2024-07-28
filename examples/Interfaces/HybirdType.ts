interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

function getCounter(): Counter {
  let counter = <Counter>function(start: number) {};
  counter.interval = 123;
  counter.reset = function() {
    console.log("reset");
  };
  return counter;
}

let ctr = getCounter();
ctr(10);
ctr.reset();
ctr.interval = 5.0;
