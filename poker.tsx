import readline from "readline-sync";
import { Deck } from "./deck";
import { Card } from "./card";
import { Player } from "./player";

// Enum for Poker Hand Rankings
export enum HandRank {
	HIGH_CARD,
	PAIR,
	TWO_PAIR,
	THREE_OF_A_KIND,
	STRAIGHT,
	FLUSH,
	FULL_HOUSE,
	FOUR_OF_A_KIND,
	STRAIGHT_FLUSH,
}

export class Poker {
	private deck: Deck;
	private players: Player[] = [];
	private all_players: Player[] = [];
	private hands: string = "";
	private river: Card[] = [];

	public constructor(players: Player[], deck: Deck) {
		for (const player of players) {
			this.all_players.push(player);
		}
		this.players = players;
		for (const player of players) {
			this.hands += player.getId() + " " + player.getHandString + "\n";
		}
		this.deck = deck;
		for (let i = 0; i < 5; i++) {
			this.river.push(this.deck.drawCard());
		}
	}

	public checkBets(amountBets: any) {
		const initial_bet: Number = amountBets[this.players[0].getId() - 1];

		for (const player of this.players) {
			if (amountBets[player.getId() - 1] != initial_bet) {
				return false;
			}
		}

		return true;
	}

	public bet(): number {
		console.log("Ok! Time to get some money moving! \n");

		let roundPot = 0;

		let highestBet = 0;

		const amountsBet = this.players.map((player, index) => 0);
		var initial = true;
		while (!this.checkBets(amountsBet) || initial) {
			initial = false;
			let i = 0;
			while (i < this.players.length) {
				const player = this.players[i];
				const id = player.getId();
				const action = readline.question(
					`Player ${player.getId()}: Would you like to ${
						highestBet == 0 ? "check (c) or" : ""
					}, raise (r), ${
						highestBet != 0
							? `call (c) the bet of ${highestBet}, or fold (f)`
							: ""
					}? `
				);

				if (action == "r") {
					const bet = Number(
						readline.question(
							`Player ${id}: The current bet is ${highestBet}. You have ${player.getMoney()}. How much would you like to raise to? `
						)
					);

					player.subMoney(bet - amountsBet[id - 1]);

					roundPot += bet;
					highestBet = bet;

					amountsBet[id - 1] = bet;
				} else if (action == "c") {
					if (highestBet == 0) {
						if (this.players.length - 1 == i) {
							return roundPot;
						}
						i++;
						continue;
					} else {
						player.subMoney(highestBet - amountsBet[id - 1]);
						if (amountsBet[id - 1] < highestBet) {
							roundPot += highestBet - amountsBet[id - 1];
							amountsBet[id - 1] = highestBet;
						}
					}
				} else if (action == "f") {
					this.players.splice(i, 1);
					i--;
				}

				console.log("\nThe pot this round has reached:", roundPot);
				console.log("The highest bet is: ", highestBet, "\n");

				i++;
			}
		}

		return roundPot;
	}

	public playGame(): Player[] {
		var pot = 0;
		var river_str = "";
		//pre flop
		pot += this.bet();

		// 3 card river
		console.log();
		river_str = "";
		for (const i of this.river.slice(0, 3)) {
			river_str += i.toString() + "\n";
		}
		console.log("The river is:\n", river_str);
		console.log("The pot is: ", pot);
		pot += this.bet();

		// 4 card river
		console.log();
		river_str = "";
		for (const i of this.river.slice(0, 4)) {
			river_str += i.toString() + "\n";
		}
		console.log("The river is: \n", river_str);
		console.log("The pot is: ", pot);
		this.bet();

		console.log();
		// 5 card river
		river_str = "";
		for (const i of this.river.slice(0, 5)) {
			river_str += i.toString() + "\n";
		}
		console.log("The river is: \n", river_str);
		console.log("The pot is: ", pot);
		pot += this.bet();

		const winner = this.determineWinner(this.players, this.river);
		console.log(
			`\nThe winner is: ${winner.winner.getId()}\nHe had a hand of ${winner.winningHand.map(
				(card) => " " + card.toString()
			)}.\nThat's a ${
				HandRank[winner.winningHandRank]
			}!! He wins a pot of ${pot}`
		);
		const winnerId = winner.winner.getId();
		for (const player of this.all_players) {
			if (winnerId == player.getId()) {
				player.subMoney(-pot);
			}
			console.log(`Player ${player.getId()} has ${player.getMoney()} left`);
		}
		return this.all_players;
	}

