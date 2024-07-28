interface Card1 {
  suit: string;
  card: number;
}
interface Deck1 {
  suits: string[];
  cards: number[];
  createCardPicker(this: Deck1): () => Card1;
}

let deck1: Deck1 = {
  suits: ["hearts", "spades", "clubs", "diamonds"],
  cards: Array(52),
  createCardPicker: function(this: Deck1) {
    return () => {
      let pickedCard = Math.floor(Math.random() * 52);
      let pickedSuit = Math.floor(pickedCard / 13);

      return { suit: this.suits[pickedSuit], card: pickedCard % 13 };
    };
  }
};

let cardPicker1 = deck1.createCardPicker();
let pickedCard1 = cardPicker1();

console.log("card: " + pickedCard1.card + " of " + pickedCard1.suit);
