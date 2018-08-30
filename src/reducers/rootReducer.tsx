import { combineReducers } from 'redux'
import { 
    MERGE_FOREGROUND,
    Move,
    MOVE_TETROMINO, 
    ROTATE_TETROMINO,
    SPAWN_TETROMINO,
    UPDATE_BACKGROUND,
    UPDATE_SCORE,
 } from '../actions';
import { Grid } from '../components/grid';
import { buildTetriminoGrid, Tetromino } from '../components/tetromino';

const width = 10;
const height = 10;

// interface which the store should always follow
export interface IStore {
    background: Grid,
    foreground: Grid,
    score: number,
}

// initial state, with an empty background, foreground and score
const initialState: IStore = {
    background: new Grid({ width, height }),
    foreground: new Grid({ width, height }),
    score: 0
}

/**
 * Takes action payload, gets modified state using relevant function
 * @param state the current state of the store
 * @param action payload describing required reducer 
 * TODO: this will definitely need changing / fixing
 */
function tetrisApp(state: IStore = initialState, action: any): IStore {
    switch (action.type) {
        case MOVE_TETROMINO:    return moveTetromino(state, action);
        case ROTATE_TETROMINO:  return rotateTetromino(state);
        case SPAWN_TETROMINO:   return spawnTetromino(state, action.tetromino);
        case MERGE_FOREGROUND:  return mergeForeground(state);
        case UPDATE_BACKGROUND: return updateBackground(state);
        case UPDATE_SCORE:      return updateScore(state, action);
        default:                return state;
    }
}

/**
 * USER-INPUT REDUCERS
 */

/**
 * Modify state for moving the tetromino (foreground grid)
 * @param state the current state of the store
 * @param move the Up, Down, Left or Right Move enum instance
 * @returns the new state of the store, with the foreground change
 */
function moveTetromino(state: IStore, move: Move): IStore {
    return Object.assign({}, state, {
        foreground: state.foreground.shift(
            move === 'U' ? 1 : (move === 'D' ? -1 : 0), 
            move === 'R' ? 1 : (move === 'L' ? -1 : 0)
        )
    });
}

/**
 * Modify state for rotating the tetromino (foreground grid)
 * @param state the current state of the store
 * @param the new state of the store, with the foreground rotated
 */
function rotateTetromino(state: IStore): IStore {
    // TODO: implement this
    return state;
}

/**
 * GAME ENGINE REDUCERS
 */

/**
 * Modify state for adding a new tetromino (foreground grid)
 * @param state the current state of the store
 * @param tetromino the tetromino instance to add to the foreground
 */
function spawnTetromino(state: IStore, tetromino: Tetromino): IStore {
    return Object.assign({}, state, {
        foreground: buildTetriminoGrid(tetromino, width, height)
    })
}

/**
 * Adds foreground cell data onto the background before erasing it
 * @param state the current state of the store
 */
function mergeForeground(state: IStore): IStore {
    return Object.assign({}, state, {
        background: state.background.merge(state.foreground),
        foreground: new Grid({ width, height })
    })
}

/**
 * Deletes full rows from the background
 * @param state the current state of the store
 * TODO: implement this please
 */
function updateBackground(state: IStore): IStore {
    return state;
}

/**
 * Updates the score from store
 * @param state the current state of the store
 * @param score the new score to set
 */
function updateScore(state: IStore, score: number): IStore {
    return Object.assign({}, state, {
        score
    });
}

export default combineReducers({tetrisApp});