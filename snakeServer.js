
var path = require('path')
var express = require('express')
var exphbs = require("express-handlebars")
const fs = require('fs');
var Handlebars = require('handlebars');

var app = express()
var port = process.env.PORT || 3000

app.engine("handlebars", exphbs.engine({ defaultLayout : 'main' }))
app.set("view engine","handlebars")

var leaderboardData = require("./leaderboardData.json")

var dataArray = [];
for(let i in leaderboardData){
    dataArray.push(leaderboardData[i])
}

function dataSort(arr, n){
    
    let i, key, j;
    for (i = 1; i < n; i++){
        key = arr[i];
        j = i - 1;

        while (j >= 0 && arr[j].score < key.score) 
        {  
            arr[j + 1] = arr[j];  
            j = j - 1;  
        }  
        arr[j + 1] = key;
    }
}

var outfile = "leaderboardData.json"

function writeData(file, data){
    dataSort(data, data.length);
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}

//https://stackoverflow.com/questions/22103989/adding-offset-to-index-when-looping-through-items-in-handlebars
//increses the handlebars index by 1
Handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});
 
app.use(express.static('static'))

app.get('/leaderboard', function (req, res){
    console.log("leaderboard")
    writeData(outfile, dataArray)
    console.log(leaderboardData[0])
    res.status(200).render("leaderboard",{
        leaderboardData: leaderboardData
    })
})

app.get('/', function (req, res){
    writeData(outfile, dataArray)
    console.log(leaderboardData[0].score)
    res.status(200).render("gameView",{
        highscore: leaderboardData[0].score
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
