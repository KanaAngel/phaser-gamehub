var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 450,
  parent: 'gameContainer',
  scene: {
    preload: preload,
    create: create
  }
}

var game = new Phaser.Game(config);

function preload() {
  console.log("preload()");
}

function create() {
  console.log("create()");
}
