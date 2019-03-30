var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'phaser-container', { preload: preload, create: create, update: update, render: render });

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
var lifeIconOne
var lifeIconTwo
var lifeIconThree
var lifes = 3
var lifeText
var baddieCount = 0
var levelCount = 1
var playAgainText
var rectangle 

var playerTwoText

var bullets
var bulletTime = 0

const levelOne = 50
const levelTwo = 100

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

    //Creating Player 2 Text
    playerTwoText = this.add.text(window.innerWidth - 250,10,'Player Two', { fontSize: '32px', fill: '#4d4dff'})

    //creating the lifes text
    lifeText = this.add.text(window.innerWidth - 250, 86, 'Lifes: ', {fontSize: '32px', fill :'#4d4dff'})

    //making ship images for lifes
    lifeIconOne = game.add.image(window.innerWidth - 160,90,'ship')
    lifeIconTwo = game.add.image(window.innerWidth - 125, 90, 'ship')
    lifeIconThree = game.add.image(window.innerWidth - 90,90, 'ship')

    makeBaddies(levelCount)

    scoreText = this.add.text(window.innerWidth - 250,45, 'Score: 0', { fontSize: '32px', fill: '#4d4dff'})
    gameOverText = this.add.text(game.world.centerX - 200 ,game.world.centerY - 60, '', {fontSize: '60px', fill: '#4d4dff'})

    //  Game input
    cursors = game.input.keyboard.createCursorKeys()
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ])

    //adding game over button
    button = game.add.button(game.world.centerX - 23, game.world.centerY + 45, 'button', actionOnClick, this)
    console.log(button)

    button.anchor.setTo(0.5,0.5)
    button.fixedToCamera = true
    button.tint = 0xffffff
    button.backgroundColor = '#ffffff'
    button.alpha = 1


    //making text over button
    playAgainText = this.add.text(game.world.centerX - 70, game.world.centerY + 35, '', {fontSize: '23px', fill :'#65737e'})

    //hiding all button elements
    button.visible = false
    button.exists = false


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

function makeBaddies(levelCount) {

    console.log(levelCount)
    baddies = game.add.group()
    baddies.enableBody = true
    baddies.exists = true
    
    //baddies per level
    if (levelCount === 1) {
        baddieCount = 0
        baddieCount = baddieCount + 40
    }

    if (levelCount === 2) {
     baddieCount = baddieCount + 30

 }

    if (levelCount === 3) {
        baddieCount = baddieCount + 40
    }

    if (levelCount === 4) {
        baddieCount = baddieCount + 20
    }

    if (levelCount === 5) {
        baddieCount = baddieCount + 25
    }

    for (var i = 0; i < baddieCount; i++) {
        //making baddies pop up random
        var s = baddies.create(game.world.randomX, game.world.randomY, 'baddie')
        s.name = 'alien' + s
        // baddies.collideWorldBounds = true
        s.body.collideWorldBounds = true
        s.body.bounce.setTo(0.8,0.8)
        s.body.velocity.setTo(10 + Math.random() * 200, 10 + Math.random() * 200)

    } //for loop
}

function actionOnClick (button, pointer, isDown) {
    if (isDown) {
        
        resetGame()
    }
}

function resetGame() {
    score = 0 
    scoreText.setText('Score: ' + score)
    levelCount = 1

    gameOverText.setText('')
    playAgainText.setText('')
    rectangle.exists = false
    button.exists = false

    baddies.kill()

    //unpause game
    game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;

    //make baddies
    makeBaddies(levelCount)

    ship.exists = true

    //adding lifes
    lifes = 3

    //showing the life incons
    lifeIconOne = game.add.image(window.innerWidth - 160,90,'ship')
    lifeIconTwo = game.add.image(window.innerWidth - 125, 90, 'ship')
    lifeIconThree = game.add.image(window.innerWidth - 90,90, 'ship')

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
    

    if (baddies.countLiving() === 0 && levelCount === 1) {
        levelCount = levelCount + 1
        makeBaddies(levelCount)
    }
    if (baddies.countLiving() === 0 && levelCount === 2) {
        levelCount = levelCount + 1
        makeBaddies(levelCount)
    } 
    if (baddies.countLiving() === 0 && levelCount === 3) {
        levelCount = levelCount + 1
        makeBaddies(levelCount)
    }
    if (baddies.countLiving() === 0 && levelCount === 4) {
        levelCount = levelCount + 1
        makeBaddies(levelCount)
    } 


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

function collisionHandler (bullet, baddie) {
    bullet.kill()
    baddie.kill()

    //updating score 
    score = score + 10
    scoreText.setText('Score: ' + score)
    // scoreText = scoreText + 10

}

function shipGetsHit (ship, baddie) {

    console.log(lifes)
    if (lifes === 3) {
        lifes = 2
        lifeIconThree.kill()
        // return lifes
    }else if (lifes === 2) {
        lifes = 1
        lifeIconTwo.kill()
        // return lifes
    }else if (lifes === 1) {
    lifes = 0
    lifeIconOne.kill()

    //pauses game
    game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;

    //drawing rectangle over button
    rectangle = game.add.graphics()
    rectangle.beginFill(0x4d4dff);
    rectangle.lineStyle(2, 0x65737e, 1)
    rectangle.drawRect(game.world.centerX - 75, game.world.centerY + 25, 150, 50)
    rectangle.lineStyle(3, 0xffffff, 1)
    rectangle.endFill();

    //showing all button elements
    button.visible = true
    button.exists = true
    rectangle.visible = true
    playAgainText.setText('PLAY AGAIN')
    playAgainText.bringToTop()

    ship.kill()

    //showing GAME OVER
    gameOverText.setText('GAME OVER!!!')
    levelCount = 1
    baddies.kill()
    button.visible = true
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