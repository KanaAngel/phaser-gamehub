var spacebar;

class TitleScreen extends Phaser.Scene {

  constructor () {
    super({ key: 'title' });
  }

  preload () {
    scene = this;
  }

  create () {
    console.log(this);
    this.add.text(this.game.canvas.width / 2, this.game.canvas.height / 3, "Game of Life RPG", { font: 'bold 26px Consolas' }).setOrigin(0.5);
    this.add.text(this.game.canvas.width / 2, this.game.canvas.height * 2 / 3, "Press SPACE to begin...", { font: '14px Consolas' }).setOrigin(0.5);

    spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  update () {
    if (Phaser.Input.Keyboard.JustDown(spacebar)) {
      this.scene.start('world');
    }
  }
}

class EndScreen extends Phaser.Scene {

  constructor () {
    super({ key: 'end' });
  }

  preload () {
    scene = this;
  }

  create () {
    console.log(this);
    this.add.text(this.game.canvas.width / 2, this.game.canvas.height / 3, "Game of Life RPG", { font: 'bold 26px Consolas' }).setOrigin(0.5);
    this.add.text(this.game.canvas.width / 2, this.game.canvas.height * 2 / 3, "Thanks for playing!", { font: 'bold 14px Consolas' }).setOrigin(0.5);
    this.add.text(this.game.canvas.width / 2, (this.game.canvas.height * 2 / 3) + 30, "You can press SPACE to return to the title screen.", { font: '14px Consolas' }).setOrigin(0.5);

    spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  update () {
    if (Phaser.Input.Keyboard.JustDown(spacebar)) {
      this.scene.start('title');
    }
  }
}

class WorldScreen extends Phaser.Scene {
  constructor () {
    super({ key: 'world' });
  }

  initialize () {
    console.log("Loaded main scene.");
  }

  preload () {
    this.load.spritesheet('terrain', 'assets/sprites/terrain.png', { frameWidth: 16, frameHeight: 16 });
    scene = this;
  }

  worldObj () {
    world = new Array(worldSize);
    for (var i = 0; i < worldSize; i++) {
      world[i] = new Array(worldSize);
      for (var j = 0; j < worldSize; j++) {
        world[i][j] = 0;
      }
    }
  }

  newTerrain (threshold = 0.5) {
    for (var i = 0; i < worldSize; i++)
      for (var j = 0; j < worldSize; j++) {
        if (Math.random() > threshold) world[i][j] = 0; // 1 = land
        else world[i][j] = 1; // 0 = water
      }
  }

  renderTerrain () {
    for (var i = 0; i < worldSize; i++)
      for (var j = 0; j < worldSize; j++) {
        if (world[i][j] == 1) this.createTerrainAt(i, j);
        else this.createWaterAt(i, j);
      }
  }

  createTerrainAt (x, y) {
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

    var sprite = this.add.image((x*32)+16, (y*32)+16, 'terrain', spriteIndex);
    sprite.scale = 2;
  }

  createWaterAt (x, y) {
    var sprite = this.add.image((x*32)+16, (y*32)+16, 'terrain', 0);
    sprite.scale = 2;
  }

  nextGeneration () {
    var liveCells = 1;

    generation++;
    if (generation == 0) {
      this.worldObj();
      this.newTerrain();
    } else {
      console.log("Making new generation " + generation);

      var newWorld = world;
      this.renderTerrain();

      liveCells = 0;

      for (var i = 0; i < worldSize; i++)
        for (var j = 0; j < worldSize; j++) {
          var liveNeighbours = 0;
          for (var l = -1; l <= 1; l++) {
            if (i + l < 0 || i + l > worldSize - 1) continue;
            for (var m = -1; m <= 1; m++) {
              if (j + m < 0 || j + m > worldSize - 1) continue;
              liveNeighbours += world[i + l][j + m];
            }
          }

          liveNeighbours -= world[i][j];

          console.log(liveNeighbours);

          if (world[i][j] == 1) {
            if (liveNeighbours < 2) newWorld[i][j] = 0;
            if (liveNeighbours > 3) newWorld[i][j] = 0;
          }
          else if (liveNeighbours == 3) newWorld[i][j] = 1;

          liveCells += newWorld[i][j];
        }

      world = newWorld;

      setTimeout(() => {
        this.renderTerrain();
      }, 1000);
    }

    if (liveCells > 0) setTimeout(() => { this.scene.start('game'); }, (generation == 0) ? 2000 : 4000);
    else {
      generation = -1; // Reset the game.
      setTimeout(() => { this.scene.start('end'); }, 5000);
    }
  }

