function loadHighScores() {
  removeAllNodes();
  addHighScores();
}

function loadHighScores2P() {
  removeAllNodes2P();
  addHighScores2P();
}

function removeAllNodes(){
  var highScoreList = document.getElementById("high-score-list");
  while (highScoreList.firstChild) {
    highScoreList.removeChild(highScoreList.firstChild);
  }
}

function removeAllNodes2P(){
  var highScoreList = document.getElementById("high-score-list-double");
  while (highScoreList.firstChild) {
    highScoreList.removeChild(highScoreList.firstChild);
  }
}

function addHighScores(){
  var highScoreList = document.getElementById("high-score-list");
  var scores = localStorage.getItem('high-scores');
  if (scores) {
    scores = scores.split(" ");
    scores.forEach(function(score){
      var scoreElement = document.createElement("li");
      scoreElement.innerHTML = score;
      highScoreList.appendChild(scoreElement);
    });
  }
}

function addHighScores2P(){
  var highScoreList = document.getElementById("high-score-list-double");
  var scores = localStorage.getItem('high-scores-2p');
  if (scores) {
    scores = scores.split(" ");
    scores.forEach(function(score){
      var scoreElement = document.createElement("li");
      scoreElement.innerHTML = score;
      highScoreList.appendChild(scoreElement);
    });
  }
}

function recordScore(game){
  var scores = localStorage.getItem('high-scores');
  if (scores) {
    insertScore(scores, game.dino.points);
  } else {
    localStorage.setItem('high-scores', game.dino.points);
  }
}

function recordScore2P(game, winner){
  var scores = localStorage.getItem('high-scores-2p');
  if (scores) {
    insertScore2P(scores, winner.points);
  } else {
    localStorage.setItem('high-scores-2p', winner.points);
  }
}


function insertScore(scores, score) {
  var scoresArr = scores.split(" ");
  for(var i=0; i < scoresArr.length; i++) {
    if (score > scoresArr[i]) {
      scoresArr.splice(i, 0, score);
      break;
    }
  }
  if (score <= scoresArr[scoresArr.length-1]) {scoresArr.push(score);}
  localStorage.setItem('high-scores', scoresArr.slice(0, 10).join(" "));
}

function insertScore2P(scores, score) {
  var scoresArr = scores.split(" ");
  for(var i=0; i < scoresArr.length; i++) {
    if (score > scoresArr[i]) {
      scoresArr.splice(i, 0, score);
      break;
    }
  }
  if (score <= scoresArr[scoresArr.length-1]) {scoresArr.push(score);}
  localStorage.setItem('high-scores-2p', scoresArr.slice(0, 10).join(" "));
}

module.exports.loadHighScores = loadHighScores;
module.exports.loadHighScores2P = loadHighScores2P;
module.exports.recordScore = recordScore;
module.exports.recordScore2P = recordScore2P;
module.exports.insertScore = insertScore;
module.exports.insertScore2P = insertScore2P;
