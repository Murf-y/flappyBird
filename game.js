var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var playBtn = document.getElementById("play-btn");
var scoreText = document.getElementById("score");
var highscoreText = document.getElementById("highscore");
var started = false;
var lost = false;

var bird = new Image();
var bg = new Image();
var pipeNorth = new Image();
var pipeSouth = new Image();

// mobile images
bird.src = "images/birds.png";
bg.src = "images/bg_mobile.png";
pipeNorth.src = "images/pipeNorth_mobile.png";
pipeSouth.src = "images/pipeSouth_mobile.png";


var gapBetweenPipes = 70;
var pipeSpeed = 1;
var constant;

var Bird = {
    x: 20,
    y: 150
}

if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
    // on desktop
    canvas.width = 500;
    canvas.height = 375;
    bird.src = "images/bird_desktop.png";
    bg.src = "images/bg_desktop.png";
    pipeNorth.src = "images/pipeNorth_desktop.png";
    pipeSouth.src = "images/pipeSouth_desktop.png";
    gapBetweenPipes = 95;

}

var highscore = localStorage.getItem("highscore");
if (!highscore) {
    localStorage.setItem("highscore", 0);
    highscore=0;
}
highscoreText.innerText = "HighScore: " + highscore.toString();


var gravity = 1.9;
var jumpForce = 16;
var score = 0;

document.addEventListener('click', Jump);

function Jump() {
    gravity = 0;
    setTimeout(() => { gravity = 2 }, 25)
    t = 0
    const y = Bird.y;
    while (t < 1) {
        t += 0.01;
        Bird.y = Lerp(y, y - jumpForce, t);
    }
    Bird.y -= jumpForce;
}

function Lerp(a, b, t) {

    return (1 - t) * a + t * b
}

var pipe = [];

pipe[0] = {
    x: canvas.width,
    y: 0
};


function Update() {
    ctx.drawImage(bg, 0, 0);

    for (var i = 0; i < pipe.length; i++) {

        heightWithGap = pipeNorth.height + gapBetweenPipes;
        ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y);
        ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y + heightWithGap);

        pipe[i].x -= pipeSpeed;

        if (pipe[i].x == 125) {
            pipe.push({
                x: canvas.width,
                y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height
            });
        }

        if (Bird.x + bird.width >= pipe[i].x && Bird.x <= pipe[i].x + pipeNorth.width && (Bird.y <= pipe[i].y + pipeNorth.height || Bird.y + bird.height >= pipe[i].y + heightWithGap) || Bird.y > canvas.height - 25 || Bird.y < 0) {
            lost = true;
            window.location.reload();
        }

        if (pipe[i].x == 15) {
            score++;
            scoreText.innerText = "Score: " + score.toString();
            if (score > highscore) {
                highscore = score;
                localStorage.setItem("highscore", highscore);
            }

        }
    }
    highscoreText.innerText = "HighScore: " + highscore.toString();
    ctx.drawImage(bird, Bird.x, Bird.y);
    if (lost) { return }
    Bird.y += gravity;

    requestAnimationFrame(Update)

}



playBtn.addEventListener('click', () => {
    if (!started) {
        Update();
        started = true;
    }
})