  create () {
    this.nextGeneration();
    this.renderTerrain();
  }

}

class GameScreen extends Phaser.Scene {

  constructor () {
    super({ key: 'game' });
  }

  preload () {
    this.load.spritesheet('characters', 'assets/sprites/characters.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('terrain', 'assets/sprites/terrain.png', { frameWidth: 16, frameHeight: 16 });
    scene = this;
  }

  create () {
    this.running = true;

    this.cameras.main.setBounds(0, 0, worldSize * 64 - 8, worldSize * 64 - 8);

    this.physics.world.setBounds(0, 0, worldSize * 64, worldSize * 64)

    this.player = this.physics.add.image(64, 64, 'characters', 0);
    this.player.setCollideWorldBounds(true);
    this.player.onWorldBounds = true;
    this.player.setDepth(100);

    this.objectiveTracker = this.add.image(64, 64, 'characters', 3);
    this.objectiveTracker.setScale(2);
    this.objectiveTracker.setDepth(101);

    this.objective = this.physics.add.image(Math.random() * (worldSize * 64), Math.random() * (worldSize * 64), 'characters', 4);
    this.objective.setDepth(102);

    this.physics.add.overlap(this.player, this.objective, this.endGeneration);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
    this.cameras.main.setZoom(4);

    this.timeLastFrameUpdate = Date.now();

    this.renderWorld();
  }

  update () {
    if (!this.running) return;

    var moving = false;

    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.player.x -= 1;
      moving = true;
    }
    else if (this.cursors.right.isDown) {
      this.player.x += 1;
      moving = true;
    }

    // Vertical movement
    if (this.cursors.down.isDown) {
      this.player.y += 1;
      moving = true;
    }
    else if (this.cursors.up.isDown) {
      this.player.y -= 1;
      moving = true;
    }

    this.objectiveTracker.x = this.player.x;
    this.objectiveTracker.y = this.player.y;
    this.objectiveTracker.rotation = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.objective.x, this.objective.y);

    this.player.chunkPosition = { x: Math.floor((this.player.x + 8) / 64), y: Math.floor((this.player.y + 8) / 64) };
    if (this.player.chunkPosition.x < 0) this.player.chunkPosition.x = 0;
    if (this.player.chunkPosition.y < 0) this.player.chunkPosition.y = 0;
    if (this.player.chunkPosition.x > worldSize - 1) this.player.chunkPosition.x = worldSize - 1;
    if (this.player.chunkPosition.y > worldSize - 1) this.player.chunkPosition.y = worldSize - 1;

    if (moving) {
      if (world[this.player.chunkPosition.x][this.player.chunkPosition.y] == 0) this.player.setFrame(1);
      else this.player.setFrame(0);

      if (Date.now() - this.timeLastFrameUpdate > 500) {
        this.timeLastFrameUpdate = Date.now();
        this.player.scaleX *= -1;
      }
    }
  }

  renderWorld () {
    for (var i = 0; i < worldSize; i++)
      for (var j = 0; j < worldSize; j++) {
        this.renderChunkAt(i, j);
      }
  }

  renderChunkAt (x, y) {
    var state = world[x][y];

    if (state == 0) {
      for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++) {
          this.add.image((x * 64) + (i * 16), (y * 64) + (j * 16), 'terrain', 0);
        }
    } else {
      for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++) {
          var variant = 12 + Math.floor(Math.random() * 3);
          this.add.image((x * 64) + (i * 16), (y * 64) + (j * 16), 'terrain', variant);
        }
    }
  }

  endGeneration() {
    scene.doTheEndThing();
  }

  doTheEndThing() {
    this.objective.destroy();
    this.running = false;

    console.log("Next generation...");
    console.log(this.scene);
    setTimeout(() => { this.scene.start('world'); }, 2000);
  }
}

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 480,
  parent: 'gameContainer',
  scene: [TitleScreen, WorldScreen, GameScreen, EndScreen],
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

var game = new Phaser.Game(config);
var scene;

var worldSize = 25;
var generation = -1;
var world = [];
