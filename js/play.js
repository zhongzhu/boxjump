
var map = [
[0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 5, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

[0, 0, 5, 5, 5, 0, 0, 0, 0, 2, 3, 0, 0, 0, 0, 0, 2, 3, 0, 0, 0, 0],
[0, 0, 0, 0, 2, 0, 0, 0, 5, 0, 0, 0, 0, 2, 0, 0, 0, 5, 0, 0, 0, 3],
[0, 0, 0, 0, 2, 3, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 2, 2, 0, 0],
[0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 2, 3, 0, 0, 0],
[0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2],

[0, 0, 5, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 2],
[0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 5, 0, 0, 0, 2, 2, 2, 0, 0, 5],
[0, 0, 0, 0, 2, 3, 2, 0, 0, 0, 5, 5, 0, 0, 0, 2, 3, 2, 0, 0, 0, 0],
[0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 3, 0, 0, 0, 5, 0, 0, 0, 0, 2],
[0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0],

[0, 0, 0, 0, 4, 0, 0, 0, 0, 5, 0, 0, 0, 3, 3, 0, 0, 0, 0, 5, 0, 0],
[0, 0, 0, 0, 0, 5, 0, 0, 2, 2, 0, 0, 0, 0, 5, 5, 0, 0, 0, 4, 0, 0],
[0, 0, 0, 0, 1, 4, 1, 0, 0, 0, 0, 1, 4, 1, 0, 0, 0, 0, 0, 1, 4, 1],
[0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 2, 0, 0]];

Game.Play = function (game) {}; 

Game.Play.prototype = {    
  create: function () {
    //  We're going to be using physics, so enable the Arcade Physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.player = this.game.add.sprite(80, h*2/3-20, 'player');
    this.game.physics.arcade.enable(this.player);
    this.player.anchor.setTo(0.5, 0.5);

    this.cubes = game.add.group();
    //  We will enable physics for any cube that is created in this group
    this.cubes.enableBody = true;
    this.cubes.createMultiple(20, 'cube');

    this.line = this.game.add.sprite(w/2, Math.floor(h*2/3), 'line');
    this.game.physics.arcade.enable(this.line);
    this.line.anchor.setTo(0.5, 0.5);
    this.line.body.immovable = true;

    this.hit_s = game.add.audio('hit');
    this.jump_s = game.add.audio('jump');

    this.labelDeath = game.add.text(100, h-35, '0', { font: '18px Arial', fill: '#fff', align: 'center' });
    this.labelDeath.anchor.setTo(0.5, 0.5);
    this.labelLevel = game.add.text(w-100+0.5, h-35, '1/'+map.length, { font: '18px Arial', fill: '#fff', align: 'center' });
    this.labelLevel.anchor.setTo(0.5, 0.5);
    this.labelTuto = game.add.text(Math.floor(w/2)+0.5, h-35+0.5, 'press space to jump', { font: '18px Arial', fill: '#fff', align: 'center' });
    this.labelTuto.anchor.setTo(0.5, 0.5);

    this.game.input.onDown.add(this.letsJump, this);

    this.level = 0; 
    this.gameStarted = false;

    this.loadLevel();
  },

  letsJump: function() {
    if (this.player.body.touching.down) {
      this.playerJump();

      if (!this.gameStarted) {
        this.gameStarted = true;
        this.player.body.velocity.x = 170;
        game.add.audio('music').play('', 0, 0.1, true);
      }
    }    
  },

  update: function() {
    this.game.physics.arcade.collide(this.player, this.line);
    this.game.physics.arcade.overlap(this.player, this.cubes, this.playerHit, null, this);

    if (this.player.body.touching.down && this.gameStarted) { 
      this.player.body.velocity.x = 170;
    }


    if (this.player.x >= w - 60)  this.loadLevel();

    if (this.player.y > this.line.y)  this.initPlayer();
  },

  playerJump: function() {
    this.player.body.velocity.y = -250;
    this.jump_s.play('', 0, 0.1);
  },

  playerHit: function(player, hit) {
    this.hit_s.play('', 0, 0.2);
    death += 1;
    this.labelDeath.text = death;
    this.initPlayer();
  },

  loadLevel: function() { 
    if (map.length == this.level) 
      game.state.start('End');
    else {
      this.drawLevel(map[this.level]);
      this.level++;
      this.labelLevel.text = this.level + '/' + map.length;
      this.initPlayer();
    }
    if (this.level == 2) this.labelTuto.text = '';
  },

  initPlayer: function() {
    this.player.body.gravity.y = 730;
    this.player.x = 60;
    this.player.y = h*2/3-this.player.height/2-30;
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;
    this.player.body.touching.down = false;
  },

  drawLevel: function(maap) {
    this.cubes.forEachAlive(function(cube){cube.kill();});

    var cube, height;
    for (var i = 0; i < maap.length; i++) {
      cube = this.cubes.getFirstExists(false);

      if (maap[i] == 1) {
        cube.reset(100+i*cube.width, h*2/3);
        height = 0.3;
      }
      else if (maap[i] == 2) {
        cube.reset(100+i*cube.width, h*2/3);
        height = 1;
      }
      else if (maap[i] == 3) {
        cube.reset(100+i*cube.width, h*2/3);
        height = 1.5;
      }
      else if (maap[i] == 4) {
        cube.reset(100+i*cube.width, h*2/3);
        height = 1.8;
      }
      else if (maap[i] == 5) {
        cube.reset(100+i*cube.width, h*2/3-22);
        height = 0.5;
      }

      if (maap[i] != 0) {
        cube.scale.y = 0;
        cube.anchor.setTo(0, 1);
        this.game.add.tween(cube.scale).to({y : height}, 300*height, Phaser.Easing.Linear.None).start();
      }
    }
  }
};