	public dealCards() {
		this.deck = new Deck();
		for (const player of this.all_players) {
			const hand: [Card, Card] = [this.deck.drawCard(), this.deck.drawCard()];
			player.updateHand(hand);
		}
	}
	public getWinner(): number {
		return 0;
	}

	// Helper function to get all combinations of a specific length
	public getCombinations<T>(array: T[], length: number): T[][] {
		function combine(input: T[], len: number, start: number): T[][] {
			if (len === 0) return [[]];
			let result: T[][] = [];
			for (let i = start; i <= input.length - len; i++) {
				let head = input.slice(i, i + 1);
				let tailCombs = combine(input, len - 1, i + 1);
				for (let j = 0; j < tailCombs.length; j++) {
					result.push(head.concat(tailCombs[j]));
				}
			}
			return result;
		}
		return combine(array, length, 0);
	}

	// Function to evaluate and rank a poker hand
	public evaluateHand(hand: Card[]): [HandRank, Card[]] {
		hand.sort((a, b) => a.getNumber() - b.getNumber());

		const isFlush = hand.every((card) => card.getSuit() === hand[0].getSuit());
		const isStraight = hand.every(
			(card, index) =>
				index === 0 || card.getNumber() === hand[index - 1].getNumber() + 1
		);

		if (isFlush && isStraight) return [HandRank.STRAIGHT_FLUSH, hand];

		const counts = hand.reduce((acc, card) => {
			acc[card.getNumber()] = (acc[card.getNumber()] || 0) + 1;
			return acc;
		}, {} as { [key: number]: number });

		const values = Object.values(counts).sort((a, b) => b - a);

		if (values[0] === 4) return [HandRank.FOUR_OF_A_KIND, hand];
		if (values[0] === 3 && values[1] === 2) return [HandRank.FULL_HOUSE, hand];
		if (isFlush) return [HandRank.FLUSH, hand];
		if (isStraight) return [HandRank.STRAIGHT, hand];
		if (values[0] === 3) return [HandRank.THREE_OF_A_KIND, hand];
		if (values[0] === 2 && values[1] === 2) return [HandRank.TWO_PAIR, hand];
		if (values[0] === 2) return [HandRank.PAIR, hand];

		return [HandRank.HIGH_CARD, hand];
	}

	// Main function to determine the winner
	public determineWinner(
		players: Player[],
		river: Card[]
	): { winner: Player; winningHandRank: HandRank; winningHand: Card[] } {
		let bestHandRank: HandRank = HandRank.HIGH_CARD;
		let winningPlayer: Player | null = null;
		let winningHand: Card[] = [];

		for (let player of players) {
			let allCards = player.getHand().concat(river);
			let allCombinations = this.getCombinations(allCards, 5);
			let playerBestHandRank: HandRank = HandRank.HIGH_CARD;
			let playerBestHand: Card[] = [];

			for (let combination of allCombinations) {
				let [handRank, hand] = this.evaluateHand(combination);
				if (handRank > playerBestHandRank) {
					playerBestHandRank = handRank;
					playerBestHand = hand;
				}
			}

			if (
				winningPlayer === null ||
				playerBestHandRank > bestHandRank ||
				(playerBestHandRank === bestHandRank &&
					this.compareHands(playerBestHand, winningHand) > 0)
			) {
				bestHandRank = playerBestHandRank;
				winningPlayer = player;
				winningHand = playerBestHand;
			}
		}

		return {
			winner: winningPlayer!,
			winningHandRank: bestHandRank,
			winningHand: winningHand,
		};
	}

	// Helper function to compare two hands of the same rank
	public compareHands(hand1: Card[], hand2: Card[]): number {
		for (let i = hand1.length - 1; i >= 0; i--) {
			if (hand1[i].getNumber() > hand2[i].getNumber()) return 1;
			if (hand1[i].getNumber() < hand2[i].getNumber()) return -1;
		}
		return 0;
	}
}
