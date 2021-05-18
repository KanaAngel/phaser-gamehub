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

var worldSize = 25;

var world = [];

function preload() {
  console.log("preload()");
  var texture = this.load.spritesheet('terrain', 'assets/sprites/terrain.png', { frameWidth: 16, frameHeight: 16 });
  console.log(texture);

  scene = this;
}

function create() {
  worldObj();
  newTerrain();
}

function worldObj() {
  world = new Array(worldSize);
  for (var i = 0; i < worldSize; i++) {
    world[i] = new Array(worldSize);
    for (var j = 0; j < worldSize; j++) {
      world[i][j] = 0;
    }
  }
}

function newTerrain(threshold = 0.5) {
  console.log("newTerrain()");

  for (var i = 0; i < worldSize; i++)
    for (var j = 0; j < worldSize; j++) {
      if (Math.random() > threshold) world[i][j] = 0; // 1 = land
      else world[i][j] = 1; // 0 = water
    }

  renderTerrain();
}

function renderTerrain() {
  console.log("renderTerrain()");

  for (var i = 0; i < worldSize; i++)
    for (var j = 0; j < worldSize; j++) {
      if (world[i][j] == 1) createTerrainAt(i, j);
      else createWaterAt(i, j);
    }
}

function createTerrainAt(x, y) {
  var spriteIndex = 0;

  if (x < 1 || y < 1 || x > worldSize - 1 || y > worldSize - 1) {
    spriteIndex = 6;
  } else {
    var left = world[x - 1][y];
    var top = world[x][y + 1];
    var right = world[x + 1][y];
    var bottom = world[x][y - 1];

    var combinedValue = left + top + right + bottom;

    if (combinedValue > 1) {
      spriteIndex = 6;
    } else {
      if (top > 0)
      if (left > 0)
    }

    console.log(spriteIndex);
  }

  var sprite = scene.add.image((x*32)+16, (y*32)+16, 'terrain', spriteIndex);
  sprite.scale = 2;
}

function createWaterAt(x, y) {
  var sprite = scene.add.image((x*32)+16, (y*32)+16, 'terrain', 0);
  sprite.scale = 2;
}

function update() {

}
