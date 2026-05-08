import React from "react";

export default class DecksPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = { error: "", newDeckName: "" };
  }

  handleChangeNewDeckName = (e) => {
    this.setState({ newDeckName: e.target.value });
  };

  handleAddDeck = () => {
    const name = this.state.newDeckName.trim();
    this.props.onAddDeck(name);
    this.setState({ error: "", newDeckName: "" });
  };

  handleChangeDeck = (e) => {
    const id = e.target.value;
    this.props.onChangeDeck(id);
  };

  render = () => {
    return (
      <div id="decks">
        <p>My decks</p>
        <div className="decks-list">
          <select
            className="deck-select"
            value={this.props.currentDeckId}
            onChange={this.handleChangeDeck}
          >
            {this.props.decks.map((deck) => (
              <option key={deck.id} value={deck.id}>
                {deck.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            id="add-deck-input"
            placeholder="New deck's name"
            value={this.state.newDeckName}
            onChange={this.handleChangeNewDeckName}
          />
          <div id="add-deck-error">{this.state.error}</div>
        </div>
        <button id="add-deck-button" onClick={this.handleAddDeck}>
          Add deck
        </button>
        <button id="remove-deck-button" onClick={this.props.onRemoveDeck}>
          Remove deck
        </button>
      </div>
    );
  };
}
