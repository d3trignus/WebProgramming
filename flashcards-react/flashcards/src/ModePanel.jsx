import React from "react";

export default class ModePanel extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    const { currentMode, onChangeMode, onShuffleDeck } = this.props;

    return (
      <div id="select-mode">
        <p>Select study mode</p>

        <label>
          <input
            type="radio"
            name="mode"
            value="all"
            checked={currentMode === "all"}
            onChange={() => onChangeMode("all")}
          />
          All cards
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            value="unlearned"
            checked={currentMode === "unlearned"}
            onChange={() => onChangeMode("unlearned")}
          />
          Only unlearned
        </label>

        <button id="shuffle-deck-button" onClick={onShuffleDeck}>
          Shuffle
        </button>
      </div>
    );
  };
}
