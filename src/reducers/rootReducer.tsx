import { 
    MERGE_FOREGROUND,
    MOVE_TETROMINO, 
    ROTATE_TETROMINO,
    SPAWN_TETROMINO,
    UPDATE_BACKGROUND,
    UPDATE_SCORE,
 } from '../actions';
import { Grid } from '../components/grid';
import { buildTetriminoGrid, Tetromino } from '../components/tetromino';

const GRID_WIDTH = 10;
const GRID_HEIGHT = 10;

// interface which the store should always follow
export interface IStore {
    background: Grid,
    foreground: Grid,
    score: number
}

// initial state, with an empty background, foreground and score
export const initialState: IStore = {
    background: new Grid({ width: GRID_WIDTH, height: GRID_HEIGHT }),
    foreground: new Grid({ width: GRID_WIDTH, height: GRID_HEIGHT }),
    score: 0
}

/**
 * Takes action payload, gets modified state using relevant function
 * @param state the current state of the store
 * @param action payload describing required reducer 
 * TODO: this will definitely need changing / fixing
 */
export default function tetrisApp(state: IStore = initialState, action: any): IStore {
    console.log(action);
    switch (action.type) {
        case MOVE_TETROMINO:    return moveTetromino(state, action);
        case ROTATE_TETROMINO:  return rotateTetromino(state);
        case SPAWN_TETROMINO:   return spawnTetromino(state, action);
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
function moveTetromino(state: IStore, action: any): IStore {
    const shiftedForeground: Grid = state.foreground.shift(
        action.move === 'U' ? 1 : (action.move === 'D' ? -1 : 0),
        action.move === 'R' ? 1 : (action.move === 'L' ? -1 : 0)
    );

    return Object.assign({}, state, {
        foreground: state.background.overlap(shiftedForeground) ? 
            state.foreground : shiftedForeground
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
function spawnTetromino(state: IStore, action: any): IStore {
    return Object.assign({}, state, {
        foreground: buildTetriminoGrid(action.tetromino)
    })
}

/**
 * Adds foreground cell data onto the background before erasing it
 * @param state the current state of the store
 */
const mergeForeground = (state: IStore): IStore => ({
    background: state.background.merge(state.foreground),
    foreground: new Grid({ width: GRID_WIDTH, height: GRID_HEIGHT }),
    score: state.score
})

/**
 * Deletes full rows from the background
 * @param state the current state of the store
 * FIXME: fix this
 */
function updateBackground(state: IStore): IStore {
    const lastRow = state.foreground.getCells();

    let newState: IStore = {
        background: state.background.clone(),
        foreground: state.foreground.clone(),
        score: state.score
    };

    const shiftedForeground: Grid = state.foreground.shift(-1, 0);

    // handling merging the foreground and background
    if (lastRow[lastRow.length - 1].some(c => c) || state.background.overlap(shiftedForeground)){
        newState = spawnTetromino(mergeForeground(state), { tetromino: Tetromino.T });
    }

    // FIXME: this is disgusting, change it
    while(newState.background.getCells().some(row => row.every(c => c))){
        console.log('deleting row');
        newState.background = newState.background.deleteRow(newState.background.getCells().findIndex(row => row.every(c => c)));
    }
    
    return newState;
}

/**
 * Updates the score from store
 * @param state the current state of the store
 * @param score the new score to set
 */
function updateScore(state: IStore, action: any): IStore {
    return Object.assign({}, state, {
        score: action.score
    });
}
