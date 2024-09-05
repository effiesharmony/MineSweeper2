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
var gBoard
const MINE = '💣'

var gMines = []

function onInit(level) {
    buildBoard(level)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    console.table(gBoard)
}


function buildBoard(level) {
    gBoard = []
    var emptyCells = []

    for (var i = 0; i < gLevels[level].SIZE; i++) {
        gBoard.push([])

        for (var j = 0; j < gLevels[level].SIZE; j++) {
            gBoard[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            emptyCells.push({ i, j })
        }
    }
    // gBoard[0][2].isMine = true
    // gBoard[2][3].isMine = true
    createMines(emptyCells, gLevels[level].MINES)
}

function createMines(emptyCells, minesAmount) {
    gMines = []
    for (var i = 0; i < minesAmount; i++) {
        var randomPos = emptyCells.splice(getRandomIntInclusive(0, emptyCells.length - 1), 1)[0]
        gMines.push(randomPos)
        gBoard[randomPos.i][randomPos.j].isMine = true
    }
}

function renderBoard(board) {
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[i].length; j++) {
            var cell = board[i][j]
            var cellContent = ''

            if (cell.isShown) {
                if (cell.isMine) {
                    cellContent = MINE
                } else {
                    cellContent = cell.minesAroundCount
                }

            }

            if (cell.isMarked && cell.isShown === false) cellContent = '🚩'
            strHTML += `<td onclick="onCellClicked(${i},${j})" oncontextmenu="flag(${i},${j})" class="cell-${i}-${j}">${cellContent}</td>`

        }
        strHTML += '</tr>'

    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function checkIfLose(i, j) {
    if (gBoard[i][j].isMine) {
        for (var m = 0; m <= gMines.length - 1; m++) {
            gBoard[gMines[m].i][gMines[m].j].isShown = true
        }
        lose()
    }
}

function checkIfWin() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if ((!gBoard[i][j].isMine && !gBoard[i][j].isShown) ||
                (gBoard[i][j].isMine && !gBoard[i][j].isMarked)) {
                return
            }
        }
    }
    win()
}

function win() {
    var elWin = document.querySelector('.win')
    elWin.style.display = 'block'
}

function lose() {
    var elLose = document.querySelector('.lose')
    elLose.style.display = 'block'
}

function flag(i, j) {
    if (gBoard[i][j].isShown) return
    gBoard[i][j].isMarked = !gBoard[i][j].isMarked
    console.log(gBoard[i][j])
    renderBoard(gBoard)
    checkIfWin()
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

function onCellClicked(i, j) {
    if (gBoard[i][j].isShown) return
    gBoard[i][j].isShown = true
    checkIfLose(i, j)
    checkIfWin()
    renderBoard(gBoard)
}

function restart(level) {
    var elLose = document.querySelector('.lose')
    var elWin = document.querySelector('.win')
    elLose.style.display = 'none'
    elWin.style.display = 'none'
    onInit(level)
}