import { createStore, applyMiddleware, compose } from 'redux'
import { SET_BOARD, VALIDATE_BOARD, SOLVE_BOARD, RESET_BOARD } from './actionTypes.js'
import thunk from 'redux-thunk'
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const initialState = {
    board: [],
    solvedBoard: [],
    boardFetch: 'false',
    boardStatus: 'Not Validated',
    uneditable: []
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
        return { ...state, solvedBoard: action.payload.solution, boardStatus: action.payload.status}
    } else if (action.type === RESET_BOARD) {
        return { ...state, solvedBoard: [], boardStatus: 'Not Validated', board: []}
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