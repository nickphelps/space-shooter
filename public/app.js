var game = new Phaser.Game(1000, 800, Phaser.AUTO, 'phaser-container', { preload: preload, create: create, update: update, render: render });
function preload() {

    game.load.image('space', 'assets/background.png')
    game.load.image('bullet', 'assets/bullets.png')
    game.load.image('ship', 'assets/ship.png')
    game.load.image('baddie', 'assets/space-baddie.png')
    game.load.image('purple-baddie', 'assets/space-baddie-purple.png')

}

var ship
var baddies
var cursors
var score = 0 
var scoreText

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
    bullets.physicsBodyType = Phaser.Physics.ARCADE

    //Creating 40 bullets
    bullets.createMultiple(40, 'bullet')
    bullets.setAll('anchor.x', 0.5)
    bullets.setAll('anchor.y', 0.5)

    //creating ship
    ship = game.add.sprite(300, 300, 'ship')
    ship.anchor.set(0.5, 0.5)

    //physics settings
    game.physics.enable(ship, Phaser.Physics.ARCADE)

    ship.body.drag.set(100)
    ship.body.maxVelocity.set(200)
    ship.enableBody = true

    //creating baddies    
    baddies = game.add.group()
    // baddies.physicsBodyType = Phaser.Physics.ARCADE
    baddies.enableBody = true

    for (var i = 0; i < 50; i++) {
        //nmaking baddies pop up random
        var s = baddies.create(game.world.randomX, game.world.randomY, 'baddie')
        s.name = 'alien' + s
        // baddies.collideWorldBounds = true
        s.body.collideWorldBounds = true
        s.body.bounce.setTo(0.8,0.8)
        s.body.velocity.setTo(10 + Math.random() * 200, 10 + Math.random() * 200)

    } //for loop

    scoreText = this.add.text(16,16, 'Score: 0', { fontSize: '32px', fill: '#4d4dff'})
    
    //checking to see if a bullet hits a baddie
    // this.physics.add.overlap(bullets, baddies, hitBaddie, null, this)
    
    //Bullet Hits Baddie
    console.log(bullets)
    console.log(baddies)
    console.log(ship)

    game.physics.arcade.collide(bullets, baddies,collisionHandler, null, this)
    // game.physics.arcade.collide()
    //Ship hits baddie
    game.physics.arcade.collide(baddies, ship, shipGetsHit, null, this)

    //  Game input
    cursors = game.input.keyboard.createCursorKeys()
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ])

}//create

function collisionHandler (bullet, baddie) {
    console.log('Entered')
    // bullet.kill()
    // baddie.kill()

}

function shipGetsHit (ship, baddie) {
    console.log('ship hits')
    ship.kill()
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