window.gameSettings = {
  worldSize: 25
};

window.scene = {};

import TitleScene from "./assets/js/scene/TitleScene.js";
import GameScene from "./assets/js/scene/GameScene.js";
import WorldScene from "./assets/js/scene/WorldScene.js";
import EndScene from "./assets/js/scene/EndScene.js";

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 480,
  parent: 'gameContainer',
  scene: [TitleScene, WorldScene, GameScene, EndScene],
  render: {
    antialias: false,
    antialiasGL: false,
    pixelArt: true,
    roundPixels: true,
    clearBeforeRender: true,
    mipmapFilter: 'NEAREST'
  },
  physics: {
    default: 'arcade'
  }
}

window.game = new Phaser.Game(config);
game.generation = -1;
