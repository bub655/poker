class Card:
    def __init__(self, rank, suit):
        self.suit = suit
        self.rank = rank

    def toString(self):
        return "" + self.rank + " " + self.suit
