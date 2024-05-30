import { Card } from "./card";

export class Deck {
	private deck: Card[];

	constructor() {
		const newDeck: Card[] = [];

		const suits: Array<"Hearts" | "Diamonds" | "Clubs" | "Spades"> = [
			"Hearts",
			"Diamonds",
			"Clubs",
			"Spades",
		];
		const numbers: Array<
			1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13
		> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

		for (const suit of suits) {
			for (const number of numbers) {
				newDeck.push(new Card(suit, number));
			}
		}

		for (var i = newDeck.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp: any = newDeck[i];
			newDeck[i] = newDeck[j];
			newDeck[j] = temp;
		}

		this.deck = newDeck;
	}

	public drawCard(): Card {
		return this.deck.pop()!;
	}
}
