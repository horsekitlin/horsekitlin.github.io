let suits02 = ["hearts", "spades", "clubs", "diamonds"];

function pickCard1(x: { suit: string; card: number }[]): number;
function pickCard1(x: number): { suit: string; card: number };
function pickCard1(x) {
  if (typeof x == "object") {
    let pickedCard = Math.floor(Math.random() * x.length);
    return pickedCard;
  } else if (typeof x == "number") {
    let pickedSuit = Math.floor(x / 13);
    return { suit: suits02[pickedSuit], card: x % 13 };
  }
}

let myDeck02 = [
  { suit: "diamonds", card: 2 },
  { suit: "spades", card: 10 },
  { suit: "hearts", card: 4 }
];
let pickedCard001 = myDeck02[pickCard1(myDeck02)];
console.log("card: " + pickedCard001.card + " of " + pickedCard001.suit);

let pickedCard002 = pickCard1(15);
console.log("card: " + pickedCard002.card + " of " + pickedCard002.suit);
