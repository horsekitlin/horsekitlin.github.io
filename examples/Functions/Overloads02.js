var suits02 = ["hearts", "spades", "clubs", "diamonds"];
function pickCard1(x) {
    if (typeof x == "object") {
        var pickedCard_1 = Math.floor(Math.random() * x.length);
        return pickedCard_1;
    }
    else if (typeof x == "number") {
        var pickedSuit = Math.floor(x / 13);
        return { suit: suits02[pickedSuit], card: x % 13 };
    }
}
var myDeck02 = [
    { suit: "diamonds", card: 2 },
    { suit: "spades", card: 10 },
    { suit: "hearts", card: 4 }
];
var pickedCard001 = myDeck02[pickCard1(myDeck02)];
console.log("card: " + pickedCard001.card + " of " + pickedCard001.suit);
var pickedCard002 = pickCard1(15);
console.log("card: " + pickedCard002.card + " of " + pickedCard002.suit);
