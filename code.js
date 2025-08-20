// elements
let mplQueen;
let object;
let checkLoose;

// counters 
let lifeCount;
let milkyCount;
let highestScore = 0;
let milkyRecord;

// arrays 
let obstacles = ["milky", "badMilky", "hotTray", "programmer", "commander", "milky", "milky", "milky"];

let obstaclesInterval;
let backgroundInterval;
// let walkInterval;

// picture variables
let walk;


// loading the game
window.addEventListener("load", () => {
    mplQueen = document.getElementById("mplQueen");
    milkyRecord = document.getElementById("milkyRecordText");
    startPage();
});

// loading different pages
const startPage = () => {
    mplQueen.style.display = "none";
    document.getElementById("exitBtn").removeEventListener("click", startPage);
    document.getElementById("instructionsPage").style.display = "none";
    document.getElementById("startPage").style.display = "block";
    document.getElementById("startBtn").addEventListener("click", setGame);
    document.getElementById("instructionsBtn").addEventListener("click", instructions);
}

const instructions = () => {
    document.getElementById("startPage").style.display = "none";
    document.getElementById("startBtn").removeEventListener("click", setGame);
    document.getElementById("instructionsBtn").removeEventListener("click", instructions);
    document.getElementById("instructionsPage").style.display = "block";
    document.getElementById("exitBtn").addEventListener("click", startPage);
}

const endGame = () => {
    document.getElementById("body").style.backgroundImage = `url(assets/media/background-gav-yam.png)`;
    document.getElementById("body").classList.remove("background-move");
    document.getElementById("restartBtn").style.display = "block";
    document.getElementById("endPage").style.display = "block";
    clearInterval(obstaclesInterval);
    clearInterval(backgroundInterval);
    mplQueen.style.display = "none";
    document.getElementById("restartBtn").addEventListener("click", setGame);
    document.getElementById("milkyCount").innerText = milkyCount;
    checkHighestScore(milkyCount);
    if (highestScore > sessionStorage.getItem("highestScore")) {
        sessionStorage.setItem("highestScore", highestScore);
    }
    document.getElementById("highestScore").innerText = sessionStorage.getItem("highestScore");
}

// setting and resetting the elements and counters for the game
const setGame = () => {
    highestScore = sessionStorage.getItem("highestScore");
    milkyRecord.innerText = highestScore;
    milkyCount = 0;
    lifeCount = 3;
    mplQueen.style.display = "block";
    document.getElementById("endPage").style.display = "none";
    document.getElementById("instructionsPage").style.display = "none";
    document.getElementById("startPage").style.display = "none";
    document.getElementById("exitBtn").removeEventListener("click", setGame);
    document.getElementById("restartBtn").removeEventListener("click", setGame);
    document.getElementById("startBtn").removeEventListener("click", setGame);
    document.getElementById("milkyCountText"). innerText = milkyCount;
    for (let index = 1; index <= 3; index++) {
        document.getElementById(`heart${index}`).setAttribute("src", "assets/media/full-heart.png");
    }
    startGame();
}

// starting the game
const startGame = () => { 
    document.getElementById("body").style.backgroundImage = `url(assets/media/gavYamBack.gif)`;
    window.addEventListener("keydown", checkKeyPressed);
    if (obstaclesInterval !== undefined) {
        clearInterval(obstaclesInterval);
    }
    obstaclesInterval = setInterval(sendObstacle, 1300);
}


const sendObstacle = () => {
    let randomObstacle = obstacles[Math.floor(Math.random() * obstacles.length)]
    let currObstacle = document.getElementById(randomObstacle);
    currObstacle.style.display = "block";
    currObstacle.classList.add("animation");
    setInterval(() => {
        touchObject(currObstacle);
    }, 10);
    currObstacle.addEventListener("animationend", () => {
        currObstacle.style.display = "none";
        currObstacle.classList.remove("animation");
    })
}



