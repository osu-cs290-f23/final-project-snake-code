var canvas = document.getElementById("game-canvas")
var snake = canvas.getContext("2d")
//var fs = require('fs')

var delay = 100
let score = 0
let highScore = 0
var isModalOpen = false

var head = {
    x: 300,
    y: 300,
    size: 20,
    direction: "stop"
}

var food = {
    x: 250,
    y: 250,
    size: 20,
    color: "red"
}

var segments = []

function update() {
    if (isModalOpen) {
        return;
    }
    switch (head.direction) {
        case "up":
            head.y += head.size
            break
        case "right":
            head.x += head.size
            break
        case "down":
            head.y -= head.size
            break
        case "left":
            head.x -= head.size
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
        segments[i].y = segments[i - 1].y
    }

    for (let i = 0; i < segments.length; i++) {
        if (head.x === segments[i].x && head.y === segments[i].y) {
            resetGame();
        }
    }

    if (segments.length > 0) {
        segments[0].x = head.x;
        segments[0].y = head.y;
    }
    
    
}

function eatFood() {
    score += 10

    if (score > highScore){
        highScore = score
    }

    //let lastSegment = segments[segments.length - 1]

    var newSegment = { 
        x: head.x, 
        y: head.y + head.size
    }

    segments.push(newSegment)

    food.x = Math.floor(Math.random() * (canvas.width / 20 - 1) * 20)
    food.y = Math.floor(Math.random() * (canvas.height / 20 - 1) * 20)

}

function resetGame() {
    head.x = 300
    head.y = 300
    head.direction = "stop"

    food.x = Math.floor(Math.random() * (canvas.width / 20))
    food.y = Math.floor(Math.random() * (canvas.height / 20))

    segments.length = 0

    openModal()

    
    savePlayerData(() => {
        score = 0


        //updateHighScoreInView()
    })

// function updateHighScoreInView() {
//     var highScoreElement = document.getElementById('highScoreElementId')
//     highScoreElement.textContent = `High Score: ${highScore}`
// }



}

function openModal() {

    var modal = document.getElementById("myModal")

    modal.style.display = "block"
    isModalOpen = true
    
}

function closeModal() {
    var modal = document.getElementById("myModal");
    var playerNameInput = document.getElementById("playerNameInput");
    var playerName = playerNameInput.value.trim();

    if (playerName !== '') {
        modal.style.display = "none";
        isModalOpen = false;

        playerNameInput.value = '';
    } else {
        modal.style.display = "none";
        isModalOpen = false;
    }


}



document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "w":
            head.direction = "down"
            break
        case "d":
            head.direction = "right"
            break
        case "s":
            head.direction = "up"
            break
        case "a":
            head.direction = "left"
            break
    }
})

function gameLoop() {
    clearCanvas();
    update();
    drawGrid()
    draw();
}

function savePlayerData() {
    var playerName = document.getElementById("playerNameInput").value.trim();

    if (playerName !== '') {
        var playerData = {
            playerName: playerName,
            score: score
        };

        fetch('/saveScore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(playerData)
        })
        .then(response => {
            if (response.ok) {
                console.log('Score saved successfully');
                score = 0
                closeModal()
            } else {
                console.error('Failed to save score');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

function draw() {
    snake.fillStyle = "green"
    snake.fillRect(head.x, head.y, head.size, head.size)

    snake.fillStyle = food.color
    //snake.fillRect(food.x, food.y, food.size, food.size)
    snake.beginPath();
    snake.arc(food.x+10, food.y+10, food.size/2, 0, 2 * Math.PI)
    snake.closePath()
    snake.fill()

    snake.fillStyle = "green"
    for (var segment of segments) {
        snake.fillRect(segment.x, segment.y, head.size, head.size)
    }

    snake.fillStyle = "black"
    snake.font = "36px Georgia"
    snake.fillText(`Score: ${score}`, canvas.width - 185, 35);
}

function clearCanvas() {
    snake.clearRect(0, 0, canvas.width, canvas.height)
}

//https://stackoverflow.com/questions/11735856/draw-a-grid-on-an-html-5-canvas-element
function drawGrid() {

    snake.fillStyle = "lightgrey"
    
    for(var i = 0; i < 600; i+=40) {
        for(var j = 20; j < 600; j+=40){
            snake.fillRect(i, j, 20, 20);
        }
    }
    for(var i = 20; i < 600; i+=40) {
        for(var j = 0; j < 600; j+=40){
            snake.fillRect(i, j, 20, 20);
        }
    }

}

setInterval(gameLoop, delay)
