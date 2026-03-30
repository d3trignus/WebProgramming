class Renderer {
  constructor() {
    this.choiceEl = document.querySelector("#choice");
    this.cardsEl = document.querySelector("#cards");
    this.headEl = document.querySelector("#head");
  }

  renderInput = (onStart) => {
    this.headEl.innerHTML = "";

    const input = document.createElement("input");
    input.type = "number";
    input.min = "1";
    input.max = "10";
    input.id = "input";
    input.value = "1";

    const startButton = this.createButton("start-btn", "Start Game", () => {
      const count = document.querySelector("#input").value;
      onStart(count);
    });
    this.headEl.appendChild(input);
    this.headEl.appendChild(startButton);
  };

  renderTurn(d1, d2, currentCards, onAction, onSkip) {
    this.choiceEl.innerHTML = "";

    const playDiv = document.createElement("div");
    playDiv.className = "play-buttons-container";

    const b1 = this.createButton("b1", `${d1}, ${d2}`, () =>
      onAction([d1, d2]),
    );
    const b2 = this.createButton("b2", `${d1 + d2}`, () => onAction([d1 + d2]));
    const skip = this.createButton("skip", "Skip turn", onSkip);

    if (!currentCards.includes(d1) && !currentCards.includes(d2)) {
      b1.disabled = true;
    }

    if (!currentCards.includes(d1 + d2)) {
      b2.disabled = true;
    }

    playDiv.appendChild(b1);
    playDiv.appendChild(b2);
    this.choiceEl.appendChild(playDiv);
    this.choiceEl.appendChild(skip);
  }

  renderCards = (players, currentPlayerIndex) => {
    this.cardsEl.innerHTML = "";

    players.forEach((player, index) => {
      const playerDiv = document.createElement("div");
      playerDiv.className = "player-row";

      const playerName = document.createElement("span");
      playerName.className = "player-name";
      playerName.innerText = `${player.name}: `;

      playerDiv.appendChild(playerName);

      const cardsContainer = document.createElement("div");
      cardsContainer.className = "cards-container";

      for (let i = 1; i <= 12; ++i) {
        const card = document.createElement("span");
        card.className = "card-item";
        card.innerText = i;

        if (player.cards.includes(i)) {
          if (index === currentPlayerIndex) {
            card.style.color = "var(--accent-green)";
          } else {
            card.style.color = "var(--accent-red)";
          }
        } else {
          card.style.color = "RGBA(0, 0, 0, 0)";
        }
        cardsContainer.appendChild(card);
      }
      playerDiv.appendChild(cardsContainer);
      this.cardsEl.appendChild(playerDiv);
    });
  };

  renderWinMessage = (playerNumber) => {
    this.cardsEl.innerHTML = `Player ${playerNumber} wins!`;
    this.choiceEl.innerHTML = "";
  };

  renderErrorMessage = () => {
    this.choiceEl.innerHTML = "";
    this.cardsEl.innerHTML = "Number of players must be between 1 and 10";
  };

  createButton = (id, text, clickHandler) => {
    const button = document.createElement("button");
    button.id = id;
    button.innerText = text;
    button.addEventListener("click", clickHandler);

    return button;
  };
}
