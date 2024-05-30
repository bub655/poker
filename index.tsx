import readline from "readline-sync";
import { Deck } from "./deck";
import { Card } from "./card";
import { Player } from "./player";
import { Poker, HandRank } from "./poker";

console.log("Let's Play Poker!!!");

const deck = new Deck();
const nplayers = Number(readline.question("How many people are playing? "));
console.log("");

const initialPlayers: Player[] = [];

for (let i = 1; i < nplayers + 1; i++) {
	// generate player
	const hand: [Card, Card] = [deck.drawCard(), deck.drawCard()];
	const tmp = new Player(hand, i);

	initialPlayers.push(tmp);
}

console.log("We'll be playing WITHOUT blinds. Let's begin. \n");
let stop = "";

let players = initialPlayers;
while (stop != "s") {
	for (const player of players) {
		player.showHand();
	}
	const game: Poker = new Poker(players, deck);
	players = game.playGame();
	game.dealCards();
	stop = readline.question(
		"\nIf you want to stop playing please type (s). Otherwise, hit enter to continue. \n"
	);
}
