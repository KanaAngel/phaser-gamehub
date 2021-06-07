var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 480,
  parent: 'gameContainer',
  scene: [mainScene],
  render: {
    antialias: false,
    antialiasGL: false,
    pixelArt: true,
    roundPixels: true,
    clearBeforeRender: true,
    mipmapFilter: 'NEAREST'
  }
}

var game = new Phaser.Game(config);
Phaser.Scene.call(this, mainScene);

var scene;

var worldSize = 25;

var world = [];
