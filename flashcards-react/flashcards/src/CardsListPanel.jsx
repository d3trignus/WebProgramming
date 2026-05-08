import React from "react";

export default class CardsListPanel extends React.Component {
  render = () => {
    return (
      <div id="cards-list">
        <p>This deck's cards list</p>

        <table id="cards-table">
          <thead>
            <tr>
              <th>Front side</th>
              <th>Back side</th>
              <th>Learned</th>
              <th>Actions</th>
            </tr>
            {this.props.cards.map((card) => (
              <tr key={card.id}>
                <td>{card.front}</td>
                <td>{card.back}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={card.isLearned}
                    onChange={() => this.props.onToggleLearned(card.id)}
                  />
                </td>
                <td>
                  <button onClick={() => this.props.onEditCard(card.id)}>
                    Edit
                  </button>
                  <button onClick={() => this.props.onDeleteCard(card.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </thead>
          <tbody id="table-body"></tbody>
        </table>
      </div>
    );
  };
}
