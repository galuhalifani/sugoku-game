import { createStore, applyMiddleware, compose } from 'redux'
import { SET_BOARD, VALIDATE_BOARD, SOLVE_BOARD } from './actionTypes.js'
import thunk from 'redux-thunk'
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const initialState = {
    board: [],
    solvedBoard: [],
    boardFetch: 'false',
    boardStatus: 'Not Started'
}

function boardReducer(state = initialState, action) {
    if (action.type === SET_BOARD) {
        return { ...state, board: action.payload, boardFetch: true}
    } else if (action.type === VALIDATE_BOARD) {
        return { ...state, boardStatus: action.payload}
    } else if (action.type === SOLVE_BOARD) {
        return { ...state, solvedBoard: action.payload.solution, boardStatus: action.payload.status}
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