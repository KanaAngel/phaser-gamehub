var space;
var mainScene = new Phaser.Class({
  initialize: function() {
    console.log("Loaded main scene.");
  },
  preload: function() {
    this.load.spritesheet('terrain', 'assets/sprites/terrain.png', { frameWidth: 16, frameHeight: 16 });
    scene = this;
  },
  update: function () {

  },
  create: function () {
    worldObj();
    newTerrain();

    addInputEvents();
  }
});

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
  for (var i = 0; i < worldSize; i++)
    for (var j = 0; j < worldSize; j++) {
      if (Math.random() > threshold) world[i][j] = 0; // 1 = land
      else world[i][j] = 1; // 0 = water
    }

  renderTerrain();
}

function renderTerrain() {
  for (var i = 0; i < worldSize; i++)
    for (var j = 0; j < worldSize; j++) {
      if (world[i][j] == 1) createTerrainAt(i, j);
      else createWaterAt(i, j);
    }
}

function createTerrainAt(x, y) {
  var spriteIndex = 0;

  var left = x == 0 || world[x - 1][y] == 1;
  var top = y == 0 || world[x][y - 1] == 1;
  var right = x == worldSize - 1 || world[x + 1][y] == 1;
  var bottom = y == worldSize - 1 || world[x][y + 1] == 1;

  var combinedValue = left + top + right + bottom;

  if (!left && !top && !right && !bottom) spriteIndex = 1;
  if (!left && top && !right && !bottom) spriteIndex = 2;
  if (left && !top && !right && !bottom) spriteIndex = 3;
  if (!left && !top && right && !bottom) spriteIndex = 4;
  if (!left && !top && !right && bottom) spriteIndex = 5;
  if (combinedValue > 2 || (top && bottom) || (left && right)) spriteIndex = 6;
  if (left && top && !right && !bottom) spriteIndex = 7;
  if (!left && top && right && !bottom) spriteIndex = 8;
  if (!left && !top && right && bottom) spriteIndex = 9;
  if (left && !top && !right && bottom) spriteIndex = 10;

  if (spriteIndex == 0) spriteIndex = 1;

  var sprite = scene.add.image((x*32)+16, (y*32)+16, 'terrain', spriteIndex);
  sprite.scale = 2;
}

function createWaterAt(x, y) {
  var sprite = scene.add.image((x*32)+16, (y*32)+16, 'terrain', 0);
  sprite.scale = 2;
}

function addInputEvents() {
  var spaceInput = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
}
