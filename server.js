var express = require('express')
var bodyParser = require('body-parser')

var app = express()
const morgan = require('morgan')
app.use(morgan('dev'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))
app.use(express.static(__dirname + '/public'))


//Routes etc...

const ourPort = process.env.PORT || 3500
//setting up server to listen on port 3500
app.listen(ourPort, function() {
    console.log('listening on port 3500')
})