
var path = require('path')
var express = require('express')
var exphbs = require("express-handlebars")

var app = express()
var port = process.env.PORT || 3000

app.engine("handlebars", exphbs.engine({ defaultLayout : 'main' }))
app.set("view engine","handlebars")

 
app.use(express.static('static'))

app.get('/', function (req, res){
    res.status(200).render("gameView",{

    })
    console.log("main page")
})

app.get('*', function (req, res) {
    res.status(404).render("404",{
        
    })
    console.log("error")
})


app.listen(port, function () {
    console.log("== Server is listening on port", port)
})
