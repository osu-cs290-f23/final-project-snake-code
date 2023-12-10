
var path = require('path')
var express = require('express')
var exphbs = require("express-handlebars")

var app = express()
var port = process.env.PORT || 3000

app.engine("handlebars", exphbs.engine({ defaultLayout : 'main' }))
app.set("view engine","handlebars")

var leaderboardData = require("./leaderboardData.json")
 
app.use(express.static('static'))

app.get('/leaderboard', function (req, res){
    console.log("leaderboard")
    res.status(200).render("leaderboard",{
        leaderboardData: leaderboardData
    })
})

app.get('/', function (req, res){
    res.status(200).render("gameView",{
        
    })
    console.log("game page")
})

app.get('*', function (req, res) {//broken - always runs after game page and leaderboard requests run
    res.status(404).render("404",{
        
    })
    console.log("error")
})


app.listen(port, function () {
    console.log("== Server is listening on port", port)
})
