# Bubble Bobble

### Team

* [Erinna Chen](https://github.com/erinnachen)
* [Adrienne Domingus](https://github.com/adriennedomingus)

### The Stack

* JavaScript
* HTML5 canvas
* Webpack
* Express
* LocalStorage
* Mocha/Chai

### Single Player mode

A single player plays as Bob the friendly dinosaur. He must capture all of the windups with his bubbles. In order to move on to the next level, he pops the bubbles and collects the fruits they produce for points.

![Gif](http://g.recordit.co/u35EwWHzXw.gif)

### Two Player Battle Zone

Two players can battle each other in the battle zone, using the same keyboard. One plays Bob (in green), and the other plays Bub (in blue). If either player runs out of lives, they lose and the game ends. Otherwise, the first player to 10,000 points wins.

### Testing

Unit tests were written using Chai. They can be run by cloning down the project, running `npm install` and `npm start`, and then visiting `http://localhost:8080/webpack-dev-server/test.html`

### Production

Play the game for yourself [here](http://bubble-bobble-redux.herokuapp.com/) or find a friend and give battle mode a shot!

### The Original
* [Here's](https://www.youtube.com/watch?v=O49OgQ_kogw&t=1m2s) a YouTube video of someone really excellent playing
* And [here](http://www.8bbit.com/play/bubble-bobble/156) is where you can play the original 8bit yourself.

### Our Take

We tried to maintain the original feel of the game by keeping the characters 8bit, adding traditional background music, etc. We also maintained traditional features such as Bob's ability to jump up through a wall, but lands on top of it (cannot fall through a wall). Our version has a limited number of levels (compared to the original's 200+)   
  ** Note: Bob and Bub are dragons in the original Bubble Bobble, but they're friendly neighborhood dinosaur's in ours!
