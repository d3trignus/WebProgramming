class Game {
  constructor() {
    this.best = parseInt(localStorage.getItem("simon-says-best-score")) || 0;
    this.isGameRunning = false;
    this.currentScore = 0;
  }

  saveNewBest = (score) => {
    this.best = score;
    localStorage.setItem("simon-says-best-score", score);
  };

  sleep = async (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  startGame = async (numberOfButtons, renderer) => {
    renderer.renderCurrentBestScore(this.best);
    numberOfButtons = parseInt(numberOfButtons);

    if (!(numberOfButtons >= 2 && numberOfButtons <= 10)) {
      alert("Please enter a number between 2 and 10.");

      renderer.startButton.disabled = false;
      renderer.giveUpButton.disabled = true;

      return;
    }

    this.isGameRunning = true;
    let answers = [];

    await renderer.renderButtons(numberOfButtons);

    while (this.isGameRunning) {
      this.currentScore = answers.length;
      await renderer.startCountdown(this.currentScore + 1);

      const success = await this.startRound(answers, numberOfButtons, renderer);
      if (!success) this.isGameRunning = false;
      // else await renderer.startCountdown();
    }
    console.log("game over");
  };

  startRound = async (answers, numberOfButtons, renderer) => {
    renderer.disableGameButtons();

    const newAnswerIndex = Math.floor(Math.random() * numberOfButtons);
    // const newAnswer = document.querySelectorAll(".game-button")[newAnswerIndex];

    answers.push(newAnswerIndex);

    for (const index of answers) {
      if (!this.isGameRunning) return false;
      await this.sleep(500);
      await renderer.flashButton(`button-${index}`);
    }

    renderer.enableGameButtons();

    if (!this.isGameRunning) return false;

    for (let i = 0; i < answers.length; ++i) {
      const clickedIndex = await this.waitForClick();
      // console.log(`clicked ${clickedIndex}`);

      if (clickedIndex === null) return false;

      if (clickedIndex !== answers[i]) {
        this.handleLoose(answers.length - 1, renderer);
        return false;
      }

      renderer.flashButton(`button-${clickedIndex}`);
    }

    return true;
  };

  waitForClick = async () => {
    return new Promise((resolve) => {
      const gameContainer = document.querySelector("#game-container");
      const giveUpButton = document.querySelector("#give-up-button");

      const handler = (event) => {
        if (event.target.tagName === "BUTTON") {
          removeEventListeners();
          resolve(parseInt(event.target.id.replace("button-", "")));
        }
      };

      const giveUpHandler = () => {
        removeEventListeners();
        resolve(null);
      };

      const removeEventListeners = () => {
        gameContainer.removeEventListener("click", handler);
        giveUpButton.removeEventListener("click", giveUpHandler);
      };

      gameContainer.addEventListener("click", handler);
      giveUpButton.addEventListener("click", giveUpHandler);
    });
  };

  handleLoose = (round, renderer) => {
    ++this.gameId;
    if (round > this.best) {
      renderer.renderPreviousBestScore(this.best);
      this.saveNewBest(round);
      renderer.renderNewBestMessage(round);
      return;
    }

    renderer.renderLooseMessage(round, this.best);
  };

  handleGiveUp = (renderer) => {
    this.isGameRunning = false;
    this.handleLoose(this.currentScore, renderer);
  };
}
