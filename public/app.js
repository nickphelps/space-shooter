var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'phaser-container', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('space', 'assets/background.png')
    game.load.image('bullet', 'assets/bullets.png')
    game.load.image('ship', 'assets/ship.png')
    game.load.image('baddie', 'assets/space-baddie.png')
    game.load.image('button', 'assets/button-horizontal.png')

    //loading Google WebFont Loader
    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

}

var titleText

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

// var button

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

var playerOneBullets
var playerOneBulletTime = 0
var playerTwoBullets
var playerTwoBulletTime = 0

var resetGameCount = 0

var infoFont

var baddieSpeed

var levelIndicatorText

function create() {

    game.renderer.clearBeforeRender = false
    game.renderer.roundPixels = true

    //arcade physics
    game.physics.startSystem(Phaser.Physics.ARCADE)

    //space background
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
    playerOneShip.scale.setTo(1.75,1.75)

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
    playerTwoShip.scale.setTo(1.75,1.75)
    
    //physics settings player two
    game.physics.enable(playerTwoShip, Phaser.Physics.ARCADE)
    playerTwoShip.body.drag.set(100)
    playerTwoShip.body.maxVelocity.set(200)
    playerTwoShip.enableBody = true
    playerTwoShip.exists = true

    //creating the lifes text
    playerOneLifeText = game.add.text(50, 86, 'Lifes: ', { font: infoFont, fontSize: '32px', fill :'#4d4dff' })
    playerTwoLifeText = game.add.text(window.innerWidth - 250,86, 'Lifes: ', { fontSize: '32px', fill: '#4d4dff' })
    playerTwoLifeText.font = infoFont

    //Creating Player Text
    playerOneText = game.add.text(50,10,'Player One', {fontSize: '32px', fill: '#4d4dff'})
    playerOneText.font = infoFont
    playerTwoText = game.add.text(window.innerWidth - 250,10, 'Player Two', { fontSize: '32px', fill: '#4d4dff' })
    playerTwoText.font = infoFont

    //making ship images for lifes
    playerOneLifeIconOne = game.add.image(140,90,'ship')
    playerOneLifeIconTwo = game.add.image(175, 90, 'ship')
    playerOneLifeIconThree = game.add.image(210,90, 'ship')

    // //making ship images for lifes 
    playerTwoLifeIconOne = game.add.image(window.innerWidth - 160,90,'ship')
    playerTwoLifeIconOne.tint = 1 * 0x4c4cff 
    playerTwoLifeIconTwo = game.add.image(window.innerWidth - 125, 90, 'ship')
    playerTwoLifeIconTwo.tint = 1 * 0x4c4cff 
    playerTwoLifeIconThree = game.add.image(window.innerWidth - 90,90, 'ship')
    playerTwoLifeIconThree.tint = 1 * 0x4c4cff 

    makeBaddies(levelCount)

    //Score text
    playerOneScoreText = game.add.text(50,45, 'Score: 0', { fontSize: '32px', fill: '#4d4dff'})
    playerOneScoreText.font = infoFont
    playerTwoScoreText = game.add.text(window.innerWidth - 250, 45, 'Score: 0', { fontSize: '32px', fill: '#4d4dff'} )
    playerTwoScoreText.font = infoFont

    //game over text
    gameOverText = game.add.text(game.world.centerX - 200 ,game.world.centerY - 60, '', {fontSize: '60px', fill: '#4d4dff'})

    //player One keyboard
    playerOneCursors = game.input.keyboard.createCursorKeys()
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.W ])
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.A ])
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.D ])
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.F ])

    //  Player Two Keyboard
    playerTwoCursors = game.input.keyboard.createCursorKeys()
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.L ])

    //pausing the game
    game.physics.arcade.isPaused = true
    game.input.onDown.add(actionOnClick,this)

    levelIndicatorText = game.add.text(game.world.centerX,game.world.centerY, '')
    levelIndicatorText.fontSize = 60

    levelIndicatorText.font = 'Press Start 2P'

}//create


