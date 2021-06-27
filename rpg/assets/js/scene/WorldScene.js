export default class WorldScene extends Phaser.Scene {
  constructor () {
    super({ key: 'world' });
    this.worldSize = gameSettings.worldSize;
  }

  preload () {
    this.load.spritesheet('terrain', 'assets/sprites/terrain.png', { frameWidth: 16, frameHeight: 16 });

    scene = this;
  }

  worldObj () {
    game.world = new Array(this.worldSize);
    for (var i = 0; i < this.worldSize; i++) {
      game.world[i] = new Array(this.worldSize);
      for (var j = 0; j < this.worldSize; j++) {
        game.world[i][j] = 0;
      }
    }
  }

  newTerrain (threshold = 0.1) {
    for (var i = 0; i < this.worldSize; i++)
      for (var j = 0; j < this.worldSize; j++) {
        if (Math.random() > threshold) game.world[i][j] = 0; // 0 = water
        else game.world[i][j] = 1; // 1 = land
      }
  }

  renderTerrain () {
    for (var i = 0; i < this.worldSize; i++)
      for (var j = 0; j < this.worldSize; j++) {
        if (game.world[i][j] == 1) this.createTerrainAt(i, j);
        else this.createWaterAt(i, j);
      }
  }

  createTerrainAt (x, y) {
    var spriteIndex = 0;

    var left = x == 0 || game.world[x - 1][y] == 1;
    var top = y == 0 || game.world[x][y - 1] == 1;
    var right = x == this.worldSize - 1 || game.world[x + 1][y] == 1;
    var bottom = y == this.worldSize - 1 || game.world[x][y + 1] == 1;

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

    var sprite = this.add.image((x*32)+16, (y*32)+16, 'terrain', spriteIndex);
    sprite.scale = 2;
  }

  createWaterAt (x, y) {
    var sprite = this.add.image((x*32)+16, (y*32)+16, 'terrain', 0);
    sprite.scale = 2;
  }

  nextGeneration () {
    var liveCells = 1;

    game.generation++;
    if (game.generation == 0) {
      this.worldObj();
      this.newTerrain();
    } else {
      console.log("Making new generation " + game.generation);

      var newWorld = game.world;
      this.renderTerrain();

      liveCells = 0;

      for (var i = 0; i < this.worldSize; i++)
        for (var j = 0; j < this.worldSize; j++) {
          var liveNeighbours = 0;
          for (var l = -1; l <= 1; l++) {
            if (i + l < 0 || i + l > this.worldSize - 1) continue;
            for (var m = -1; m <= 1; m++) {
              if (j + m < 0 || j + m > this.worldSize - 1) continue;
              liveNeighbours += game.world[i + l][j + m];
            }
          }

          liveNeighbours -= game.world[i][j];

          if (game.world[i][j] == 1) {
            if (liveNeighbours < 2) newWorld[i][j] = 0;
            if (liveNeighbours > 3) newWorld[i][j] = 0;
          }
          else if (liveNeighbours == 3) newWorld[i][j] = 1;

          liveCells += newWorld[i][j];
        }

      game.world = newWorld;

      setTimeout(() => {
        this.renderTerrain();
      }, 1000);
    }

    if (liveCells > 0) setTimeout(() => { this.scene.start('game'); }, (game.generation == 0) ? 2000 : 4000);
    else {
      game.generation = -1; // Reset the game.
      setTimeout(() => { this.scene.start('end'); }, 5000);
    }
  }

  create () {
    this.nextGeneration();
    this.renderTerrain();
  }

}
