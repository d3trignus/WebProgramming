import React from "react";

export default class NewCardPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newFrontText: "",
      newBackText: "",
      error: "",
    };
  }

  handleNewFrontText = (e) => {
    this.setState({ newFrontText: e.target.value });
  };

  handleNewBackText = (e) => {
    this.setState({ newBackText: e.target.value });
  };

  handleAddCard = () => {
    const front = this.state.newFrontText.trim();
    const back = this.state.newBackText.trim();

    const result = this.props.onAddCard(front, back);

    this.setState({ newFrontText: "", newBackText: "", error: result });
  };

  render = () => {
    return (
      <div id="add-cards">
        <p>Add new card</p>
        <div id="add-card-inputs">
          <input
            type="text"
            id="add-card-front-input"
            placeholder="Front side"
            value={this.state.newFrontText}
            onChange={this.handleNewFrontText}
          />
          <input
            type="text"
            id="add-card-back-input"
            placeholder="Back side"
            value={this.state.newBackText}
            onChange={this.handleNewBackText}
          />
          <p className="on-add-error">{this.state.error}</p>
        </div>
        <button id="add-card-button" onClick={this.handleAddCard}>
          Add card
        </button>
        <div id="add-card-error"></div>
      </div>
    );
  };
}
