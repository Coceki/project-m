class bootscene extends Phaser.Scene {

    constructor() {
        super('bootscene');
    }

    preload() {

    }

    create() {
        const self = this;
        console.log("boot");
        var titleText = this.add.text(960, 100, '测试用', { fontSize: '40px', fontFamily: 'Georgia', fill: '#FFF' }).setOrigin(0.5);
        var startText = this.add.text(960, 400, '开始', { fontSize: '36px', fontFamily: 'Georgia', fill: '#FFF' }).setOrigin(0.5);
        startText.inputEnabled = true;
        startText.setInteractive();
        startText.on("pointerup", this.gameStart, this)
    }
    gameStart() {
        this.scene.start("playscene");
    }
}