function update() {
    //player One Movement 
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
   if (game.input.keyboard.isDown(Phaser.Keyboard.L)) {
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
       levelCount = levelCount + 2

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
}//update


function makeBaddies(levelCount) {

    baddies = game.add.group()
    baddies.enableBody = true
    baddies.exists = true

    console.log(levelCount)

    //baddies per level
    if (levelCount === 1) {
        baddieCount = 0
        baddieCount = baddieCount + 5
        baddieSpeed = 10
    }

    if (levelCount === 2) {
     baddieCount = baddieCount + 12
     baddieSpeed = 20
    }  

    if (levelCount === 3) {
        baddieCount = baddieCount + 20
        baddieSpeed = 25
    }

    if (levelCount === 4) {
        baddieCount = baddieCount + 30
        baddieSpeed = 40
    }

    if (levelCount === 5) {
        baddieCount = baddieCount + 50
        baddieSpeed = 60
    }

    if (levelCount === 6) {
        baddieCount = baddieCount + 75
        baddieSpeed = 80
    }
    if (levelCount === 7) {
        baddieCount = baddieCount + 100
        baddieSpeed = 120
    }
    for (var i = 0; i < baddieCount; i++) {
        //making baddies pop up random on top 25% of screen
        if (levelCount === 1 ) {
            var s = baddies.create(game.world.randomX, game.world.randomY / 4, 'baddie')
            s.name = 'alien' + s
            s.body.collideWorldBounds = true
            s.body.bounce.setTo(0.8,0.8)
            s.body.velocity.setTo(baddieSpeed + Math.random() * 200, baddieSpeed + Math.random() * 200)
            s.scale.setTo(1.75,1.75)
        } else if (levelCount > 1) {
            var s = baddies.create(game.world.randomX, (game.world.randomY / (Math.floor(Math.random() * 6))), 'baddie')
            s.name = 'alien' + s
            s.body.collideWorldBounds = true
            s.body.bounce.setTo(0.8,0.8)
            s.body.velocity.setTo(baddieSpeed + Math.random() * 200, baddieSpeed + Math.random() * 200)
            s.scale.setTo(1.75,1.75)
        }


    } //for loop

}//make baddies

function actionOnClick () {
    hidingMainMenu()
    resetGame()
}

function resetGame() {
    //Resetting Player One Score and Text

    resetGameCount = resetGameCount + 1

    playerOneScore = 0 
    playerOneScoreText.setText('Score: ' + playerOneScore)

    //Resetting Player Two Score and Text
    playerTwoScore = 0 
    playerTwoScoreText.setText('Score: ' + playerTwoScore)

    levelCount = 1

    gameOverText.setText('')
    titleText.visibls

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


    if (resetGameCount > 1) {
    //showing the life incons
    playerOneLifeIconOne.visible = true
    playerOneLifeIconTwo.visible = true
    playerOneLifeIconThree.visible = true

    playerTwoLifeIconOne.visible = true
    playerTwoLifeIconTwo.visible = true
    playerTwoLifeIconThree.visible = true
    }
}


function playerOneFireBullet () {

    //logic for fire bullets for each ship
    if (game.time.now > playerOneBulletTime) {
        bullet = playerOneBullets.getFirstExists(false)

        if (bullet) {
            bullet.reset(playerOneShip.body.x+26, playerOneShip.body.y+26)
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
            bullet.reset(playerTwoShip.body.x + 26, playerTwoShip.body.y + 26)
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

    //updating score 
    playerOneScore = playerOneScore + 10
    playerOneScoreText.setText('Score: ' + playerOneScore)

}

function playerTwoCollisionHandler (bullet, baddie) {
    bullet.kill()
    baddie.kill()

    //updating score 
    playerTwoScore = playerTwoScore + 10
    playerTwoScoreText.setText('Score: ' + playerTwoScore)

}

function playerOneShipGetsHit (ship, baddie) {

    if (playerOneLifes === 3) {
        playerOneLifes = 2
        playerOneLifeIconOne.visible = false
        // return lifes
    }else if (playerOneLifes === 2) {
        playerOneLifes = 1
        playerOneLifeIconTwo.visible = false
        // return lifes
    }else if (playerOneLifes === 1) {
        playerOneLifes = 0
        playerOneLifeIconThree.visible = false
        //pauses game
        game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;

        //ship one gets killed
        playerOneShip.kill()

        showMainMenu()

        levelCount = 1
        baddies.kill()

    }
}

function playerTwoShipGetsHit (ship, baddie) {

    if (playerTwoLifes == 3) {
        playerTwoLifes = 2
        playerTwoLifeIconOne.visible = false
        // return lifes
    }else if (playerTwoLifes === 2) {
        playerTwoLifes = 1
        playerTwoLifeIconTwo.visible = false
        // return lifes
    }else if (playerTwoLifes === 1) {
        playerTwoLifes = 0
        playerTwoLifeIconThree.visible = false

        //pauses game
        game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;

        //ship one gets killed
        playerTwoShip.kill()

        showMainMenu()

        levelCount = 1
        baddies.kill()
    }
}

function showMainMenu () {
    titleText.visible = true
    clickToPlayText.visible = true
    controllerTextPlayerOne.visible = true
    controllerTextPlayerTwo.visible = true
}

function hidingMainMenu () {
    // titleText.visible = false
    clickToPlayText.visible = false
    titleText.visible = false
    controllerTextPlayerOne.visible = false
    controllerTextPlayerTwo.visible = false
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

//loading Google Fonts
WebFontConfig = {
    active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },
    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Press Start 2P', 'Audiowide']
    }
}

function createText() {

    //title text
    titleText = game.add.text(game.world.centerX, game.world.centerY - 175, "- SPACE SHOOTERS -")
    titleText.anchor.setTo(0.5)

    titleText.font = 'Press Start 2P'
    titleText.fontSize = 100

    //  x0, y0 - x1, y1
    grd = titleText.context.createLinearGradient(0, 0, 0, titleText.canvas.height);
    grd.addColorStop(0, '#4d4dff');   
    grd.addColorStop(1, '#004CB3');
    titleText.fill = grd;

    titleText.align = 'center';
    titleText.stroke = '#fff';
    titleText.strokeThickness = 1;
    titleText.setShadow(3, 3, '#fff', 1);

    //click to play text
    clickToPlayText = game.add.text(game.world.centerX, game.world.centerY - 70, "- CLICK TO PLAY -")
    clickToPlayText.anchor.setTo(0.5)

    clickToPlayText.font = 'Audiowide'
    clickToPlayText.fontSize = 60
    clickToPlayText.fill = '#fff'

    //game instructions
    controllerTextPlayerOne = game.add.text(game.world.centerX - (window.innerWidth / 4), game.world.centerY + 150, 'PLAYER ONE\nW - UP\nA - LEFT\nD - RIGHT\nF - SHOOT')
    controllerTextPlayerTwo = game.add.text(game.world.centerX + (window.innerWidth / 4), game.world.centerY + 150, 'PLAYER TWO\n^ - UP\n> - RIGHT\n< - LEFT\nM - SHOOT')
    controllerTextPlayerOne.anchor.setTo(0.5)
    controllerTextPlayerTwo.anchor.setTo(0.5)
    controllerTextPlayerOne.font = 'Audiowide'
    controllerTextPlayerOne.fontSize = 45

    controllerTextPlayerTwo.font = 'Audiowide'
    controllerTextPlayerTwo.fontSize = 45

    controllerTextPlayerOne.fill = '#fff'
    controllerTextPlayerTwo.fill = '#fff'

    controllerTextPlayerOne.align = 'center'
    controllerTextPlayerTwo.align = 'center'
}