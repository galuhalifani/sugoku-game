import { createStore, applyMiddleware, compose } from 'redux'
import { SET_UNEDITABLE, SET_BOARD, VALIDATE_BOARD, SET_FINISHED, SET_LEADERBOARD, SOLVE_BOARD, RESET_BOARD, TOGGLE_LOADER_BOARD, TOGGLE_LOADER_VALIDATE } from './actionTypes.js'
import thunk from 'redux-thunk'
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const initialState = {
    board: [],
    autoSolvedBoard: [],
    boardFetch: 'false',
    boardStatus: 'Not Validated',
    uneditable: [],
    loadingBoard: false,
    loadingValidate: false,
    finished: false,
    leaderboard: []
}

function boardReducer(state = initialState, action) {
    if (action.type === SET_BOARD) {
        let filled = []
        for (let i = 0; i < action.payload.length; i++) {
           for (let j = 0; j < action.payload[i].length; j++) {
              if (action.payload[i][j] !== 0) {
                  filled.push(`${i}, ${j}`)
                }
            }
        }    
        return { ...state, board: action.payload, boardFetch: true, uneditable: [...filled]}
    } else if (action.type === VALIDATE_BOARD) {
        return { ...state, boardStatus: action.payload}
    } else if (action.type === SOLVE_BOARD) {
        if (action.payload.status == 'unsolvable') {
            alert('The board is unsolvable')
        } else {
            return { ...state, autoSolvedBoard: action.payload.solution}
        }
    } else if (action.type === RESET_BOARD) {
        return { ...state, autoSolvedBoard: [], boardStatus: 'Not Validated', board: [], boardFetch: 'false'}
    } else if (action.type === TOGGLE_LOADER_BOARD) {
        return { ...state, loadingBoard: action.payload}
    } else if (action.type === TOGGLE_LOADER_VALIDATE) {
        return { ...state, loadingValidate: action.payload}
    } else if (action.type === SET_UNEDITABLE) {
        return { ...state, uneditable: action.payload}
    } else if (action.type === SET_FINISHED) {
        return { ...state, finished: action.payload}
    } else if (action.type === SET_LEADERBOARD) {
        return { ...state, leaderboard: [...state.leaderboard, [action.payload.name, action.payload.totalTime]]}
    }

    return state
}

const store = createStore (
    boardReducer,
    composeEnhancers(
        applyMiddleware(thunk)
    )
)

export default store