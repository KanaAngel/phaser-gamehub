var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 480,
  parent: 'gameContainer',
  scene: {
    preload: preload,
    create: create,
    update: update
  },
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
var scene;

function preload() {
  console.log("preload()");
  var texture = this.load.spritesheet('terrain', 'assets/sprites/terrain.png', { frameWidth: 16, frameHeight: 16 });
  console.log(texture);

  scene = this;
}

function create() {
  newTerrain();
}

function newTerrain(threshold = 0.5) {
  console.log("newTerrain()");
  for (var i = 0; i < 25; i++)
    for (var j = 0; j < 15; j++) {
      if (Math.random() > threshold) createTerrainAt(i, j);
      else createWaterAt(i, j);
    }
}

function createTerrainAt(x, y) {
  var sprite = scene.add.image((x*32)+16, (y*32)+16, 'terrain', 0);
  sprite.scale = 2;
}

function createWaterAt(x, y) {
  var sprite = scene.add.image((x*32)+16, (y*32)+16, 'terrain', 1);
  sprite.scale = 2;
}

function update() {

}
