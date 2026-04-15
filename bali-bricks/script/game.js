class Game {
  constructor(playerCount, renderer) {
    this.renderer = renderer;
    this.currentPlayerIndex = 0;
    this.players = new Array(playerCount).fill(null).map((_, index) => {
      return {
        name: `Player ${index + 1}`,
        cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      };
    });
  }

  get currentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  start = () => {
    this.renderer.renderCards(this.players, this.currentPlayerIndex);
    this.processTurn();
  };

  processTurn = () => {
    if (this.checkWin()) return;

    const d1 = this.rollDice();
    const d2 = this.rollDice();

    this.renderer.renderTurn(
      d1,
      d2,
      this.currentPlayer.cards,
      (cards) => this.handleTurn(cards),
      () => this.handleSkip(),
    );
  };

  handleTurn = (cardsToRemove) => {
    this.currentPlayer.cards = this.currentPlayer.cards.filter(
      (card) => !cardsToRemove.includes(card),
    );

    if (!this.checkWin()) {
      this.moveNextPlayer();
      this.renderer.renderCards(this.players, this.currentPlayerIndex);
      this.processTurn();
    }
  };

  handleSkip = () => {
    this.moveNextPlayer();
    this.renderer.renderCards(this.players, this.currentPlayerIndex);
    this.processTurn();
  };

  moveNextPlayer = () => {
    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.players.length;
  };

  checkWin = () => {
    if (this.currentPlayer.cards.length === 0) {
      this.renderer.renderWinMessage(this.currentPlayerIndex + 1);
      return true;
    }
    return false;
  };

  rollDice = () => {
    return Math.ceil(Math.random() * 6);
  };
}
