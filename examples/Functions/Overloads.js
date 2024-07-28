var suits = ["hearts", "spades", "clubs", "diamonds"];
function pickCard(x) {
    if (typeof x == "object") {
        var pickedCard_1 = Math.floor(Math.random() * x.length);
        return pickedCard_1;
    }
    else if (typeof x == "number") {
        var pickedSuit = Math.floor(x / 13);
        return { suit: suits[pickedSuit], card: x % 13 };
    }
}
var myDeck = [
    { suit: "diamonds", card: 2 },
    { suit: "spades", card: 10 },
    { suit: "hearts", card: 4 }
];
var pickedCard01 = myDeck[pickCard(myDeck)];
console.log("card: " + pickedCard01.card + " of " + pickedCard01.suit);
console.log("pickedCard01: " + JSON.stringify(pickedCard01));
var pickedCard02 = pickCard(15);
console.log("card: " + pickedCard02.card + " of " + pickedCard02.suit);
console.log("pickedCard02: " + JSON.stringify(pickedCard02));
