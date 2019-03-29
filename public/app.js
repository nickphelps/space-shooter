var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-container', { preload: preload, create: create, update: update, render: render });
function preload() {

    game.load.image('space', 'assets/background.png')
    game.load.image('bullet', 'assets/bullets.png')
    game.load.image('ship', 'assets/ship.png')
    game.load.image('baddie', 'assets/space-baddie.png')
    game.load.image('purple-baddie', 'assets/space-baddie-purple.png')
    game.load.image('button', 'assets/button-horizontal.png')

}

var ship
var baddies
var cursors
var score = 0 
var scoreText
var gameOverText
var button

var bullets
var bulletTime = 0

function create() {

    //This will run in Canvas mode, so let's gain a little speed and display
    game.renderer.clearBeforeRender = false
    game.renderer.roundPixels = true

    //We need arcade physics
    game.physics.startSystem(Phaser.Physics.ARCADE)

    //A spacey background
    game.add.tileSprite(0, 0, game.width, game.height, 'space')

    //ships bullets
    bullets = game.add.group()
    bullets.enableBody = true
    bullets.exists = true
    bullets.physicsBodyType = Phaser.Physics.ARCADE

    //Creating 40 bullets
    bullets.createMultiple(40, 'bullet')
    bullets.setAll('anchor.x', 0.5)
    bullets.setAll('anchor.y', 0.5)

    // creating ship
    ship = game.add.sprite(300, 300, 'ship')
 
    ship.anchor.set(0.5, 0.5)

    //physics settings
    game.physics.enable(ship, Phaser.Physics.ARCADE)

    ship.body.drag.set(100)
    ship.body.maxVelocity.set(200)
    ship.enableBody = true
    ship.exists = true

    makeBaddies()

    scoreText = this.add.text(16,16, 'Score: 0', { fontSize: '32px', fill: '#4d4dff'})
    gameOverText = this.add.text(game.world.centerX - 200 ,game.world.centerY - 60, '', {fontSize: '60px', fill: '#4d4dff'})

    //  Game input
    cursors = game.input.keyboard.createCursorKeys()
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ])

    //adding game over buttin
    button = game.add.button(game.world.centerX - 200 ,game.world.centerY - 60, 'button', actionOnClick, this, {fill: '#4d4dff'})
    button.anchor.setTo(0.5,0.5)
    // button.Color = Phaser.Color.RED

}//create

function makeShip() {
      //creating ship
      ship = game.add.sprite(300, 300, 'ship')
 
      ship.anchor.set(0.5, 0.5)
  
      //physics settings
      game.physics.enable(ship, Phaser.Physics.ARCADE)
  
      ship.body.drag.set(100)
      ship.body.maxVelocity.set(200)
      ship.enableBody = true
      ship.exists = true
}

function makeBaddies() {

    baddies = game.add.group()
    baddies.enableBody = true
    baddies.exists = true

    console.log('entered make')
    for (var i = 0; i < 50; i++) {
        //making baddies pop up random
        var s = baddies.create(game.world.randomX, game.world.randomY, 'baddie')
        s.name = 'alien' + s
        // baddies.collideWorldBounds = true
        s.body.collideWorldBounds = true
        s.body.bounce.setTo(0.8,0.8)
        s.body.velocity.setTo(10 + Math.random() * 200, 10 + Math.random() * 200)

    } //for loop
}

function collisionHandler (bullet, baddie) {
    console.log('Entered')
    bullet.kill()
    baddie.kill()

    //updating score 
    score = score + 10
    scoreText.setText('Score: ' + score)
    // scoreText = scoreText + 10

}

function shipGetsHit (ship, baddie) {
    console.log('ship hits')
    //pauses game
    game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;

    ship.kill()

    gameOverText.setText('GAME OVER!!!')



}

function actionOnClick (button, pointer, isDown) {
    console.log('button hit')
    if (isDown) {
        console.log('button button')
        resetGame()
    }
}

function resetGame() {
    score = 0 
    scoreText.setText('Score: ' + score)

    gameOverText.setText('')

    //reset lives

    baddies.kill()

    //unpause game
    game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;

    //make baddies
    makeBaddies()
    // makeShip()
    // ship.enableBody = true
    ship.exists = true
  

}


function update() {

    if (cursors.up.isDown) {
        game.physics.arcade.accelerationFromRotation(ship.rotation, 200, ship.body.acceleration)
    }
    else {
        ship.body.acceleration.set(0)
    }

    if (cursors.left.isDown) {
        ship.body.angularVelocity = -300
    }
    else if (cursors.right.isDown) {
        ship.body.angularVelocity = 300
    }
    else {
        ship.body.angularVelocity = 0
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
        fireBullet()
    }

    screenWrap(ship)

    bullets.forEachExists(screenWrap, this)

    //bullet hits baddie
    game.physics.arcade.collide(bullets, baddies, collisionHandler, null, this)
    //Ship hits baddie
    game.physics.arcade.collide(baddies, ship, shipGetsHit, null, this)

}

function fireBullet () {

    if (game.time.now > bulletTime) {
        bullet = bullets.getFirstExists(false)

        if (bullet) {
            bullet.reset(ship.body.x + 16, ship.body.y + 16)
            bullet.lifespan = 3000
            bullet.rotation = ship.rotation
            game.physics.arcade.velocityFromRotation(ship.rotation, 400, bullet.body.velocity)
            bulletTime = game.time.now + 50
        }
    }

}

function screenWrap (sprite) {

    if (sprite.x < 0) {
        sprite.x = game.width
    }
    else if (sprite.x > game.width) {
        sprite.x = 0
    }

    if (sprite.y < 0) {
        sprite.y = game.height
    }
    else if (sprite.y > game.height) {
        sprite.y = 0
    }

}

function render() {
}