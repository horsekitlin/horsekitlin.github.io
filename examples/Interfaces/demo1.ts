interface SquareConfig {
  color?: string;
  width?: number;
  [propName: string]: any;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  return {
    color: "black",
    area: 100
  };
}

let mySquare = createSquare({ colour: "red", width: 100 });
