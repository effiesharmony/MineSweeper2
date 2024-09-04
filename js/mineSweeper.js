'use strict'

var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gBoard
const MINE = '💣'

var gMines = []

// var gGame = {
//     isOn: false,
//     shownCount: 0,
//     markedCount: 0,
//     secsPassed: 0
// }

function onInit() {
    buildBoard(gLevel.SIZE)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    console.table(gBoard)
}


function buildBoard(size) {
    gBoard = []
    var emptyCells = []

    for (var i = 0; i < size; i++) {
        gBoard.push([])

        for (var j = 0; j < size; j++) {
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
    createMines(emptyCells, gLevel.MINES)
}

function createMines(emptyCells, minesAmount) {
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

function lose(i, j) {
    if (gBoard[i][j].isMine) {
        // console.log(gBoard[i][j].isMine)
        for (var m = 0; m <= gMines.length - 1; m++) {
            gBoard[gMines[m].i][gMines[m].j].isShown = true
        }
    }
}

function win() {
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

function win(){
    var elWin = document.querySelector('.win')
    elWin.computedStyleMap.block
}

function flag(i, j) {
    if (gBoard[i][j].isShown) return
    gBoard[i][j].isMarked = !gBoard[i][j].isMarked
    console.log(gBoard[i][j])
    renderBoard(gBoard)
    win()
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
    lose(i, j)
    win()
    renderBoard(gBoard)
}
