var mainState = {
    preload: function () {
		//LOAD ALL GAME SPRITES, sansdead is not used yet
		
        game.load.image('sans', 'assets/sans.png');
        //game.load.image('sansdead', 'assets/sans-dead.png');
        game.load.image('chara', 'assets/chara.png');
        game.load.audio('jump', 'assets/jump.mp3');
    },
    create: function () {

        if (game.device.desktop == false) {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;


            game.scale.setMinMax(game.width / 2, game.height / 2,
                    game.width, game.height);

            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVertically = true;
        }

        game.stage.backgroundColor = 'black';

        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.createSans();

        this.createScore();

        this.createSounds();

        this.charas = game.add.group();

        this.timer = game.time.events.loop(1500, this.addRowOfCharas, this);

        var spaceKey = game.input.keyboard.addKey(
                Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        game.input.onDown.add(this.jump, this);

    },
    update: function () {

        if (this.sans.y < 0 || this.sans.y > 490) {
            this.restartGame();
        }

        if (this.sans.angle < 20) {
            this.sans.angle + 1;
        }

        game.physics.arcade.overlap(
                this.sans, this.charas, this.hitChara, null, this);



    },
    createSans: function () {
        this.sans = game.add.sprite(100, 245, 'sans');
        game.physics.arcade.enable(this.sans);
        this.sans.body.gravity.y = 1000;
        this.sans.anchor.setTo(-0.2, 0.5);
        this.sans.alive = true;
    },
    createScore: function () {
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "1 Pun",
                {font: "30px comic-sans", fill: "#ffffff"});
    },
    createSounds: function () {
        this.jumpSound = game.add.audio('jump');
    },
    addOneChara: function (x, y) {
        var chara = game.add.sprite(x, y, 'chara');

        this.charas.add(chara);

        game.physics.arcade.enable(chara);

        chara.body.velocity.x = -200;

        chara.checkWorldBounds = true;
        chara.outOfBoundsKill = true;
    },
    addRowOfCharas: function () {
        var hole = Math.floor(Math.random() * 5) + 1;

        for (var i = 0; i < 8; i++) {
            if (i != hole && i != hole + 1) {
                this.addOneChara(400, i * 60 + 10);
            }
        }

        this.score += 1;
        this.labelScore.text = this.score + " Puns";
    },
    jump: function () {
            if(this.sans.alive){
            this.sans.body.velocity.y = -350;
            this.jumpSound.play();

            var animation = game.add.tween(this.sans);

            animation.to({angle: -20}, 100);

            animation.start();
        }
    },
    hitChara: function () {
        if (this.sans.alive == false) {
            return;
        }

        this.sans.alive = false;

        game.time.events.remove(this.timer);


        this.charas.forEach(function (c) {
            c.body.velocity.x = 0;
        }, this);

    },
    restartGame: function () {
        game.state.start('main');
    }
};

var game = new Phaser.Game(400, 490,Phaser.AUTO,'flappy-sans');

game.state.add('main', mainState, true);