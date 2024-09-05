'use strict'


var gLevels = {
    beginner: {
        SIZE: 4,
        MINES: 2
    },

    medium: {
        SIZE: 8,
        MINES: 14
    },

    expert: {
        SIZE: 12,
        MINES: 32
    }

}

const gGame = {
    lives: 2,
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gTimerInterval
var gStartTime
var gElapsedTime = 0
var gBoard
const MINE = '💣'
const LIFE = '💖'
var gIsFirstClick = true
var gCurrentLevel = 'beginner'
var gFlags = gLevels[gCurrentLevel].MINES
var gMines = []
var gFreeCells = []




function onInit() {
    gElapsedTime = 0
    renderSmileyBtn('😃')
    gGame.isOn = true
    buildBoard()
    renderBoard(gBoard)
    renderlives()
    renderTimer()
    renderFlags()
}

function buildBoard() {
    gBoard = []

    for (var i = 0; i < gLevels[gCurrentLevel].SIZE; i++) {
        gBoard.push([])

        for (var j = 0; j < gLevels[gCurrentLevel].SIZE; j++) {
            gBoard[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            gFreeCells.push(gBoard[i][j])
        }
    }
}

function renderBoard(board) {
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[i].length; j++) {
            var cell = board[i][j]
            var cellContent = ''
            var style = ''
            if (cell.isShown) {
                style = 'style="background-color:#f7b7cc; border: none; width: 28px; height: 28px;"'
                if (cell.isMine) {
                    style = 'style="background-color:#ac1010; border: none;"'
                    cellContent = MINE
                } else if (cell.minesAroundCount === 0) {
                    cellContent = ''
                } else {
                    cellContent = cell.minesAroundCount
                }
            }
            if (cell.isMarked && cell.isShown === false) cellContent = '🚩'

            strHTML += `<td ${style} onclick="onCellClicked(${i},${j})" oncontextmenu="flag(${i},${j})" class="cell-${i}-${j}">${cellContent}</td>`
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML

}

function changeLevel(level) {
    gCurrentLevel = level
    gFlags = gLevels[gCurrentLevel].MINES
    gIsFirstClick = true
    gFreeCells = []
    restart()
}

function startTimer() {
    gElapsedTime = 0
    gStartTime = Date.now()
    gTimerInterval = setInterval(() => {
        gElapsedTime = Date.now() - gStartTime
        renderTimer()
    }, 10)
}

function renderTimer() {
    const seconds = (parseInt(gElapsedTime / 1000) + '').padStart(3, 0)
    // const milliSeconds = (gElapsedTime % 1000 + '').padStart(3, 0)
    const elTimer = document.querySelector('.timer')
    elTimer.innerText = `${seconds}`
}

function renderSmileyBtn(strSmiley) {
    var elSmileyBtn = document.querySelector('.smiley')
    elSmileyBtn.innerHTML = strSmiley
}

function renderlives() {
    var strLives = ''
    for (var i = 1; i <= gGame.lives; i++) {
        strLives += LIFE
    }
    var elLives = document.querySelector('.lives')
    elLives.innerHTML = strLives
}

function flag(i, j) {
    if (!gGame.isOn || gBoard[i][j].isShown) return
    if (gFlags > 0) {
        gBoard[i][j].isMarked = !gBoard[i][j].isMarked
        if (gBoard[i][j].isMarked) {
            gFlags--
        } else {
            gFlags++
        }
    } else if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = !gBoard[i][j].isMarked
        gFlags++
    }
    renderBoard(gBoard)
    checkIfWin()
    renderFlags()
}

function renderFlags() {
    var elFlags = document.querySelector('.flags')
    elFlags.innerHTML = gFlags
}


function createMines() {
    gMines = []
    for (var i = 0; i < gLevels[gCurrentLevel].MINES; i++) {
        var randomCell = gFreeCells.splice(getRandomIntInclusive(0, gFreeCells.length - 1), 1)[0]
        gMines.push(randomCell)
        randomCell.isMine = true
    }
}

function onCellClicked(i, j) {
    if (!gGame.isOn || gBoard[i][j].isShown || gBoard[i][j].isMarked) return
    gFreeCells.splice(gFreeCells.indexOf(gBoard[i][j]), 1)
    gBoard[i][j].isShown = true
    if (gIsFirstClick) {
        startTimer()
        createMines()
        setMinesNegsCount(gBoard)
        gIsFirstClick = false
    }
    if (gBoard[i][j].isMine) {
        gGame.lives--
    }
    checkIfLose()
    if (gBoard[i][j].minesAroundCount === 0 && !gBoard[i][j].isMine) revealNegs(i, j)
    checkIfWin()
    renderBoard(gBoard)
    renderlives()
}

function checkIfLose() {
    if (gGame.lives === 0) {
        for (var m = 0; m <= gMines.length - 1; m++) {
            gMines[m].isShown = true
        }
        clearInterval(gTimerInterval)
        renderSmileyBtn('🤯')
        gGame.isOn = false
    }
}

// why isn't it workingggggggg???????? no winning for me apparently
function checkIfWin() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {

            // if(gBoard[i][j].isMine && gBoard[i][j].isShown || gBoard[i][j].isMine && gBoard[i][j].isMarked)
            //     if(!gBoard[i][j].isMine && gBoard[i][j].isShown)

            if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) return
            if ((gBoard[i][j].isMine && !gBoard[i][j].isShown) || (gBoard[i][j].isMine && !gBoard[i][j].isMarked)) return
        }
    }
    clearInterval(gTimerInterval)
    renderSmileyBtn('😍')
    gGame.isOn = false
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var cell = board[i][j]
            cell.minesAroundCount = negsCount(i, j)
        }
    }
}

function negsCount(cellI, cellJ) {
    var negsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= gBoard[i].length) continue
            if (gBoard[i][j].isMine) negsCount++
        }
    }
    return negsCount
}

function revealNegs(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= gBoard[i].length) continue
            if (gBoard[i][j].isMarked) continue
            gBoard[i][j].isShown = true
        }
    }
}

function restart() {
    gGame.isOn = true
    gIsFirstClick = true
    gFreeCells = []
    if (gCurrentLevel === 'beginner') {
        gGame.lives = 2
    } else {
        gGame.lives = 3
    }
    clearInterval(gTimerInterval)
    onInit()
}

