var score = 0;
var seek = 0;
var combo = 0;
class playscene extends Phaser.Scene {

    constructor() {
        super('playscene');
        var music;
        var scoreText;
        var timeline;
        var comboText;
        var scanner = 0;
        var storyboard;
    }

    preload() {
        this.load.audio('music', '../audio/music/混乱 Confusion/混乱 Confusion.mp3');
        this.load.json('storyboard', '../audio/music/混乱 Confusion/storyboard.json');
    }

    create() {
        this.storyboard = this.cache.json.get("storyboard");
        this.music = this.sound.add('music');
        this.scoreText = this.add.text(1900, 60, '0000000', { fontSize: '40px', fontFamily: 'Georgia', fill: '#FFF' }).setOrigin(1);
        this.comboText = this.add.text(960, 60, combo, { fontSize: '40px', fontFamily: 'Georgia', fill: '#FFF' }).setOrigin(0.5);
        this.timeline = this.add.rectangle(0, 0, 0, 20, 0xFFFFFF).setOrigin(0, 0);
        var pausebtn = this.add.text(10, 60, '暂停', { fontSize: '40px', fontFamily: 'Georgia', fill: '#FFF' });
        pausebtn.inputEnabled = true;
        pausebtn.setInteractive();
        pausebtn.on("pointerup", this.gamePause, this);
        this.start();
    }
    start() {
        this.music.play();
        this.scanner = 0;
        // this.createNote("note", 0.5, 500, 200, 200, 100, 100);
        // this.createNote("static", 0.5, 500, 400, 400, 100, 100);
        // this.createNote("drop", 0.5, 500, 400, 0, 100, 100, 400, 400);/测试用
    }
    gamePause() {
        console.log("paused");
        this.scene.pause();
        this.music.pause();
    }
    update() {
        seek = this.music.seek;
        this.timeline.width = seek / this.music.duration * 1920;
        this.comboText.setText(combo);
        //console.log(seek, Math.floor(seek * 10) / 10);
        //console.log(this.storyboard.timeline, this.scanner);
        if (this.scanner < this.storyboard.timeline.length) {
            if (Math.abs(this.storyboard.timeline[this.scanner].startime - Math.floor(seek * 100) / 100) <= 0.2) {
                this.createNote(this.storyboard.timeline[this.scanner].type, this.storyboard.timeline[this.scanner].checktime, this.storyboard.timeline[this.scanner].duration, this.storyboard.timeline[this.scanner].x, this.storyboard.timeline[this.scanner].y, this.storyboard.timeline[this.scanner].x1, this.storyboard.timeline[this.scanner].y1, this.storyboard.timeline[this.scanner].x2, this.storyboard.timeline[this.scanner].y2);
                this.scanner += 1;
                for (; this.scanner < this.storyboard.timeline.length; this.scanner++) { //判断多押

                    if (this.storyboard.timeline[this.scanner].startime == this.storyboard.timeline[this.scanner - 1].startime) {
                        //console.log("match")
                        this.createNote(this.storyboard.timeline[this.scanner].type, this.storyboard.timeline[this.scanner].checktime, this.storyboard.timeline[this.scanner].duration, this.storyboard.timeline[this.scanner].x, this.storyboard.timeline[this.scanner].y, this.storyboard.timeline[this.scanner].x1, this.storyboard.timeline[this.scanner].y1, this.storyboard.timeline[this.scanner].x2, this.storyboard.timeline[this.scanner].y2);
                        //this.scanner += 1;
                        //console.log(this.storyboard.timeline.length, this.scanner);
                    } else {
                        break;
                    }
                }
            }
        }
        //console.log(this.timeline.width)

    }
    createNote(type, checkedTime, duration, x, y, x1, y1, x2, y2) { //note实现
        if (type == "note") { //点按note
            var noteOutline = this.add.rectangle(x, y, x1, y1);
            noteOutline.setStrokeStyle(2, 0xFFFFFF);
            var noteInside = this.add.rectangle(x, y, x1, y1, 0xFFFFFF);
            noteInside.depth = -this.scanner;
            noteInside.scale = 0.2;
            noteOutline.depth = -this.scanner;
            noteOutline.scale = 1.5;
            var timer = this.time.delayedCall(duration + 300, () => {
                noteInside.destroy();
                noteOutline.destroy();
                var missed = this.add.text(x, y, 'MISS', { fontSize: '40px', fontFamily: 'Georgia', fill: '#FF0000' }).setOrigin(0.5); //miss判定
                combo = 0; //combo归零
                this.time.delayedCall(500, () => {
                    missed.destroy(); //回收
                })
            }, );
            this.tweens.add({ //动画
                targets: noteOutline,
                alpha: { start: 0, to: 1 },
                scale: 1,
                angle: { start: 0, to: 90 },
                duration: duration,
                ease: 'Linear',
                repeat: 0,
                yoyo: false
            });
            this.tweens.add({
                targets: noteInside,
                alpha: { start: 0, to: 1 },
                scale: 1,
                angle: { start: 30, to: 90 },
                duration: duration,
                ease: 'Linear',
                repeat: 0,
                yoyo: false
            });
            this.tweens.add({
                targets: noteOutline,
                alpha: { start: 1, to: 0 },
                duration: 200,
                ease: 'Linear',
                repeat: 0,
                yoyo: false,
                delay: duration
            });
            this.tweens.add({
                targets: noteInside,
                alpha: { start: 1, to: 0 },
                duration: 200,
                ease: 'Linear',
                repeat: 0,
                yoyo: false,
                delay: duration
            });
            noteOutline.inputEnabled = true;
            noteOutline.setInteractive();
            noteOutline.on("pointerdown", function() {
                timer.remove();
                noteOutline.destroy();
                noteInside.destroy();
                var timeNow = this.music.seek;
                var textR;
                var outerR;
                console.log(timeNow, checkedTime)
                if (Math.abs(timeNow - checkedTime) <= 0.1) { //判定规则
                    textR = this.add.text(x, y, 'PERFECT', { fontSize: '40px', fontFamily: 'Georgia', fill: '#FFCC33' }).setOrigin(0.5);
                    outerR = this.add.rectangle(x, y, x1, y1);
                    outerR.setStrokeStyle(2, 0xFFCC33);
                    this.tweens.add({ //动画
                        targets: outerR,
                        alpha: { start: 1, to: 0 },
                        scale: 1.5,
                        angle: 90,
                        duration: 500,
                        ease: 'Linear',
                        repeat: 0,
                        yoyo: false
                    });
                } else if (Math.abs(timeNow - checkedTime) <= 0.5) {
                    textR = this.add.text(x, y, 'GOOD', { fontSize: '40px', fontFamily: 'Georgia', fill: '#00CCFF' }).setOrigin(0.5);
                    outerR = this.add.rectangle(x, y, x1, y1);
                    outerR.setStrokeStyle(2, 0x00CCFF);
                    this.tweens.add({ //动画
                        targets: outerR,
                        alpha: { start: 1, to: 0 },
                        scale: 1.5,
                        angle: 90,
                        duration: 500,
                        ease: 'Linear',
                        repeat: 0,
                    });
                } else {
                    textR = this.add.text(x, y, 'BAD', { fontSize: '40px', fontFamily: 'Georgia', fill: '#FF0033' }).setOrigin(0.5);
                    outerR = this.add.rectangle(x, y, x1, y1);
                    outerR.setStrokeStyle(2, 0xFF0033);
                    this.tweens.add({ //动画
                        targets: outerR,
                        alpha: { start: 1, to: 0 },
                        scale: 1.5,
                        angle: 90,
                        duration: 500,
                        ease: 'Linear',
                        repeat: 0,
                    });
                }
                combo += 1; //combo+1
                this.time.delayedCall(500, () => {
                    textR.destroy();
                    outerR.destroy() //回收
                })
            }, this);


        } else if (type == "drop") { //下落note
            var noteInside = this.add.rectangle(x, y, x1, y1, 0xFFFFFF);
            noteInside.depth = -this.scanner;
            var timer = this.time.delayedCall(duration + 200, () => {
                noteInside.destroy(); //回收
                var missed = this.add.text(x2, y2, 'MISS', { fontSize: '40px', fontFamily: 'Georgia', fill: '#FFF' }).setOrigin(0.5); //miss判定
                combo = 0; //combo归零
                this.time.delayedCall(500, () => {
                    missed.destroy(); //回收
                });
            });
            this.tweens.add({ //动画
                targets: noteInside,
                alpha: { start: 0.2, to: 1 },
                x: x2,
                y: y2,
                duration: duration,
                ease: 'Linear',
                repeat: 0,
                yoyo: false
            });
            this.tweens.add({
                targets: noteInside,
                alpha: { start: 1, to: 0 },
                duration: 200,
                ease: 'Linear',
                repeat: 0,
                yoyo: false,
                delay: duration
            });
            noteInside.inputEnabled = true;
            noteInside.setInteractive();
            noteInside.on("pointerdown", function() {
                timer.remove();
                noteInside.destroy();
                var timeNow = this.music.seek;
                var textR;
                console.log(timeNow, checkedTime)
                if (Math.abs(timeNow - checkedTime) <= 0.08) { //判定规则
                    textR = this.add.text(x2, y2, 'PERFECT', { fontSize: '40px', fontFamily: 'Georgia', fill: '#FFF' }).setOrigin(0.5);
                } else if (Math.abs(timeNow - checkedTime) <= 0.5) {
                    textR = this.add.text(x2, y2, 'GOOD', { fontSize: '40px', fontFamily: 'Georgia', fill: '#FFF' }).setOrigin(0.5);
                } else {
                    textR = this.add.text(x2, y2, 'BAD', { fontSize: '40px', fontFamily: 'Georgia', fill: '#FFF' }).setOrigin(0.5);
                }
                combo += 1; //combo+1
                this.time.delayedCall(500, () => {
                    textR.destroy(); //回收
                })
            }, this);


        } else if (type == "static") { //框
            var noteOutline = this.add.rectangle(x, y, x1, y1);
            noteOutline.depth = -this.scanner;
            noteOutline.setStrokeStyle(2, 0xFFFFFF);
            this.time.delayedCall(duration + 200, () => {

                noteOutline.destroy(); //回收
            }, );
            this.tweens.add({ //动画
                targets: noteOutline,
                alpha: { start: 0.2, to: 1 },
                duration: duration,
                ease: 'Linear',
                repeat: 0,
                yoyo: false
            });
            this.tweens.add({
                targets: noteOutline,
                alpha: { start: 1, to: 0 },
                duration: 200,
                ease: 'Linear',
                repeat: 0,
                yoyo: false,
                delay: duration
            });
        }
    }

}