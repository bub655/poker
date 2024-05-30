export class Card {
	private suit: "Hearts" | "Diamonds" | "Clubs" | "Spades";
	private number: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

	public constructor(
		suit: "Hearts" | "Diamonds" | "Clubs" | "Spades",
		number: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13
	) {
		this.suit = suit;
		this.number = number;
	}

	public getNumber(): number {
		return this.number;
	}

	public getSuit(): "Hearts" | "Diamonds" | "Clubs" | "Spades" {
		return this.suit;
	}

	public toString(): string {
		if (this.number == 1) {
			return "Ace of " + this.suit;
		} else if (this.number == 11) {
			return "Jack of " + this.suit;
		} else if (this.number == 12) {
			return "Queen of " + this.suit;
		} else if (this.number == 13) {
			return "King of " + this.suit;
		}
		return this.number + " of " + this.suit;
	}
}
