var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'phaser-container', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('space', 'assets/background.png')
    game.load.image('bullet', 'assets/bullets.png')
    game.load.image('ship', 'assets/ship.png')
    game.load.image('baddie', 'assets/space-baddie.png')
    game.load.image('purple-baddie', 'assets/space-baddie-purple.png')
    game.load.image('button', 'assets/button-horizontal.png')

}

var playerOneShip
var playerTwoShip

var baddies

var playerOneCursors
var playerTwoCursors

var playerOneText
var playerTwoText

var playerOneScore = 0 
var playerOneScoreText
var playerTwoScore = 0
var playerTwoScoreText

var gameOverText
var button

var playerOneLifeIconOne
var playerOneLifeIconTwo
var playerOneLifeIconThree

var playerTwoLifeIconOne
var playerTwoLifeIconTwo
var playerTwoLifeIconThree

var playerOneLifes = 3
var playerTwoLifes = 3

var playerOneLifeText
var playerTwoLifeText

var baddieCount = 0
var levelCount = 1
var playAgainText
var rectangle 

var playerOneBullets
var playerOneBulletTime = 0
var playerTwoBullets
var playerTwoBulletTime = 0

//DO WE NEED THIS??
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

    //player one bullets
    playerOneBullets = game.add.group()
    playerOneBullets.enableBody = true
    playerOneBullets.exists = true
    playerOneBullets.physicsBodyType = Phaser.Physics.ARCADE

    //Creating 40 bullets
    playerOneBullets.createMultiple(40, 'bullet')
    playerOneBullets.setAll('anchor.x', 0.5)
    playerOneBullets.setAll('anchor.y', 0.5)

    //player two bullets
    playerTwoBullets = game.add.group()
    playerTwoBullets.enableBody = true
    playerTwoBullets.exists = true
    playerTwoBullets.physicsBodyType = Phaser.Physics.ARCADE

    //Creating 40 bullets
    playerTwoBullets.createMultiple(40, 'bullet')
    playerTwoBullets.setAll('anchor.x', 0.5)
    playerTwoBullets.setAll('anchor.y', 0.5)

    //CREATING PLAYER ONE SHIP
    playerOneShip = game.add.sprite(game.world.centerX - 100, game.world.centerY, 'ship')
    playerOneShip.anchor.set(0.5, 0.5)

    //physics settings player one
    game.physics.enable(playerOneShip, Phaser.Physics.ARCADE)

    playerOneShip.body.drag.set(100)
    playerOneShip.body.maxVelocity.set(200)
    playerOneShip.enableBody = true
    playerOneShip.exists = true

    //CREATING PLAYER TWO SHIP
    playerTwoShip = game.add.sprite(game.world.centerX + 100, game.world.centerY, 'ship')
    playerTwoShip.anchor.set(0.5, 0.5)
    playerTwoShip.tint = 1 * 0x4c4cff //changing the color of ship two
    // sprite.tint = Math.random() * 0xffffff;


    //physics settings player two
    game.physics.enable(playerTwoShip, Phaser.Physics.ARCADE)

    playerTwoShip.body.drag.set(100)
    playerTwoShip.body.maxVelocity.set(200)
    playerTwoShip.enableBody = true
    playerTwoShip.exists = true

    //creating the lifes text
    playerOneLifeText = this.add.text(50, 86, 'Lifes: ', { fontSize: '32px', fill :'#4d4dff' })
    playerTwoLifeText = this.add.text(window.innerWidth - 250,86, 'Lifes: ', { fontSize: '32px', fill: '#4d4dff' })

    //Creating Player Text
    playerOneText = this.add.text(50,10,'Player One', { fontSize: '32px', fill: '#4d4dff'})
    playerTwoText = this.add.text(window.innerWidth - 250,10, 'Player Two', { fontSize: '32px', fill: '#4d4dff' })

    //making ship images for lifes
    playerOneLifeIconOne = game.add.image(140,90,'ship')
    playerOneLifeIconTwo = game.add.image(175, 90, 'ship')
    playerOneLifeIconThree = game.add.image(210,90, 'ship')

    //making ship images for lifes 
    playerTwoLifeIconOne = game.add.image(window.innerWidth - 160,90,'ship')
    playerTwoLifeIconOne.tint = 1 * 0x4c4cff 
    playerTwoLifeIconTwo = game.add.image(window.innerWidth - 125, 90, 'ship')
    playerTwoLifeIconTwo.tint = 1 * 0x4c4cff 
    playerTwoLifeIconThree = game.add.image(window.innerWidth - 90,90, 'ship')
    playerTwoLifeIconThree.tint = 1 * 0x4c4cff 

    makeBaddies(levelCount)

    //Score text
    playerOneScoreText = this.add.text(50,45, 'Score: 0', { fontSize: '32px', fill: '#4d4dff'})
    playerTwoScoreText = this.add.text(window.innerWidth - 250, 45, 'Score: 0', { fontSize: '32px', fill: '#4d4dff'} )

    //game over text
    gameOverText = this.add.text(game.world.centerX - 200 ,game.world.centerY - 60, '', {fontSize: '60px', fill: '#4d4dff'})

    //player One keyboard
    playerOneCursors = game.input.keyboard.createCursorKeys()
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.W ])
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.A ])
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.D ])
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.F ])

    //  Player Two Keyboard
    playerTwoCursors = game.input.keyboard.createCursorKeys()
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.M ])

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


