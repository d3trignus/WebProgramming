import React from "react";
import DecksPanel from "./DecksPanel.jsx";
import ModePanel from "./ModePanel.jsx";
import CardPanel from "./CardPanel.jsx";
import NewCardPanel from "./NewCardPanel.jsx";
import CardsListPanel from "./CardsListPanel.jsx";

export default class Flashcards extends React.Component {
  constructor(props) {
    super(props);

    this.state = loadFromLocalStorage();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state) {
      this.saveToLocalStorage();
    }
  }

  get currentDeck() {
    return this.state.decks.find(
      (deck) => deck.id === this.state.currentDeckId,
    );
  }

  get currentCards() {
    if (this.state.currentMode === "unlearned") {
      return this.currentDeck.cards.filter((card) => !card.isLearned);
    }
    return this.currentDeck.cards;
  }

  get currentCard() {
    return this.currentCards.find(
      (card) => card.id === this.state.currentCardId,
    );
  }

  render = () => {
    return (
      <>
        <DecksPanel
          decks={this.state.decks}
          currentDeckId={this.state.currentDeckId}
          onChangeDeck={this.handleChangeDeck}
          onAddDeck={this.handleAddDeck}
          onRemoveDeck={this.handleRemoveDeck}
        />
        <ModePanel
          currentMode={this.state.currentMode}
          onChangeMode={this.handleChangeMode}
          onShuffleDeck={this.handleShuffleDeck}
        />
        <CardPanel
          currentCard={this.currentCard}
          currentCardIndex={this.currentCards.findIndex(
            (card) => card.id === this.state.currentCardId,
          )}
          currentCardId={this.state.currentCardId}
          totalCardsCount={this.currentCards.length}
          onPrevCard={this.handlePrevCard}
          onNextCard={this.handleNextCard}
          onFlipCard={this.handleFlipCard}
          onToggleLearned={this.handleToggleLearned}
        />
        <NewCardPanel onAddCard={this.handleAddCard} />
        <CardsListPanel
          cards={this.currentDeck.cards}
          onEditCard={this.handleEditCard}
          onDeleteCard={this.handleDeleteCard}
          onToggleLearned={this.handleToggleLearned}
        />
      </>
    );
  };

  handleChangeDeck = (deckId) => {
    deckId = parseInt(deckId);
    const newDeck = this.state.decks.find((deck) => deck.id === deckId);
    const newDeckId = deckId;
    const newCurrentCardId =
      newDeck.cards.length > 0 ? newDeck.cards[0].id : null;

    this.setState({
      ...this.state,
      currentDeckId: newDeckId,
      currentCardId: newCurrentCardId,
    });
  };

  handleAddDeck = (deckName) => {
    const name = deckName.trim();

    if (name.length === 0) {
      return "Deck name cannot be empty";
    }

    if (this.state.decks.some((deck) => deck.name === name)) {
      return "Deck with this name already exists";
    }

    const newDeckId = Date.now();
    const newDeck = { id: newDeckId, name: name, cards: [] };

    this.setState({
      ...this.state,
      currentDeckId: newDeckId,
      currentCardId: null,
      decks: [...this.state.decks, newDeck],
    });

    return "";
  };

  handleRemoveDeck = () => {
    const deckIndex = this.state.decks.findIndex(
      (deck) => deck.id === this.state.currentDeckId,
    );

    const newDecks = this.state.decks.filter(
      (deck) => deck.id !== this.state.currentDeckId,
    );

    if (newDecks.length === 0) {
      const defaultDeck = { id: Date.now(), name: "Default deck", cards: [] };
      this.setState({
        ...this.state,
        decks: [defaultDeck],
        currentDeckId: defaultDeck.id,
        currentCardId: null,
      });
    } else {
      const newCurrentDeck = newDecks[Math.max(0, deckIndex - 1)];
      this.setState({
        ...this.state,
        decks: newDecks,
        currentDeckId: newCurrentDeck.id,
        currentCardId:
          newCurrentDeck.cards.length > 0 ? newCurrentDeck.cards[0].id : null,
      });
    }
  };

  handleChangeMode = (mode) => {
    let newCards;
    if (mode === "unlearned") {
      newCards = this.currentDeck.cards.filter((card) => !card.isLearned);
    } else {
      newCards = this.currentDeck.cards;
    }

    const newCardId = newCards.length > 0 ? newCards[0].id : null;

    this.setState({
      ...this.state,
      currentMode: mode,
      currentCardId: newCardId,
    });
  };

  handleShuffleDeck = () => {
    const currentDeck = this.state.decks.find(
      (deck) => deck.id === this.state.currentDeckId,
    );

    const cards = [...currentDeck.cards];

    if (cards.length < 2) return;

    for (let i = cards.length - 1; i > 0; --i) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    this.setState({
      ...this.state,
      currentCardId: cards[0].id,
      decks: this.state.decks.map((deck) =>
        deck.id === currentDeck.id ? { ...deck, cards: cards } : deck,
      ),
    });
  };

  handleAddCard = (front, back) => {
    const frontText = front.trim();
    const backText = back.trim();

    if (frontText.length === 0 || backText.length === 0) {
      return "Card front and back cannot be empty";
    }

    const newCardId = Date.now();

    const newCard = {
      id: newCardId,
      front: frontText,
      back: backText,
      isLearned: false,
      isFlipped: false,
    };

    this.setState({
      ...this.state,
      currentCardId: newCardId,
      decks: this.state.decks.map((deck) =>
        deck.id === this.state.currentDeckId
          ? { ...deck, cards: [...deck.cards, newCard] }
          : deck,
      ),
    });
    return "";
  };

  handlePrevCard = () => {
    const currentDeck = this.currentDeck;
    const currentCards = this.currentCards;

    if (currentDeck.cards.length === 0) return;

    const currentCardIndex = currentCards.findIndex(
      (card) => card.id === this.state.currentCardId,
    );

    if (currentCards.length === 0) return;

    const prevCardIndex =
      (currentCardIndex - 1 + currentCards.length) % currentCards.length;
    const prevCardId = currentCards[prevCardIndex].id;

    this.setState({
      ...this.state,
      currentCardId: prevCardId,
      decks: this.state.decks.map((deck) =>
        deck.id === currentDeck.id
          ? {
              ...deck,
              cards: deck.cards.map((card) =>
                card.id === this.state.currentCardId
                  ? { ...card, isFlipped: false }
                  : card,
              ),
            }
          : deck,
      ),
    });
  };

  handleNextCard = () => {
    const currentDeck = this.currentDeck;
    const currentCards = this.currentCards;

    if (currentDeck.cards.length === 0) return;

    const currentCardIndex = currentCards.findIndex(
      (card) => card.id === this.state.currentCardId,
    );

    if (currentCards.length === 0) return;

    const nextCardIndex = (currentCardIndex + 1) % currentCards.length;
    const nextCardId = currentCards[nextCardIndex].id;

    this.setState({
      ...this.state,
      currentCardId: nextCardId,
      decks: this.state.decks.map((deck) =>
        deck.id === currentDeck.id
          ? {
              ...deck,
              cards: deck.cards.map((card) =>
                card.id === this.state.currentCardId
                  ? { ...card, isFlipped: false }
                  : card,
              ),
            }
          : deck,
      ),
    });
  };

  handleFlipCard = () => {
    const currentDeck = this.currentDeck;
    const currentCard = this.currentCard;

    if (!currentCard) return;

    const flippedCard = { ...currentCard, isFlipped: !currentCard.isFlipped };

    this.setState({
      ...this.state,
      decks: this.state.decks.map((deck) =>
        deck.id === currentDeck.id
          ? {
              ...deck,
              cards: deck.cards.map((card) =>
                card.id === currentCard.id ? flippedCard : card,
              ),
            }
          : deck,
      ),
    });
  };

  handleToggleLearned = (cardId) => {
    const currentDeck = this.currentDeck;
    console.log(cardId);
    const requestedCard = this.currentDeck.cards.find((c) => c.id === cardId);

    const toggledCard = {
      ...requestedCard,
      isLearned: !requestedCard.isLearned,
    };

    this.setState(
      {
        ...this.state,
        decks: this.state.decks.map((deck) =>
          deck.id === currentDeck.id
            ? {
                ...deck,
                cards: deck.cards.map((card) =>
                  card.id === requestedCard.id ? toggledCard : card,
                ),
              }
            : deck,
        ),
      },
      () => {
        if (this.state.currentMode === "unlearned" && toggledCard.isLearned) {
          // const newCurrentCardId =
          //   this.currentCards.length > 1
          //     ? this.currentCards.find((card) => card.id !== cardId).id
          //     : null;

          // this.setState({ ...this.state, currentCardId: newCurrentCardId });
          this.handleNextCard();
        }
      },
    );
  };

  handleEditCard = (cardId) => {
    const currentDeck = this.currentDeck;
    const card = currentDeck.cards.find((c) => c.id === cardId);
    const newFront =
      prompt("Enter new front side text", card.front) || card.front;
    const newBack = prompt("Enter new back side text", card.back) || card.back;

    const editedCard = {
      ...card,
      front: newFront.trim(),
      back: newBack.trim(),
      isFlipped: false,
    };

    this.setState({
      ...this.state,
      decks: this.state.decks.map((deck) =>
        deck.id === currentDeck.id
          ? {
              ...deck,
              cards: deck.cards.map((c) => (c.id === cardId ? editedCard : c)),
            }
          : deck,
      ),
    });
  };

  handleDeleteCard = (cardId) => {
    const currentDeck = this.currentDeck;

    const newCards = currentDeck.cards.filter((card) => card.id !== cardId);

    const newCurrentCardId =
      cardId === this.state.currentCardId
        ? newCards.length > 0
          ? newCards[0].id
          : null
        : this.state.currentCardId;

    this.setState({
      ...this.state,
      currentCardId: newCurrentCardId,
      decks: this.state.decks.map((deck) =>
        deck.id === currentDeck.id ? { ...deck, cards: newCards } : deck,
      ),
    });
  };

  saveToLocalStorage = () => {
    localStorage.setItem("decks", JSON.stringify(this.state.decks));
    localStorage.setItem(
      "currents",
      JSON.stringify([
        this.state.currentDeckId,
        this.state.currentCardId,
        this.state.currentMode,
      ]),
    );
  };
}

function loadFromLocalStorage() {
  const decks = JSON.parse(localStorage.getItem("decks")) || [
    { id: Date.now(), name: "Default deck", cards: [] },
  ];
  const currents = JSON.parse(localStorage.getItem("currents")) || [
    decks[0].id,
    null,
    "all",
  ];

  const currentDeckId = currents[0];
  const currentCardId = currents[1];
  const currentMode = currents[2];

  return { decks, currentDeckId, currentCardId, currentMode };
}
