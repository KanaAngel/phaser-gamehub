export default class EndScene extends Phaser.Scene {
  constructor () {
    super({ key: 'end' });
  }

  preload () {
    scene = this;
  }

  create () {
    this.add.text(this.game.canvas.width / 2, this.game.canvas.height / 3, "Game of Life RPG", { font: 'bold 26px Consolas' }).setOrigin(0.5);
    this.add.text(this.game.canvas.width / 2, this.game.canvas.height * 2 / 3, "Thanks for playing!", { font: 'bold 14px Consolas' }).setOrigin(0.5);
    this.add.text(this.game.canvas.width / 2, (this.game.canvas.height * 2 / 3) + 30, "You can press SPACE to return to the title screen.", { font: '14px Consolas' }).setOrigin(0.5);

    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  update () {
    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      this.scene.start('title');
    }
  }
}
