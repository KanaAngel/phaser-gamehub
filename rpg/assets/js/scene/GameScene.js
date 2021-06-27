export default class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: 'game' });
    this.worldSize = gameSettings.worldSize;
  }

  preload () {
    // Load sprites.
    this.load.spritesheet('characters', 'assets/sprites/characters.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('terrain', 'assets/sprites/terrain.png', { frameWidth: 16, frameHeight: 16 });

    // Set scene variable for reference.
    scene = this;
  }

  create () {
    this.cameras.main.setBounds(0, 0, this.worldSize * 64 - 8, this.worldSize * 64 - 8);
    this.physics.world.setBounds(0, 0, this.worldSize * 64, this.worldSize * 64);

    // Determine a spawnpoint.
    var spawnpoint = getSpawnpoint();

    // Spawn the player at the spawnpoint.
    this.player = this.physics.add.image(spawnpoint.x, spawnpoint.y, 'characters', 0);
    this.player.setCollideWorldBounds(true);
    this.player.onWorldBounds = true;
    this.player.setDepth(100);

    // Spawn the objective tracker at the spawnpoint.
    this.objectiveTracker = this.add.image(spawnpoint.x, spawnpoint.y, 'characters', 3);
    this.objectiveTracker.setScale(2);
    this.objectiveTracker.setDepth(101);

    // Randomly spawn the objective.
    this.objective = this.physics.add.image(Math.random() * ((this.worldSize - 1) * 64) + 64, Math.random() * ((this.worldSize - 1) * 64) + 64, 'characters', 4);
    this.objective.setDepth(102);

    // Add overlap logic for the objective.
    this.physics.add.overlap(this.player, this.objective, this.endGeneration);

    // Add ipnut for the player
    this.cursors = this.input.keyboard.createCursorKeys();
    this.attack = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

    this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
    this.cameras.main.setZoom(4);

    this.timeLastFrameUpdate = Date.now();

    // Render the world with sprites.
    this.renderWorld();

    // Enable the game loop AFTER initializing.
    this.running = true;
  }

  // Finds the first suitable spawn chunk, and returns its midpoint.
  getSpawnpoint() {
    for (var i = 0; i < this.worldSize; i++)
      for (var j = 0; j < this.worldSize; j++) {
        if (game.world[i][j] == 1) return { x: (i * 64) + 32, y: (j * 64) + 32 };
      }
  }

  update () {
    // Do not run if the game loop is stopped.
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

    // Attacks
    if (Phaser.Input.Keyboard.JustDown(this.attack)) {
      console.log("Attack!");
    }

    // Synchronize objective tracker position.
    this.objectiveTracker.x = this.player.x;
    this.objectiveTracker.y = this.player.y;
    this.objectiveTracker.rotation = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.objective.x, this.objective.y);

    // Update the player's chunk position.
    this.player.chunkPosition = { x: Math.floor((this.player.x + 8) / 64), y: Math.floor((this.player.y + 8) / 64) };
    if (this.player.chunkPosition.x < 0) this.player.chunkPosition.x = 0;
    if (this.player.chunkPosition.y < 0) this.player.chunkPosition.y = 0;
    if (this.player.chunkPosition.x > this.worldSize - 1) this.player.chunkPosition.x = this.worldSize - 1;
    if (this.player.chunkPosition.y > this.worldSize - 1) this.player.chunkPosition.y = this.worldSize - 1;

    // If it's time for another frame update...
    if (Date.now() - this.timeLastFrameUpdate > 500) {
      // Change the sprite to on land
      if (game.world[this.player.chunkPosition.x][this.player.chunkPosition.y] == 0) this.player.setFrame(1);
      else this.player.setFrame(0);

      // If the player is moving...
      if (moving) {
        // Do the fun little step animation. (Temporary)
        this.player.scaleX *= -1;
      }
    }
  }

  // Loop through the world and add chunks.
  renderWorld () {
    for (var i = 0; i < this.worldSize; i++)
      for (var j = 0; j < this.worldSize; j++) {
        this.renderChunkAt(i, j);
      }
  }

  // Render a 4x4 chunk based on the chunk's terrain.
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

  // End the current generation.
  endGeneration() {
    scene.doTheEndThing();
  }

  // Go back to the world screen to start the next generation.
  doTheEndThing() {
    this.objective.destroy();
    this.running = false;

    console.log("Next generation...");
    console.log(this.scene);
    setTimeout(() => { this.scene.start('world'); }, 2000);
  }
}
