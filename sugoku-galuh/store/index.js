import { createStore, applyMiddleware, compose } from 'redux'
import { SET_BOARD } from './actionTypes.js'
import thunk from 'redux-thunk'
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const initialState = {
    board: []
}

function boardReducer(state = initialState, action) {
    if (action.type === SET_BOARD) {
        return { ...state, board: action.payload}
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