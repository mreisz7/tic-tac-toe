import React, { Component } from 'react';
import logo from './Signature.png';
import './App.css';
import Board from './Board';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player1IsComputer: false,
      player2IsComputer: true,
      player1IsX: true,
      player1Score: 0,
      player2Score: 0,
      ties: 0,
      currentView: 'payer-select'
    };
  }

  resetGame = (token) => {
    this.setState({
      player1Score: 0,
      player2Score: 0,
      ties: 0,
      currentView: 'payer-select'
    });
  }

  toggleToken = () => {
    this.setState({ player1IsX: !this.state.player1IsX });
  }

  setPlayerType = (player, isComputer) => {
    if (player === 'Player1') {
      this.setState({ player1IsComputer: isComputer });
    } else {
      this.setState({ player2IsComputer: isComputer });
    }
  }

  incrementScore = (player) => {
    if (player === 'Player1') {
      this.setState({ player1Score: this.state.player1Score + 1 });
    } else if (player === 'Player2') {
      this.setState({ player2Score: this.state.player2Score + 1 });
    } else {
      this.setState({ ties: this.state.ties + 1 });
    }
  }

  nextView = () => {
    if (this.state.currentView === 'payer-select' && 
        this.state.player1IsComputer !== null && 
        this.state.player2IsComputer !== null) {
          this.setState({currentView: 'token-select'});
        }
    else if (this.state.currentView === 'token-select') {
      this.setState({currentView: 'game-view'});
    }
    else if (this.state.currentView === 'game-view') {
      this.setState({currentView: 'payer-select'});
    }
  }
  
  render() {
    const playersSelected = (this.state.player1IsComputer !== null && this.state.player2IsComputer !== null) ? (
      <svg onClick={() => this.nextView()} className="next-arrow">
        <use xlinkHref="#next" />
      </svg>
    ) : (
      <svg onClick={() => this.nextView()} className="next-arrow disabled">
        <use xlinkHref="#next" />
      </svg>
    );

    const player1Token = (this.state.player1IsX) ? 'x' : 'o';
    const player2Token = (this.state.player1IsX) ? 'o' : 'x';

    const boardDisplay = (this.state.currentView === 'game-view' && this.state.player1Score < 10 && this.state.player2Score < 10) ? (
      <Board player1Token={player1Token} player1Score={this.state.player1Score} player1IsComputer={this.state.player1IsComputer} player2Token={player2Token} player2Score={this.state.player2Score} player2IsComputer={this.state.player2IsComputer} ties={this.state.ties} incrementScore={this.incrementScore}  resetGame={this.resetGame} />
    ) : (
      null
    );

    const winner = (this.state.player1Score >= 10 || this.state.player2Score >= 10) ? (
      <div>
        <h1>{this.state.player1Score > this.state.player2Score ? 'Player 1 Wins' : 'Player 2 Wins'}</h1>
        <h3 className="pointer" onClick={() => this.resetGame()}>Play Again?</h3>
      </div>
    ) : (
      null
    );

    return (
    <div id="app">
      <div id="header-logo">
        <svg>
          <use xlinkHref="#MRLogo" />
        </svg>
      </div>
      <div id="content-container" className={this.state.currentView}>
        {/* Player Select */}
        <div className="content-section">
          <div className="content-wrapper">
            <div className="content-header">
              <h1>Select Players</h1>
            </div>
            <div className="content-main">
              <div className="content-left">
                <h2 className="content-main-label">Player 1</h2>
                <div className={['player-selection', (this.state.player1IsComputer === false) ? 'player1' : ''].join(' ')} onClick={() => this.setPlayerType('Player1', false)}>
                  <svg>
                    <use xlinkHref="#person" />
                  </svg>
                </div>
                <div className={['player-selection', (this.state.player1IsComputer) ? 'player1' : ''].join(' ')} onClick={() => this.setPlayerType('Player1', true)}>
                  <svg>
                    <use xlinkHref="#computer" />
                  </svg>
                </div>
              </div>
              <div className="content-right">
                <h2 className="content-main-label">Player 2</h2>
                <div className={['player-selection', (this.state.player2IsComputer === false) ? 'player2' : ''].join(' ')} onClick={() => this.setPlayerType('Player2', false)}>
                  <svg>
                    <use xlinkHref="#person" />
                  </svg>
                </div>
                <div className={['player-selection', (this.state.player2IsComputer) ? 'player2' : ''].join(' ')} onClick={() => this.setPlayerType('Player2', true)}>
                  <svg>
                    <use xlinkHref="#computer" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="content-footer">
              {playersSelected}
            </div>
          </div>
        </div>
        {/* Token Select */}
        <div className="content-section">
          <div className="content-wrapper">
            <div className="content-header">
              <h1>Select Tokens</h1>
            </div>
            <div className="content-main">
              <div className="content-left">
                <h2 className="content-main-label">Player 1</h2>
                <div className="token-selection player1" onClick={() => this.toggleToken()}>
                  <svg>
                    <use xlinkHref={(this.state.player1IsX) ? "#token-x" : "#token-o"} />
                  </svg>
                </div>
              </div>
              <div className="content-right">
                <h2 className="content-main-label">Player 2</h2>
                <div className="token-selection player2" onClick={() => this.toggleToken()}>
                  <svg>
                    <use xlinkHref={(this.state.player1IsX) ? "#token-o" : "#token-x"} />
                  </svg>
                </div>
              </div>
            </div>
            <div className="content-footer">
              <svg onClick={() => this.nextView()} className="next-arrow">
                <use xlinkHref="#next" />
              </svg>
            </div>
          </div>
        </div>
        <div className="content-section">
          {boardDisplay}
          {winner}
        </div>
      </div>
      <span id="footer-copyright">&copy; 2018 Michael Reisz</span>
      <a href="https://www.mreisz.com" target="_blank" rel="noopener noreferrer">
        <img id="footer-logo" src={logo} alt="MReisz.com" />
      </a>
    </div>
    )
  }
};

export default App;
