'use strict'
// אוף מהתחלה כוסאמק

var gBoard

function onInit() {

}

function buildBoard(size) {
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount:0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return board
}