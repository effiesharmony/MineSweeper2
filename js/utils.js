'use strict'

function startTimer() {
    gElapsedTime = 0
    gStartTime = Date.now()
    gTimerInterval = setInterval(() => {
        gElapsedTime = Date.now() - gStartTime
        renderTimer()
    }, 10)
}

function onCellClicked(elCell, clickedNum) {
    if (clickedNum === gNextNumber) {
        if (clickedNum === 1) startTimer()
        elCell.classList.add('clicked-cell')
        gNextNumber++
        if (gNextNumber > gLevel ** 2) {
            clearInterval(gTimerInterval)
            return
        }
        renderNextNumber()
    }
}

function countNegs(board) {
    
    var negsCount = 0
    for (var i = gGamerPos.i - 1; i <= gGamerPos.i + 1; i++) {
        for (var j = gGamerPos.j - 1; j <= gGamerPos.j + 1; j++) {
            if (board[i][j] === SOMETHING) negsCount++
        }
    }
    return negsCount
}

function findEmptyCells() {
    var emptyCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j] === SAFE) {

                emptyCells.push({ i: i, j: j })
            }
        }
    }
    return emptyCells
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function createMat(ROWS, COLS) {
    const mat = []

    for (var i = 0; i < ROWS; i++) {
        const row = []

        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

// function buildBoard() {
//     const size = 10
//     const board = []

//     for (var i = 0; i < size; i++) {
//         board.push([])

//         for (var j = 0; j < size; j++) {
//             board[i][j] = FOOD

//             if (i === 0 || i === size - 1 ||
//                 j === 0 || j === size - 1) {
//                 board[i][j] = WALL
//             }
//         }
//     }
//     // board[1][1] = SUPERFOOD
//     // board[8][1] = SUPERFOOD
//     // board[1][8] = SUPERFOOD
//     // board[8][8] = SUPERFOOD
//     return board
// }

// function renderBoard(board) {
//     var strHTML = ''
//     for (var i = 0; i < board.length; i++) {
//         strHTML += '<tr>'
//         for (var j = 0; j < board[i].length; j++) {

//             const cell = board[i][j]
//             const className = `cell-${i}-${j}`

//             strHTML += `<td class="${className}">${cell}</td>`
//         }
//         strHTML += '</tr>'
//     }
//     const elBoard = document.querySelector('.board')
//     elBoard.innerHTML = strHTML
// }

function renderCell(location, strHTML) {
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = strHTML
}

function addItem() {
    var emptyCells = findEmptyCells()
    var ItemPos = emptyCells.splice(getRandomIntInclusive(0, emptyCells.length - 1), 1)[0]

    if (emptyCells.length > 0) {
        gBoard[ItemPos.i][ItemPos.j] = ITEM
        renderCell(ItemPos, ITEM)
    }
}

function addTemporaryItem() {
    var emptyCells = findEmptyCells()
    var itemPos = emptyCells.splice(getRandomIntInclusive(0, emptyCells.length - 1), 1)[0]
    gBoard[itemPos.i][itemPos.j].gameElement = GLUE
    renderCell(itemPos, ITEM_IMG)

    setTimeout(() => {
        if (gGamerPos.i !== itemPos.i && gGamerPos.j !== itemPos.j) {
            gBoard[itemPos.i][itemPos.j] = null
            renderCell(itemPos, '')
        }
    }, 3000)
}

function updateScore(diff) {
    // update model 
    if (diff) {
        gGame.score += diff
    } else {
        gGame.score = 0
    }
    // and dom
    document.querySelector('span.score').innerText = gGame.score


}

function checkIsVictory() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j] === FOOD) {
                return false
            }
        }
    }
    return true
}

function victoryMsg() {
    clearInterval(gIntervalGhosts)
    clearInterval(gCherryInter)
    // clearInterval(gGlueInter)
    var elVictory = document.querySelector('.victory')
    elVictory.style.display = 'block'
}

function restart() {
    var elGameOver = document.querySelector('.gameover')
    var elVictory = document.querySelector('.victory')
    elGameOver.style.display = 'none'
    elVictory.style.display = 'none'
    gGame.score = 0
    onInit()
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    
    return txt
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}  