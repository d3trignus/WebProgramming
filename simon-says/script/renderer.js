class Renderer {
  constructor(game) {
    this.game = game;

    this.startButton = document.querySelector("#start-button");
    this.giveUpButton = document.querySelector("#give-up-button");

    this.gameContainer = document.querySelector("#game-container");

    this.countDownContainer = document.querySelector("#countdown");
    this.countDownEl = document.querySelector("#countdown-text");

    this.resultMessageEl = document.querySelector("#result-message");

    this.currentBestScoreEl = document.querySelector("#current-best-score");

    this.inactiveColor = "#708090";
    this.activeColors = [
      "#FF355E",
      "#66FF66",
      "#50BFE6",
      "#FF6037",
      "#9C51B6",
      "#FF00CC",
      "#22D1EE",
      "#FFFF66",
      "#A7F432",
      "#fca4df",
    ];

    this.initEventListeners();
  }

  initEventListeners = () => {
    this.startButton.addEventListener("click", () => {
      this.resultMessageEl.innerHTML = "";
      this.gameContainer.innerHTML = "";

      this.startButton.disabled = true;
      this.giveUpButton.disabled = false;

      this.game.startGame(
        document.querySelector("#btns-count-input").value,
        this,
      );
    });

    this.giveUpButton.addEventListener("click", () => {
      this.gamee.handleGiveUp(this);
    });
  };

  sleep = async (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  startCountdown = async (round) => {
    this.countDownContainer.classList.add("hidden");
    this.countDownContainer.classList.remove("hidden");

    this.countDownEl.textContent = `Round ${round}`;
    await this.sleep(500);

    this.countDownEl.textContent = "Ready";
    await this.sleep(500);

    this.countDownEl.textContent = "Set";
    await this.sleep(500);

    this.countDownEl.textContent = "GO!";
    await this.sleep(500);

    this.countDownContainer.classList.add("hidden");
  };

  renderButtons = async (n) => {
    this.gameContainer.innerHTML = "";

    for (let i = 0; i < n; ++i) {
      const buttonEl = document.createElement("button");
      buttonEl.classList.add("game-button");
      buttonEl.id = `button-${i}`;
      buttonEl.name = i;
      // buttonEl.textContent = i;

      buttonEl.style.backgroundColor = this.inactiveColor;
      // buttonEl.style.boxShadow = `0 4px 0 darken(${this.inactiveColor}, 20%)`;

      buttonEl.disabled = true;

      const columns = Math.ceil(Math.sqrt(n));
      this.gameContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

      buttonEl.addEventListener("click", async () => {
        this.flashButton(`button-${i}`);
      });

      this.gameContainer.appendChild(buttonEl);
    }
  };

  flashButton = async (buttonId) => {
    const button = document.querySelector(`#${buttonId}`);
    if (!button) return;

    const order = parseInt(buttonId.replace("button-", ""));

    button.style.backgroundColor = this.activeColors[order];

    await this.sleep(300);

    button.style.backgroundColor = this.inactiveColor;
  };

  disableGameButtons = () => {
    const buttons = document.querySelectorAll(".game-button");

    buttons.forEach((button) => {
      button.disabled = true;
      button.style.pointerEvents = "none";
    });
  };

  enableGameButtons = () => {
    const buttons = document.querySelectorAll(".game-button");

    buttons.forEach((button) => {
      button.disabled = false;
      button.style.pointerEvents = "auto";
    });
  };

  renderLooseMessage = (score, best) => {
    this.gameContainer.innerHTML = "";
    this.resultMessageEl.innerHTML = `<h1>You loose</h1> 
                                      <h2>You passed ${score} rounds. <br> Your current best score -- ${best} rounds</h2>`;

    this.startButton.disabled = false;
    this.giveUpButton.disabled = true;
  };

  renderNewBestMessage = (score) => {
    this.gameContainer.innerHTML = "";
    this.resultMessageEl.innerHTML = `<h1>New best!</h1> 
                                      <h2>You passed ${score} rounds</h2>`;

    this.startButton.disabled = false;
    this.giveUpButton.disabled = true;
  };

  renderCurrentBestScore = (score) => {
    this.currentBestScoreEl.innerHTML = `Best score: <span>${score}</span>`;
  };

  renderPreviousBestScore = (score) => {
    this.currentBestScoreEl.innerText = `Previous best: <span>${score}</span>`;
  };
}
