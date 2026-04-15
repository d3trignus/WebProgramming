class Renderer {
  constructor(deckManager) {
    this.deckManager = deckManager;

    this.addDeckButton = document.querySelector("#add-deck-button");
    this.removeDeckButton = document.querySelector("#remove-deck-button");
    this.shuffleDeckButton = document.querySelector("#shuffle-deck-button");

    this.addCardButton = document.querySelector("#add-card-button");

    this.nextCardButton = document.querySelector("#next-card-button");
    this.flipCardButton = document.querySelector("#flip-card-button");
    this.prevCardButton = document.querySelector("#prev-card-button");

    this.toggleLearnedButton = document.querySelector("#toggle-learned-button");
    this.toggleLearnedCheckbox = document.querySelector(
      "#toggle-learned-checkbox",
    );

    this.selectDeck = document.querySelector("#deck-select");
    this.addDeckInput = document.querySelector("#add-deck-input");

    this.addCardFrontInput = document.querySelector("#add-card-front-input");
    this.addCardBackInput = document.querySelector("#add-card-back-input");

    this.radioButtons = document.querySelectorAll('input[name="mode"]');

    this.tableBody = document.querySelector("#table-body");

    this.cardEl = document.querySelector("#card");

    this.addDeckErrorEl = document.querySelector("#add-deck-error");
    this.addCardErrorEl = document.querySelector("#add-card-error");

    this.initEventListeners();
  }

  initEventListeners = () => {
    this.addDeckButton.addEventListener("click", () => {
      this.deckManager.addDeck(this.addDeckInput.value);
      this.addDeckInput.value = "";

      this.renderAll();
    });

    this.removeDeckButton.addEventListener("click", () => {
      this.deckManager.removeDeck();
      this.renderAll();
    });

    this.shuffleDeckButton.addEventListener("click", () => {
      this.deckManager.shuffleDeck();
      this.renderAll();
    });

    this.addCardButton.addEventListener("click", () => {
      this.deckManager.addCard(
        this.addCardFrontInput.value,
        this.addCardBackInput.value,
      );
      this.addCardFrontInput.value = "";
      this.addCardBackInput.value = "";

      this.renderAll();
    });

    this.nextCardButton.addEventListener("click", () => {
      this.deckManager.nextCard();
      this.renderAll();
    });

    this.prevCardButton.addEventListener("click", () => {
      this.deckManager.prevCard();
      this.renderAll();
    });

    this.flipCardButton.addEventListener("click", () => {
      this.deckManager.flipCard();
      this.renderAll();
    });
    this.cardEl.addEventListener("click", () => {
      this.deckManager.flipCard();
      this.renderAll();
    });

    this.toggleLearnedButton.addEventListener("click", () => {
      this.deckManager.toggleLearned();
      this.renderAll();
    });

    this.toggleLearnedCheckbox.addEventListener("change", () => {
      this.deckManager.toggleLearned();
      this.renderAll();
    });

    this.selectDeck.addEventListener("change", () => {
      this.deckManager.changeDeck(this.selectDeck.value);
      this.renderAll();
    });

    for (let i = 0; i < this.radioButtons.length; ++i) {
      this.radioButtons[i].addEventListener("change", () => {
        this.deckManager.setMode(this.radioButtons[i].value);
        this.renderAll();
      });
    }
  };

  renderAll = () => {
    this.renderToggleLearnedCheckbox();
    this.renderDeckList();
    this.renderCurrentCard();
    this.renderMode();
    this.renderCounters();
    this.renderTable();
    this.disableButtons();
  };

  renderDeckList = () => {
    this.selectDeck.innerHTML = "";
    this.deckManager.decks.forEach((deck) => {
      const option = document.createElement("option");
      option.value = deck.id;
      option.textContent = deck.name;
      if (deck.id === this.deckManager.currentDeckId) {
        option.selected = true;
      }
      this.selectDeck.appendChild(option);
    });
  };

  renderCurrentCard = () => {
    const card = this.deckManager.currentCard;
    const cardDiv = document.querySelector("#card");

    if (!card) {
      cardDiv.innerHTML = "The deck is empty";
      return;
    }
    cardDiv.innerHTML = card.isFlipped ? card.back : card.front;
  };

  renderMode = () => {
    this.radioButtons.forEach((button) => {
      if (button.value === this.deckManager.currentMode) {
        button.checked = true;
      }
    });
  };

  renderToggleLearnedCheckbox = () => {
    this.toggleLearnedCheckbox.checked = false;
    const card = this.deckManager.currentCard;
    if (!card) return;
    if (card.isLearned) this.toggleLearnedCheckbox.checked = true;
  };

  renderCounters = () => {
    const cardIndexEl = document.querySelector("#p-card-index");
    const cards = this.deckManager.currentCards;
    if (!cards) {
      cardIndexEl.textContent = "";
      return;
    }
    const cardIndex = cards.findIndex(
      (card) => card.id === this.deckManager.currentCardId,
    );
    if (this.deckManager.currentCards.length === 0) {
      cardIndexEl.textContent = "0 / 0";
      return;
    }
    cardIndexEl.textContent = `${cardIndex + 1} / ${this.deckManager.currentCards.length}`;
  };

  renderTable = () => {
    const deck = this.deckManager.currentDeck;
    this.tableBody.innerHTML = "";

    if (!deck) return;

    deck.cards.forEach((card) => {
      const row = document.createElement("tr");

      const frontCell = document.createElement("td");
      frontCell.textContent = card.front;
      row.appendChild(frontCell);

      const backCell = document.createElement("td");
      backCell.textContent = card.back;
      row.appendChild(backCell);

      const learnedCell = document.createElement("td");
      const learnedCheckbox = document.createElement("input");
      learnedCheckbox.type = "checkbox";
      if (card.isLearned) {
        learnedCheckbox.checked = true;
      }
      learnedCheckbox.addEventListener("change", () => {
        this.deckManager.toggleLearned(card.id);
        this.renderAll();
      });
      learnedCell.appendChild(learnedCheckbox);
      row.appendChild(learnedCell);

      const actionsCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        this.deckManager.removeCard(card.id);
        this.renderAll();
      });
      actionsCell.appendChild(deleteButton);

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => {
        this.deckManager.editCard(card.id);
        this.renderAll();
      });
      actionsCell.appendChild(editButton);

      row.appendChild(actionsCell);

      this.tableBody.appendChild(row);
    });
  };

  disableButtons = () => {
    const hasDeck = this.deckManager.currentDeck !== null;
    const hasCards = hasDeck && this.deckManager.currentCards.length > 0;

    this.nextCardButton.disabled = !hasCards;
    this.prevCardButton.disabled = !hasCards;
    this.flipCardButton.disabled = !hasCards;
    this.toggleLearnedButton.disabled = !hasCards;
    this.removeDeckButton.disabled = !hasDeck;
  };

  renderAddDeckError = () => {
    this.addDeckErrorEl.innerHTML = "Deck with this name already exists";
  };

  renderAddCardError = () => {
    this.addCardErrorEl.innerHTML = "";
  };
}
