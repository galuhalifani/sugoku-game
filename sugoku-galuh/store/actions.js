import { SET_UNEDITABLE, SET_BOARD, VALIDATE_BOARD, SOLVE_BOARD, RESET_BOARD, TOGGLE_LOADER_BOARD, TOGGLE_LOADER_VALIDATE } from './actionTypes.js'

export function setBoard(input) {
    return {
        type: SET_BOARD,
        payload: input 
    }
}

export function toggleLoaderBoard(input) {
    return {
        type: TOGGLE_LOADER_BOARD,
        payload: input
    }
}

export function toggleLoaderValidate(input) {
    return {
        type: TOGGLE_LOADER_VALIDATE,
        payload: input
    }
}

export function resetBoard(input) {
    return {
        type: RESET_BOARD,
        payload: input 
    }
}

export function validate(input) {
    return {
        type: VALIDATE_BOARD,
        payload: input 
    }
}

export function solve(input) {
    return {
        type: SOLVE_BOARD,
        payload: input 
    }
}

export function setUneditable(input) {
    return {
        type: SET_UNEDITABLE,
        payload: input 
    }
}

export function fetchBoard(difficulty) {
    return function(dispatch) {
        dispatch(toggleLoaderBoard(true))
        fetch(`https://sugoku.herokuapp.com/board?difficulty=${difficulty}`)
        .then(response => response.json())
        .then(data => {
            dispatch(setBoard(data.board))
            dispatch(toggleLoaderBoard(false))
        })
        .catch(err => {
            dispatch(toggleLoaderBoard(false))
            console.log('ERROR FETCH BOARD', err)
        })
    }
}

export function validateBoard(board) {
    const encodeBoard = (board) => board.reduce((result, row, i) => result + `%5B${encodeURIComponent(row)}%5D${i === board.length -1 ? '' : '%2C'}`, '')

    const encodeParams = (params) => 
    Object.keys(params)
    .map(key => key + '=' + `%5B${encodeBoard(params[key])}%5D`)
    .join('&');

    // var data = {
    //     board: [[0,0,1,0,0,0,0,0,0], [2,0,0,0,0,0,0,7,0], [0,7,0,0,0,0,0,0,0], [1,0,0,4,0,6,0,0,7], [0,0,0,0,0,0,0,0,0], [0,0,0,0,1,2,5,4,6], [3,0,2,7,6,0,9,8,0], [0,6,4,9,0,3,0,0,1], [9,8,0,5,2,1,0,6,0]]
    //   }

    let data = {board:board}

      return function(dispatch) {
        dispatch(toggleLoaderValidate(true))
        fetch('https://sugoku.herokuapp.com/validate', {
            method: 'POST',
            body: encodeParams(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          })
            .then(response => response.json())
            .then(data => {
                // console.log('RETURN VALIDATE', data)
                dispatch(validate(data.status))
                dispatch(toggleLoaderValidate(false))
            })
            .catch(err => {
                dispatch(toggleLoaderValidate(false))
                console.log('ERROR FETCH BOARD', err)
            })
    }
}

export function solveBoard(board) {
    const encodeBoard = (board) => board.reduce((result, row, i) => result + `%5B${encodeURIComponent(row)}%5D${i === board.length -1 ? '' : '%2C'}`, '')

    const encodeParams = (params) => 
    Object.keys(params)
    .map(key => key + '=' + `%5B${encodeBoard(params[key])}%5D`)
    .join('&');

    // var data = {
    //     board: [[0,0,1,0,0,0,0,0,0], [2,0,0,0,0,0,0,7,0], [0,7,0,0,0,0,0,0,0], [1,0,0,4,0,6,0,0,7], [0,0,0,0,0,0,0,0,0], [0,0,0,0,1,2,5,4,6], [3,0,2,7,6,0,9,8,0], [0,6,4,9,0,3,0,0,1], [9,8,0,5,2,1,0,6,0]]
    //   }

    let data = {board:board}

      return function(dispatch) {
        fetch('https://sugoku.herokuapp.com/solve', {
            method: 'POST',
            body: encodeParams(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          })
            .then(response => response.json())
            .then(data => {
                // console.log('RETURN SOLVE', data)
                dispatch(solve(data))
            })
            .catch(err => {
                console.log('ERROR FETCH BOARD', err)
            })
    }
}