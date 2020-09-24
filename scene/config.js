var game;
window.onload = function() {
    // 接收 websocket;
    // config of the game;
    var config = {
        type: Phaser.WEBGL,
        parent: 'game',
        width: 1920,
        height: 1080,
        parent: 'phaser-example',
        scene: [bootscene, playscene],
        audio: {
            disableWebAudio: true
        },
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
    };

    game = new Phaser.Game(config);


    window.focus();
    // resize();
    // window.addEventListener('resize', resize, false);
}

function resize() {

    var canvas = document.querySelector('canvas');
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if (windowRatio < gameRatio) {
        canvas.style.width = windowWidth + 'px';
        canvas.style.height = (windowWidth / gameRatio) + 'px';
    } else {
        canvas.style.width = (windowHeight * gameRatio) + 'px';
        canvas.style.height = windowHeight + 'px';
    }


}