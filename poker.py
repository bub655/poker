class playPoker:
    deck = []
    suits = ["D", "C", "H", "S"]
    tokens = 1000
    def generateDeck():
        for i in range(13) :
            for j in suits:
                deck.add(new Card(i, suits[j]))