function makeBaddies(levelCount) {

    console.log(levelCount)
    baddies = game.add.group()
    baddies.enableBody = true
    baddies.exists = true
    
    //baddies per level
    if (levelCount === 1) {
        baddieCount = 0
        baddieCount = baddieCount + 1
    }

    if (levelCount === 2) {
     baddieCount = baddieCount + 40

 }

    if (levelCount === 3) {
        baddieCount = baddieCount + 30
    }

    if (levelCount === 4) {
        baddieCount = baddieCount + 20
    }

    if (levelCount === 5) {
        baddieCount = baddieCount + 15
    }

    for (var i = 0; i < baddieCount; i++) {
        //making baddies pop up random on top 25% of screen
        var s = baddies.create(game.world.randomX, game.world.randomY / 4, 'baddie')
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
    //Resetting Player One Score and Text
    playerOneScore = 0 
    playerOneScoreText.setText('Score: ' + playerOneScore)

    //Resetting Player Two Score and Text
    playerTwoScore = 0 
    playerTwoScoreText.setText('Score: ' + playerTwoScore)

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

    //making the ships exists
    playerOneShip.exists = true
    playerTwoShip.exists = true


    //adding lifes
    playerOneLifes = 3
    playerTwoLifes = 3

    //showing the life incons
    playerOneLifeIconOne = game.add.image(160,90,'ship')
    playerOneLifeIconTwo = game.add.image(125, 90, 'ship')
    playerOneLifeIconThree = game.add.image(90,90, 'ship')

    playerTwoLifeIconOne = game.add.image(window.innerWidth - 160,90,'ship')
    playerTwoLifeIconOne.tint = 1 * 0x4c4cff 
    playerTwoLifeIconTwo = game.add.image(window.innerWidth - 125, 90, 'ship')
    playerTwoLifeIconTwo.tint = 1 * 0x4c4cff 
    playerTwoLifeIconThree = game.add.image(window.innerWidth - 90,90, 'ship')
    playerTwoLifeIconThree.tint = 1 * 0x4c4cff 

}


function update() {

     //player One Movement 
console.log(playerOneCursors)
    if(game.input.keyboard.isDown(Phaser.Keyboard.W)) {
        game.physics.arcade.accelerationFromRotation(playerOneShip.rotation, 200, playerOneShip.body.acceleration)
    } else {
        playerOneShip.body.acceleration.set(0)
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
        playerOneShip.body.angularVelocity = -300
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
        playerOneShip.body.angularVelocity = 300
    }
    else {
        playerOneShip.body.angularVelocity = 0
    }

    //firing bullets
    if (game.input.keyboard.isDown(Phaser.Keyboard.F)) {
        playerOneFireBullet()
    }

    //player Two movement
    if (playerTwoCursors.up.isDown) {
        game.physics.arcade.accelerationFromRotation(playerTwoShip.rotation, 200, playerTwoShip.body.acceleration)
    }
    else {
        playerTwoShip.body.acceleration.set(0)
    }

    if (playerTwoCursors.left.isDown) {
        playerTwoShip.body.angularVelocity = -300
    }
    else if (playerTwoCursors.right.isDown) {
        playerTwoShip.body.angularVelocity = 300
    }
    else {
        playerTwoShip.body.angularVelocity = 0
    }

    //firing bullets
    if (game.input.keyboard.isDown(Phaser.Keyboard.M)) {
        playerTwoFireBullet()
    }

    screenWrap(playerOneShip)
    //screenWrap for player two
    screenWrap(playerTwoShip)

    //Screen Wrap for Bullets
    playerOneBullets.forEachExists(screenWrap, this)
    playerTwoBullets.forEachExists(screenWrap, this)
 
    //PLAYER ONE COLLISIONS HANDLERS
    game.physics.arcade.collide(playerOneBullets, baddies, playerOneCollisionHandler, null, this)
    //Ship hits baddie
    game.physics.arcade.collide(baddies, playerOneShip, playerOneShipGetsHit, null, this)
    
    //PLAYER TWO COLLISONS HANDLERS
    game.physics.arcade.collide(playerTwoBullets, baddies, playerTwoCollisionHandler, null, this)
    //Ship hits baddie
    game.physics.arcade.collide(baddies, playerTwoShip, playerTwoShipGetsHit, null, this)


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

function playerOneFireBullet () {

    console.log(playerOneBullets)
    //logic for fire bullets for each ship
    if (game.time.now > playerOneBulletTime) {
        bullet = playerOneBullets.getFirstExists(false)

        if (bullet) {
            bullet.reset(playerOneShip.body.x + 16, playerOneShip.body.y + 16)
            bullet.lifespan = 3000
            bullet.rotation = playerOneShip.rotation
            game.physics.arcade.velocityFromRotation(playerOneShip.rotation, 400, bullet.body.velocity)
            playerOneBulletTime = game.time.now + 50
        }
    }

}

function playerTwoFireBullet () {

    //logic for fire bullets for each ship
    if (game.time.now > playerTwoBulletTime) {
        bullet = playerTwoBullets.getFirstExists(false)

        if (bullet) {
            bullet.reset(playerTwoShip.body.x + 16, playerTwoShip.body.y + 16)
            bullet.lifespan = 3000
            bullet.rotation = playerTwoShip.rotation
            game.physics.arcade.velocityFromRotation(playerTwoShip.rotation, 400, bullet.body.velocity)
            playerTwoBulletTime = game.time.now + 50
        }
    }
}

function playerOneCollisionHandler (bullet, baddie) {
    bullet.kill()
    baddie.kill()
    // console.log(bullet)

    //HOW DO WE ASSIGN SCORE FOR EACH PLAYER

    //updating score 
    playerOneScore = playerOneScore + 10
    playerOneScoreText.setText('Score: ' + playerOneScore)

}

function playerTwoCollisionHandler (bullet, baddie) {
    bullet.kill()
    baddie.kill()

    //HOW DO WE ASSIGN SCORE FOR EACH PLAYER

    //updating score 
    playerTwoScore = playerTwoScore + 10
    playerTwoScoreText.setText('Score: ' + playerTwoScore)

}

function playerOneShipGetsHit (ship, baddie) {

    if (playerOneLifes === 3) {
        playerOneLifes = 2
        playerOneLifeIconThree.kill() 
        // return lifes
    }else if (playerOneLifes === 2) {
        playerOneLifes = 1
        playerOneLifeIconTwo.kill()
        // return lifes
    }else if (playerOneLifes === 1) {
    playerOneLifes = 0
    playerOneLifeIconThree.kill()

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

    //ship one gets killed
    playerOneShip.kill()

    //showing GAME OVER
    gameOverText.setText('GAME OVER!!!')
    levelCount = 1
    baddies.kill()
    button.visible = true
    }
}

function playerTwoShipGetsHit (ship, baddie) {

    if (playerTwoLifes === 3) {
        playerTwoLifes = 2
        playerTwoLifeIconThree.kill() 
        // return lifes
    }else if (playerTwoLifes === 2) {
        playerTwoLifes = 1
        playerTwoLifeIconTwo.kill()
        // return lifes
    }else if (playerTwoLifes === 1) {
    playerTwoLifes = 0
    playerTwoLifeIconThree.kill()

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

    //ship one gets killed
    playerTwoShip.kill()

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