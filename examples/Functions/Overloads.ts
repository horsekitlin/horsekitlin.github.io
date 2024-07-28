let suits = ["hearts", "spades", "clubs", "diamonds"];

function pickCard(x): any {
  if (typeof x == "object") {
    let pickedCard = Math.floor(Math.random() * x.length);
    return pickedCard;
  } else if (typeof x == "number") {
    let pickedSuit = Math.floor(x / 13);
    return { suit: suits[pickedSuit], card: x % 13 };
  }
}

let myDeck = [
  { suit: "diamonds", card: 2 },
  { suit: "spades", card: 10 },
  { suit: "hearts", card: 4 }
];
let pickedCard01 = myDeck[pickCard(myDeck)];
console.log("card: " + pickedCard01.card + " of " + pickedCard01.suit);
console.log(`pickedCard01: ${JSON.stringify(pickedCard01)}`);
let pickedCard02 = pickCard(15);
console.log("card: " + pickedCard02.card + " of " + pickedCard02.suit);
console.log(`pickedCard02: ${JSON.stringify(pickedCard02)}`);
