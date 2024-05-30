import readline from "readline-sync";
import { Card } from "./card";

export class Player {
	private hand: [Card, Card];
	private id: number;
	private money: number;

	public constructor(hand: [Card, Card], id: number) {
		this.hand = hand;
		this.id = id;
		this.money = 1000;
	}

	public getId(): number {
		return this.id;
	}

	public getMoney(): number {
		return this.money;
	}

	// public updateMoney(money: number) {
	//   this.money = money
	// }

	public getHand(): [Card, Card] {
		return this.hand;
	}

	public getHandString(): string {
		return this.hand[0] + " and " + this.hand[1];
	}

	public toString(): string {
		return "Player " + this.id;
	}

	public showHand(): void {
		console.log(
			`Ok, here's Player ${this.getId()}'s cards. Let's keep it secret so hit enter when you are ready to see your cards.`
		);
		readline.question(`Player ${this.getId()}'s cards:`);
		readline.question(
			`${this.hand[0].toString()}, ${this.hand[1].toString()}\n\nHit enter again to clear and move onto the next player`
		);

		const lines = process.stdout.getWindowSize()[1];
		for (var i = 0; i < lines; i++) {
			console.log("\r\n");
		}
	}

	public subMoney(amount: number): void {
		this.money -= amount;
	}

	public updateHand(hand: [Card, Card]) {
		this.hand = hand;
	}
}