// checking if an object touched the mpl
const touchObject = (object) => {
    mplQueen = document.getElementById("mplQueen");
    let mplQueenPlace = mplQueen.getBoundingClientRect();
    let mplQueenL = mplQueenPlace.left;
    let mplQueenR = mplQueenPlace.right;
    let mplQueenB = mplQueenPlace.bottom;
    let mplQueenT = mplQueenPlace.top;
    let obstaclePlace = object.getBoundingClientRect();
    let obstacleL = obstaclePlace.left;
    let obstacleR = obstaclePlace.right;
    let obstacleB = obstaclePlace.bottom;
    let obstacleT = obstaclePlace.top;
    let xCollision = obstacleR > mplQueenL && obstacleL < mplQueenR;
    let yCollision = mplQueenB > obstacleT && obstacleB > mplQueenT;
    if (xCollision && yCollision) {
        monitorCollision(object);
    }
    return xCollision && yCollision; 
}

const monitorCollision = (object) => {
        switch (object.id) {
            case "milky":
                addMilky(object);
                break;
            case "badMilky":
                resetMilky(object);
                break;
            case "hotTray":
                removeLife(object);
                break;
            case "programmer":
                programmerTouch(object);
                break;
                case "commander":
                commanderTouch(object);
                break;
            default:
                break;
            }
}

const programmerTouch = (object) => {
    if (mplQueen.getAttribute("src") === "assets/media/mplgrab.png") {
        addMilky(object);
    } else {
        removeMilky(object);
    }
}

const commanderTouch = (object) => {
    if (mplQueen.getAttribute("src") !== "assets/media/mplsalute.png") {
        removeLife(object);
    } 
}

// milky and life counters
const addMilky = (object) => {
    milkyCount++;
    document.getElementById("milkyCountText"). innerText = milkyCount;
    object.style.display = "none";
    object.classList.remove("animation");
}

const removeMilky = (object) => {
    if (milkyCount > 0) {
        milkyCount--;
        document.getElementById("milkyCountText"). innerText = milkyCount;
        object.style.display = "none";
        object.classList.remove("animation");
    }
}

const resetMilky = (object) => {
    milkyCount = 0;
    document.getElementById("milkyCountText"). innerText = milkyCount;
    object.style.display = "none";
    object.classList.remove("animation");
}

const removeLife = (object) => {
    document.getElementById(`heart${lifeCount}`).setAttribute("src", "assets/media/empty-heart.png");
    lifeCount--;
    object.style.display = "none";
    object.classList.remove("animation");
    if (lifeCount === 0) {
       endGame();
    }
}

// actions main mplQueen
const checkKeyPressed = (event) => {
    switch (event.key) {
        case "ArrowUp":
            jump ();
            break;
        case "ArrowDown":
            dodge ();
            break;
        case "ArrowRight":
            salute ();
            break;
        case "ArrowLeft":
            grab ();
            break;
        default:
            break;
    }
}

const jump = () => {
    mplQueen.setAttribute("src", "assets/media/mplQueen.png");
    if (mplQueen.classList !== "jump") {
        mplQueen.classList.add("jump"); 
        mplQueen.addEventListener("animationend", () => {
            mplQueen.classList.remove("jump");
            mplQueen.setAttribute("src", "assets/media/mplgif2.gif");
        });
    }
}

const grab = () => {
    programmer = document.getElementById("programmer");
    if (programmer.classList.contains("animation")) {
        mplQueen.setAttribute("src", "assets/media/mplgrab.png");
        setTimeout(() => {
            mplQueen.setAttribute("src", "assets/media/mplgif2.gif");
        }, 800);
    }
}

const salute = () => {
    commander = document.getElementById("commander");
    if (commander.classList.contains("animation")) {
        mplQueen.setAttribute("src", "assets/media/mplsalute.png");
        setTimeout(() => {
            mplQueen.setAttribute("src", "assets/media/mplgif2.gif");
        }, 1000);
    }
}

const dodge = () => {
    mplQueen = document.getElementById("mplQueen");
    mplQueen.setAttribute("src", "assets/media/mplQueenDodge.png");
    mplQueen.style.height = "20vh";
    setTimeout(() => {
        mplQueen.setAttribute("src", "assets/media/mplgif2.gif");
        mplQueen.style.height = "40vh";
    }, 800);
}


const checkHighestScore = (milkyCount) => {
    if (milkyCount > highestScore) {
        highestScore = milkyCount;
        document.getElementById("newScore").style.display = "block";
        return true;
    } else {
        document.getElementById("newScore").style.display = "none";
        return false;
    }
}