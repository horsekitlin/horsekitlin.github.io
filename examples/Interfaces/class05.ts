interface Shape {
  color: string;
}

interface PenStroke {
  penWidth: number;
}

interface Square extends Shape, PenStroke {
  sideLength: number;
}

let s = <Square>{};
s.color = "blue";
s.sideLength = 10;
s.penWidth = 5.0;
