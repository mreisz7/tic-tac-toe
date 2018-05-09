import React, { Component } from 'react';
// import './Board.css';

class Square extends Component {
  
  render() {
    const tokenId = "#token-" + this.props.token;

    return (
      <div id={this.props.id} className={['cell', this.props.player, this.props.styling].join(' ')}  onClick={this.props.onClick}>
        <svg>
          <use xlinkHref={tokenId} />
        </svg>
      </div>
    );
  }
};

export default Square;
