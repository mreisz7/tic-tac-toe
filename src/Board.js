import React, { Component } from 'react';
import './Board.css';
import Square from './Square';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boardSelections: [null, null, null, null, null, null, null, null, null],
      winningCells: [null, null, null, null, null, null, null, null, null],
      player1Turn: true,
      gamePaused: false
    };
  }

  componentDidMount = () => {
    this.compPlaySpot()
  }

  resetBoard = () => {
    // this.setState({ boardSelections: [null, null, null, null, null, null, null, null, null],
    //   winningCells: [null, null, null, null, null, null, null, null, null],
    //   player1Turn: true });
    this.setState({ boardSelections: [null, null, null, null, null, null, null, null, null],
        winningCells: [null, null, null, null, null, null, null, null, null] });
}

  resetGame = () => {
    this.pauseGame();
    if (this.state.boardSelections.every((val) => {return val === null})) {
      this.props.resetGame();
    } else {
      this.resetBoard();
    }
  }

  compPlaySpot = () => {
    if (!this.state.gamePaused &&
      ((this.state.player1Turn && this.props.player1IsComputer) ||
      (!this.state.player1Turn && this.props.player2IsComputer))) {
      this.compPlay = setTimeout(() => {
        this.playSpot(this.pickNextSpot((this.state.player1Turn) ? this.props.player1Token : this.props.player2Token));
      }, 250)
    }
  }

  playSpot = (boardPosition) => {
    let newBoardSelections = this.state.boardSelections.slice();
    if (newBoardSelections[boardPosition] === null) {
      newBoardSelections[boardPosition] = (this.state.player1Turn) ? this.props.player1Token : this.props.player2Token;
      // var obj = this;
      this.setState({ boardSelections: newBoardSelections,
                      player1Turn: !this.state.player1Turn }, () => {
        const tokenThatWon = this.checkForWin(this.state.boardSelections);
        if (tokenThatWon) {
          const playerThatWon = (tokenThatWon[0] === this.props.player1Token) ? 'Player1' : 'Player2';
          const winningArray = tokenThatWon[1]
          let tempWinArray = this.state.winningCells.slice();
          for (let i = 0; i < winningArray.length; i++) {
            tempWinArray[winningArray[i]] = 'winning-cell';
          }
          this.setState({ winningCells: tempWinArray });
          this.props.incrementScore(playerThatWon);
          this.compPlay = setTimeout(() => {
            this.resetBoard();
            this.compPlaySpot()
          }, 1000);
        }
        if (!tokenThatWon) {
          if (newBoardSelections.every((val) => {return val !== null})) {
            this.props.incrementScore('NoWinner');
            this.compPlay = setTimeout(() => {
              this.resetBoard();
              this.compPlaySpot()
            }, 1000);
          } else {
            this.compPlaySpot();
          }
        }
      });
    }
  }

  pickNextSpot = (token) => {
    // Winning Move
    for (let i = 0; i < this.state.boardSelections.length; i++) {
      let tempBoardSelections = this.state.boardSelections.slice();
      if (tempBoardSelections[i] === null) {
        tempBoardSelections[i] = token;
        if (this.checkForWin(tempBoardSelections)) {
          // console.log('Winning Move: ' + i);
          return i;
        }
      }
    }
    // Saving Move
    for (let i = 0; i < this.state.boardSelections.length; i++) {
      let tempBoardSelections = this.state.boardSelections.slice();
      if (tempBoardSelections[i] === null) {
        tempBoardSelections[i] = (token === 'x') ? 'o' : 'x';
        if (this.checkForWin(tempBoardSelections)) {
          // console.log('Saving Move: ' + i);
          return i;
        }
      }
    }
    // Random Move
    let nullSpots = [];
    let randomMove = null;
    for (let i = 0; i < this.state.boardSelections.length; i++) {
      if (this.state.boardSelections[i] === null) {
        nullSpots.push(i);
      }
    }
    randomMove = nullSpots[Math.floor(Math.random() * nullSpots.length)];
    // console.log('Random Move: ' + randomMove);
    return randomMove;
  }

  checkForWin = (boardArray) => {
    const winArray = [[0, 1, 2],
                      [3, 4, 5],
                      [6, 7, 8],
                      [0, 3, 6],
                      [1, 4, 7],
                      [2, 5, 8],
                      [0, 4, 8],
                      [2, 4, 6]];
    let winner = false;
    for (let i = 0; i < winArray.length; i++) {
      if (boardArray[winArray[i][0]] != null &&
          boardArray[winArray[i][0]] === boardArray[winArray[i][1]] &&
          boardArray[winArray[i][0]] === boardArray[winArray[i][2]]) {
        winner = [boardArray[winArray[i][0]], winArray[i]];
      }
    }
    return winner;
  }

  pauseGameToggle = () => {
    if (this.state.gamePaused) {
      console.log('Game resumed');
      this.resumeGame();
    } else {
      console.log('Game paused');
      this.pauseGame();
    }
  }

  pauseGame = () => {
    clearTimeout(this.compPlay);
    this.setState({gamePaused: true});
  }

  resumeGame = () => {
    this.setState({gamePaused: false}, () => {
      this.compPlaySpot()
    });
  }

  componentWillUnmount = () => {
    if (this.compPlay) {
      clearTimeout(this.compPlay);
    }
  }

  render() {
    const svgTokenPlayer1 = '#token-' + this.props.player1Token;
    const svgTokenPlayer2 = '#token-' + this.props.player2Token;
    const player1TurnIndicator = ['content-header-item', 'player1', (this.state.player1Turn) ? 'turn-indicator' : null].join(' ');
    const player2TurnIndicator = ['content-header-item', 'player2', (!this.state.player1Turn) ? 'turn-indicator' : null].join(' ');
    const pauseResumeButton = (this.state.gamePaused) ? (
        <svg onClick={() => this.pauseGameToggle()} className="footer-icon">
          <use xlinkHref='#play' />
        </svg>
      ) : (
        <svg onClick={() => this.pauseGameToggle()} className="footer-icon">
          <use xlinkHref='#pause' />
        </svg>
      );

    return (
      <div className="content-wrapper">
        <div className="content-header">
          <div className={player1TurnIndicator}>
            <div className="content-header-token">
              <svg>
                <use xlinkHref={svgTokenPlayer1} />
              </svg>
            </div>
            <div className="content-header-item-scorebox">
              <h3 className="content-header-item-label">Player 1</h3>
              <h1 className="content-header-score">{this.props.player1Score}</h1>
            </div>
          </div>
          <div className="content-header-item">
            <div className="content-header-item-scorebox">
              <h4 className="content-header-item-label">Ties</h4>
              <h1 className="content-header-score-small">{this.props.ties}</h1>
            </div>
          </div>
          <div className={player2TurnIndicator}>
            <div className="content-header-token">
              <svg>
                <use xlinkHref={svgTokenPlayer2} />
              </svg>
            </div>
            <div className="content-header-item-scorebox">
              <h3 className="content-header-item-label">Player 2</h3>
              <h1 className="content-header-score">{this.props.player2Score}</h1>
            </div>
          </div>
        </div>
        <div className="content-main">
          <div id="tic-tac-toe-container">
            <div className="row">
              <Square id="a1" token={this.state.boardSelections[0]} player={this.state.boardSelections[0] === this.props.player1Token ? 'player1' : 'player2'} styling={this.state.winningCells[0]} onClick={() => this.playSpot(0)} />
              <Square id="a2" token={this.state.boardSelections[1]} player={this.state.boardSelections[1] === this.props.player1Token ? 'player1' : 'player2'} styling={this.state.winningCells[1]} onClick={() => this.playSpot(1)} />
              <Square id="a3" token={this.state.boardSelections[2]} player={this.state.boardSelections[2] === this.props.player1Token ? 'player1' : 'player2'} styling={this.state.winningCells[2]} onClick={() => this.playSpot(2)} />
            </div>
            <div className="row">
              <Square id="b1" token={this.state.boardSelections[3]} player={this.state.boardSelections[3] === this.props.player1Token ? 'player1' : 'player2'} styling={this.state.winningCells[3]} onClick={() => this.playSpot(3)} />
              <Square id="b2" token={this.state.boardSelections[4]} player={this.state.boardSelections[4] === this.props.player1Token ? 'player1' : 'player2'} styling={this.state.winningCells[4]} onClick={() => this.playSpot(4)} />
              <Square id="b3" token={this.state.boardSelections[5]} player={this.state.boardSelections[5] === this.props.player1Token ? 'player1' : 'player2'} styling={this.state.winningCells[5]} onClick={() => this.playSpot(5)} />
            </div>
            <div className="row">
              <Square id="c1" token={this.state.boardSelections[6]} player={this.state.boardSelections[6] === this.props.player1Token ? 'player1' : 'player2'} styling={this.state.winningCells[6]} onClick={() => this.playSpot(6)} />
              <Square id="c2" token={this.state.boardSelections[7]} player={this.state.boardSelections[7] === this.props.player1Token ? 'player1' : 'player2'} styling={this.state.winningCells[7]} onClick={() => this.playSpot(7)} />
              <Square id="c3" token={this.state.boardSelections[8]} player={this.state.boardSelections[8] === this.props.player1Token ? 'player1' : 'player2'} styling={this.state.winningCells[8]} onClick={() => this.playSpot(8)} />
            </div>
          </div>
        </div>
        <div className="content-footer">
          {pauseResumeButton}
          <svg onClick={() => this.resetGame()} className="footer-icon">
            <use xlinkHref='#restart' />
          </svg>
        </div>
      </div>

    );
  }
};

export default Board;
