var canvas = document.getElementById("gameCanvas")
var snake = canvas.getContext("2d")
var fs = require('fs')

var delay = 100
let score = 0
let highScore = 0

var head = {
    x: 0,
    y: 0,
    size: 20,
    direction: "stop"
}

var food = {
    x: 0,
    y: 0,
    size: 20,
    color: "red"
}

var segments = []

function update() {
    switch (head.direction) {
        case "up":
            head.y += 10
            break
        case "right":
            head.x += 10
            break
        case "down":
            head.y += -10
            break
        case "left":
            head.x += -10
            break
    }

    if (head.x > canvas.width - head.size || head.x < 0 || head.y > canvas.height - head.size || head.y < 0) {
        resetGame()
    }

    if (head.x < food.x + food.size && head.x + head.size > food.x &&
        head.y < food.y + food.size && head.y + head.size > food.y) {
        eatFood()
    }

    for (let i = segments.length - 1; i > 0; i--) {
        segments[i].x = segments[i - 1].x
        segments[i].x = segments[i - 1].y
    }

    if (segments.length > 0) {
        segments[0].x = head.x
        segments[0].y = head.y
    }
    
    
}

function eatFood() {
    score += 10

    if (score > highScore){
        highScore = score
    }

    var newSegment = { 
        x: head.x, 
        y: head.y
    }

    segments.push(newSegment)

    food.x = Math.floor(Math.random() * (canvas.width / 10) * 10)
    food.y = Math.floor(Math.random() * (canvas.height / 10) * 10)

}

function resetGame() {
    head.x = 0
    head.y = 0
    head.direction = "stop"

    food.x = Math.floor(Math.random() * (canvas.width / 10))
    food.y = Math.floor(Math.random() * (canvas.height / 10))

    segments.length = 0

    score = 0

    updateLeaderboard()

}

function updateLeaderboard() {
    
    var leaderboardData = JSON.parse(fs.readFileSync('leaderboardData.json, utf8'))

    var playerName = "Player"
    const playerData = {
        name: playerName,
        score: score
    }

    leaderboardData.push(playerData)

    fs.writeFileSync('leaderboardData.json', JSON,stringify(leaderboardData), 'utf8')
}

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "w":
            head.direction = "up"
            break
        case "d":
            head.direction = "right"
            break
        case "s":
            head.direction = "down"
            break
        case "a":
            head.direction = "left"
            break
    }
})

function gameLoop() {
    clearCanvas();
    update();
    draw();
}

function draw() {
    snake.fillStyle = "green"
    snake.fillRect(head.x, head.y, head.size, head.size)

    snake.fillStyle = food.color
    snake.fillRect(food.x, food.y, food.size, food.size)

    snake.fillStyle = "green"
    for (var segment of segments) {
        snake.fillRect(segment.x, segment.y, head.size, head.size)
    }

    snake.fillStyle = "white"
    snake.font = "24px candara"
    snake.fillText('Score: ${score} High Score: ${highScore]', canvas.width / 2, 30)
}

function clearCanvas() {
    snake.clearRect(0, 0, canvas.width, canvas.height)
}


setInterval(gameLoop, delay)
