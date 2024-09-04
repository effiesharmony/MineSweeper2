'use strict'

var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gBoard
const MINE = '💣'
const SAFE = ' '
// var negs = setMinesNegsCount(gBoard)
// var clickedCell = gBoard[i][j]
// var gTimerInterval
// var gStartTime
// var gElapsedTime = 0

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function onInit() {
    buildBoard(4)
    console.table(gBoard)
    renderBoard()
    // console.log(setMinesNegsCount(2, 2))
    // console.table(gBoard)
    // renderBoard(gBoard)
    // gGame.isOn = true
}

function createCell() {

}

function buildBoard(size) {
    gBoard = []

    for (var i = 0; i < size; i++) {
        gBoard.push([])

        for (var j = 0; j < size; j++) {
            gBoard[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    gBoard[1][2].isMine = true
    gBoard[3][2].isMine = true
}


function renderBoard() {
    var cellContent
    var strHTML = ''
   
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gBoard[i].length; j++) {

            var cell = gBoard[i][j]
            var negs = setMinesNegsCount(gBoard[i], gBoard[j])
            if (cell.isMine === false) {
                cellContent = negs
            }
            else if (cell.isMine) cellContent = MINE

            strHTML += `<td>${cellContent}</td>`
        }
        strHTML += '</tr>'

    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function setMinesNegsCount(cellI, cellJ) {
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

// function onCellClicked(elCell, clickedNum) {
//     if (clickedNum === gNextNumber) {
//         if (clickedNum === 1) startTimer()
//         elCell.classList.add('clicked-cell')
//         gNextNumber++
//         if (gNextNumber > gLevel ** 2) {
//             clearInterval(gTimerInterval)
//             return
//         }
//         renderNextNumber()
//     }
// }
