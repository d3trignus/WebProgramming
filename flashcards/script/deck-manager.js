class DeckManager {
  constructor() {
    this.decks = JSON.parse(localStorage.getItem("decks")) || [
      { id: Date.now(), name: "Default deck", cards: [] },
    ];
    this.currents = JSON.parse(localStorage.getItem("currents")) || [
      this.decks[0].id,
      null,
      "all",
    ];

    this.currentDeckId = this.currents[0];
    this.currentCardId = this.currents[1];
    this.currentMode = this.currents[2];
  }

  get currentDeck() {
    return (
      this.decks.find((deck) => deck.id === this.currentDeckId) || this.decks[0]
    );
  }

  get currentCards() {
    const deck = this.currentDeck;
    if (!deck) return [];

    if (this.currentMode === "unlearned") {
      return deck.cards.filter((card) => !card.isLearned);
    }

    return deck.cards;
  }

  get currentCard() {
    const cards = this.currentCards;
    if (cards.length === 0) return null;
    return cards.find((card) => card.id === this.currentCardId);
  }

  save = () => {
    this.currents = [this.currentDeckId, this.currentCardId, this.currentMode];

    localStorage.setItem("decks", JSON.stringify(this.decks));
    localStorage.setItem("currents", JSON.stringify(this.currents));
  };

  setMode = (mode) => {
    this.currentMode = mode;
    const cards = this.currentCards;
    this.currentCardId = cards.length > 0 ? cards[0].id : null;
    this.save();
  };

  changeDeck = (deckId) => {
    deckId = parseInt(deckId);
    const deck = this.decks.find((d) => d.id === deckId);
    this.currentDeckId = deckId;
    this.currentCardId = deck.cards.length > 0 ? deck.cards[0].id : null;
    this.save();
  };

  addDeck = (deckName) => {
    const name = deckName.trim();

    if (name.length === 0) {
      alert("Deck name cannot be empty");
      return;
    }

    if (this.decks.some((deck) => deck.name === name)) {
      alert("Deck with this name already exists");
      return;
    }

    const newDeckId = Date.now();
    const newDeck = {
      id: newDeckId,
      name: name,
      cards: [],
    };

    this.decks.push(newDeck);

    this.currentDeckId = newDeckId;
    this.currentCardId = null;

    this.save();
  };

  addCard = (front, back) => {
    const frontText = front.trim();
    const backText = back.trim();

    if (frontText.length === 0 || backText.length === 0) {
      alert("Card front and back cannot be empty");
      return;
    }

    const deck = this.currentDeck;
    if (!deck) return;

    const newCardId = Date.now();
    const newCard = {
      id: newCardId,
      front: frontText,
      back: backText,
      isLearned: false,
      isFlipped: false,
    };

    deck.cards.push(newCard);
    this.currentCardId = newCardId;

    this.save();
  };

  flipCard = () => {
    const card = this.currentCard;
    if (!card) return;

    card.isFlipped = !card.isFlipped;
    this.save();
  };

  toggleLearned = (cardId = this.currentCardId) => {
    cardId = parseInt(cardId);

    const deck = this.decks.find((d) => d.id === this.currentDeckId);
    const card = deck.cards.find((c) => c.id === cardId);

    card.isLearned = !card.isLearned;

    this.save();
  };

  removeDeck = () => {
    const deck = this.currentDeck;
    if (!deck) return;

    const deckIndex = this.decks.findIndex((d) => d.id === deck.id);
    this.decks.splice(deckIndex, 1);

    if (this.decks.length === 0) {
      this.decks.push({ id: Date.now(), name: "Default deck", cards: [] });
      this.currentDeckId = this.decks[0].id;
      this.currentCardId = null;
    } else {
      const currentDeck = this.decks[Math.max(0, deckIndex - 1)];
      this.currentDeckId = currentDeck.id;
      this.currentCardId =
        currentDeck.cards.length > 0 ? currentDeck.cards[0].id : null;
    }

    this.save();
  };

  removeCard = () => {
    const card = this.currentCard;
    if (!card) return;

    const deck = this.currentDeck;
    const cardIndex = deck.cards.findIndex((c) => c.id === card.id);
    deck.cards.splice(cardIndex, 1);

    this.currentCardId =
      deck.cards.length > 0 ? deck.cards[Math.max(0, cardIndex - 1)].id : null;

    this.save();
  };

  editCard = (cardId) => {
    const card = this.currentDeck.cards.find((c) => c.id === cardId);
    card.front = prompt("Enter new front text:", card.front) || card.front;
    card.back = prompt("Enter new back text:", card.back) || card.back;

    this.save();
  };

  shuffleDeck = () => {
    const cards = this.currentCards;

    if (cards.length < 2) return;

    for (let i = cards.length - 1; i > 0; --i) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    this.currentCardId = cards[0].id;
    this.save();
  };

  nextCard = () => {
    const cards = this.currentCards;
    if (cards.length === 0) return;

    this.currentCard.isFlipped = false;

    const currentIndex = cards.findIndex((c) => c.id === this.currentCardId);
    const nextIndex = (currentIndex + 1) % cards.length;
    this.currentCardId = cards[nextIndex].id;

    this.save();
  };

  prevCard = () => {
    const cards = this.currentCards;
    if (cards.length === 0) return;

    this.currentCard.isFlipped = false;

    const currentIndex = cards.findIndex((c) => c.id === this.currentCardId);
    const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
    this.currentCardId = cards[prevIndex].id;

    this.save();
  };
}
