export default class GameScene extends Phaser.Scene {

  constructor () {
    super({ key: 'game' });
    this.worldSize = gameSettings.worldSize;
  }

  preload () {
    this.load.spritesheet('characters', 'assets/sprites/characters.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('terrain', 'assets/sprites/terrain.png', { frameWidth: 16, frameHeight: 16 });

    scene = this;
  }

  create () {
    this.running = true;

    this.cameras.main.setBounds(0, 0, this.worldSize * 64 - 8, this.worldSize * 64 - 8);
    this.physics.world.setBounds(0, 0, this.worldSize * 64, this.worldSize * 64);

    this.player = this.physics.add.image(64, 64, 'characters', 0);
    this.player.setCollideWorldBounds(true);
    this.player.onWorldBounds = true;
    this.player.setDepth(100);

    this.objectiveTracker = this.add.image(64, 64, 'characters', 3);
    this.objectiveTracker.setScale(2);
    this.objectiveTracker.setDepth(101);

    this.objective = this.physics.add.image(Math.random() * (this.worldSize * 64), Math.random() * (this.worldSize * 64), 'characters', 4);
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
    if (this.player.chunkPosition.x > this.worldSize - 1) this.player.chunkPosition.x = this.worldSize - 1;
    if (this.player.chunkPosition.y > this.worldSize - 1) this.player.chunkPosition.y = this.worldSize - 1;

    if (moving) {
      if (game.world[this.player.chunkPosition.x][this.player.chunkPosition.y] == 0) this.player.setFrame(1);
      else this.player.setFrame(0);

      if (Date.now() - this.timeLastFrameUpdate > 500) {
        this.timeLastFrameUpdate = Date.now();
        this.player.scaleX *= -1;
      }
    }
  }

  renderWorld () {
    for (var i = 0; i < this.worldSize; i++)
      for (var j = 0; j < this.worldSize; j++) {
        this.renderChunkAt(i, j);
      }
  }

  renderChunkAt (x, y) {
    var state = game.world[x][y];

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
