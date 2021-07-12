import { SET_BOARD } from './actionTypes.js'

export function setBoard(input) {
    return {
        type: SET_BOARD,
        payload: input 
    }
}

export function fetchBoard() {
    return function(dispatch) {
        fetch('https://sugoku.herokuapp.com/board?difficulty=easy')
        .then(response => response.json())
        .then(data => {
            dispatch(setBoard(data.board))
            console.log('BOARD>>>>>>>', data.board)
        })
        .catch(err => {
            console.log('ERROR FETCH BOARD', err)
        })
    }
}