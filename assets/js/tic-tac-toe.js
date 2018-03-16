
$(document).ready(function() {

  var game = new playSession();

  game.player1.selections = ['a1', 'a2'];
  game.player2.selections = ['b1', 'c2'];
  console.log("Available Selections: " + game.availableSelections().join(' '));
  console.log("Player 1 Next Move? " + game.player1.pickNextSpot());
  console.log("Player 2 Next Move? " + game.player2.pickNextSpot());

  // console.log("Player 1 Winner? " + game.player1.isAWinner());
  // console.log("Player 2 Winner? " + game.player2.isAWinner());

  // console.log("Should return false: " + game.isAWinner(['a1', 'a2', 'b2', 'c1']));
  // console.log("Should return false: " + game.isAWinner(['a1', 'a2']));
  // console.log("Should return false: " + game.isAWinner(['b1', 'b2', 'c3', 'c1']));
  // console.log("Should return true:  " + game.isAWinner(['a1', 'b1', 'b2', 'b3']));
  // console.log("Should return true:  " + game.isAWinner(['a1', 'b1', 'b3', 'c1']));
  // console.log("Should return true:  " + game.isAWinner(['c1', 'b2', 'a1', 'c3']));

});

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

function playSession() {

  var winningCombos = [['a1', 'a2', 'a3'],
                       ['b1', 'b2', 'b3'],
                       ['c1', 'c2', 'c3'],
                       ['a1', 'b1', 'c1'],
                       ['a2', 'b2', 'c2'],
                       ['a3', 'b3', 'c3'],
                       ['a1', 'b2', 'c3'],
                       ['a3', 'b2', 'c1']];

  function isAWinner(selections) {
    for (i = 0; i < winningCombos.length; i++) {
      if (selections.length >= 3 &&
        selections.includes(winningCombos[i][0]) &&
        selections.includes(winningCombos[i][1]) &&
        selections.includes(winningCombos[i][2])) {
          return true;
      }
    }
    return false;
  };

  function findNextSpot(player) {
    var playerSelections;
    var otherSelections;
    var openSelections = availableSelections;

    if (player = 1) {
      playerSelections = this.player1.selections;
      otherSelections = this.player2.selections;
    } else {
      playerSelections = this.player2.selections;
      otherSelections = this.player1.selections;
    }

    // Check if a single selection would win
    if (playerSelections.length >= 2) {
      for (i = 0; i < openSelections.length; i++) {
        var tempPlayerSelections = playerSelections;
        if (isAWinner(tempPlayerSelection.push(openSelections[i]))) {
          return openSelections[i];
        }
      }
    }

    // Check if the other player needs to be blocked from winning
    if (otherSelections.length >= 2) {
      for (i = 0; i < openSelections.length; i++) {
        var tempOtherSelections = otherSelections;
        if (isAWinner(tempOtherSelections.push(openSelections[i]))) {
          return openSelections[i];
        }
      }
    }

    // Return a random selection if nothing else
    return openSelections[Math.floor(Math.random() * Math.floor(openSelections.length))];
  }

  this.boardSelections = ['a1', 'a2', 'a3',
                          'b1', 'b2', 'b3',
                          'c1', 'c2', 'c3'];

  this.player1 = {
    player: 1,
    isComputer: false,
    icon: '',
    score: 0,
    selections: [],
    isAWinner: function() {
      return isAWinner(this.selections);
    },
    pickNextSpot: function() {
      findNextSpot(this.player);
    }
  };

  this.player2 = {
    player: 2,
    isComputer: false,
    icon: '',
    score: 0,
    selections: [],
    isAWinner: function() {
      return isAWinner(this.selections);
    }
  };

  this.availableSelections = function() {
    return this.boardSelections
      .diff(this.player1.selections)
      .diff(this.player2.selections);
  }

  this.startNewGame = function() {
    this.player1.selections = [];
    this.player2.selections = [];
  }

}
