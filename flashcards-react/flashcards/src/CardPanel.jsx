import React from "react";

export default class CardPanel extends React.Component {
  displayCardText = (card) => {
    if (!card) return "";
    return card.isFlipped ? card.back : card.front;
  };

  render = () => {
    const currentCard = this.props.currentCard;
    let cardColor;
    if (currentCard) {
      cardColor = {
        background: !currentCard.isLearned
          ? "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)"
          : "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
      };
      if (currentCard.isFlipped) {
        cardColor = {
          background: !currentCard.isLearned
            ? "linear-gradient(135deg, #dfdfdf 0%, #f8fafc 100%)"
            : "linear-gradient(135deg, #93d8b3 0%, #a7f3d0 100%)",
        };
      }
    } else {
      cardColor = {
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      };
    }
    return (
      <>
        <div id="cards">
          <div id="card-container"></div>
          <p id="no-cards"></p>
          <div id="card" onClick={this.props.onFlipCard} style={cardColor}>
            {this.displayCardText(currentCard)}
          </div>

          <div id="card-buttons">
            <div id="manipulators" onClick={this.handleFlipCard}>
              <button id="prev-card-button" onClick={this.props.onPrevCard}>
                Previous
              </button>
              <button id="flip-card-button" onClick={this.props.onFlipCard}>
                Flip
              </button>
              <button id="next-card-button" onClick={this.props.onNextCard}>
                Next
              </button>
            </div>
            <button
              id="toggle-learned-button"
              onClick={() =>
                this.props.onToggleLearned(this.props.currentCardId)
              }
            >
              Toggle learned
            </button>
            <input
              id="toggle-learned-checkbox"
              type="checkbox"
              onChange={() =>
                this.props.onToggleLearned(this.props.currentCardId)
              }
              checked={currentCard ? currentCard.isLearned : false}
            />
            <p id="p-card-index">{`${this.props.currentCardIndex + 1} / ${this.props.totalCardsCount}`}</p>
          </div>
        </div>
      </>
    );
  };
}
