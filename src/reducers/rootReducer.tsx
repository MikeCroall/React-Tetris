import { 
    MERGE_FOREGROUND,
    MOVE_TETROMINO, 
    ROTATE_TETROMINO,
    SPAWN_TETROMINO,
    UPDATE_BACKGROUND,
    UPDATE_SCORE,
 } from '../actions';
import { Grid } from '../components/grid';
import { buildTetriminoGrid, buildTetrominoCells, getRandomTetromino, Tetromino } from '../components/tetromino';

const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;

// interface which the store should always follow
export interface IStore {
    background: Grid,
    foreground: Grid,
    score: number,
    tetromino: Tetromino | undefined,
    tetrominoOrientation: number,
}

// initial state, with an empty background, foreground and score
export const initialState: IStore = {
    background: new Grid({ width: GRID_WIDTH, height: GRID_HEIGHT }),
    foreground: new Grid({ width: GRID_WIDTH, height: GRID_HEIGHT }),
    score: 0,
    tetromino: undefined,
    tetrominoOrientation: 0,
}

/**
 * Takes action payload, gets modified state using relevant function
 * @param state the current state of the store
 * @param action payload describing required reducer 
 * TODO: this will definitely need changing / fixing
 */
export default function tetrisApp(state: IStore = initialState, action: any): IStore {
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

const overflowing = (grid: Grid): boolean => {
    const { xOffset = 0 } = grid.getState();
    return grid.getCells().some(
        (r: boolean[], y: number) => {
            const rowT = r.some((c, x) => {
                return c && (x + xOffset >= GRID_WIDTH);
            });
            return rowT;
        });
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
        action.move === 'U' ? -1 : (action.move === 'D' ? 1 : 0),
        action.move === 'R' ? 1 : (action.move === 'L' ? -1 : 0)
    );

    const overlapping = state.background.overlap(shiftedForeground);

    const { xOffset = 0 } = shiftedForeground.getState();
    
    return Object.assign({}, state, {
        foreground: (overlapping || overflowing(shiftedForeground)) ? 
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

    // get the current foreground from the state
    const { foreground, tetromino, tetrominoOrientation } = state;
    const { xOffset = 0, yOffset = 0} = foreground.getState();

    const rotatedForeground = new Grid(
        { width: 4, height: 4 },
        { cells: buildTetrominoCells(tetromino!, (tetrominoOrientation + 1) % 4), xOffset, yOffset });

    const rotated = !overflowing(rotatedForeground);

    return Object.assign({}, state, {
        foreground: rotated ? rotatedForeground: foreground,
        tetrominoOrientation: rotated ? (tetrominoOrientation + 1) % 4 : tetrominoOrientation
    });

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

    const tetromino = getRandomTetromino();

    return Object.assign({}, state, {
        foreground: buildTetriminoGrid(tetromino),
        tetromino,
        tetrominoOrientation: 0
    })
}

/**
 * Adds foreground cell data onto the background before erasing it
 * @param state the current state of the store
 */
const mergeForeground = (state: IStore): IStore => ({
    background: state.background.merge(state.foreground),
    foreground: new Grid({ width: GRID_WIDTH, height: GRID_HEIGHT }),
    score: state.score,
    tetromino: undefined,
    tetrominoOrientation: 0
})

/**
 * Deletes full rows from the background
 * @param state the current state of the store
 * FIXME: fix this
 */
function updateBackground(state: IStore): IStore {

    const currentForeground = state.foreground.getPaddedCells(state.background.getDimensions());

    let newState: IStore = {
        background: state.background.clone(),
        foreground: state.foreground.clone(),
        score: state.score,
        tetromino: state.tetromino,
        tetrominoOrientation: state.tetrominoOrientation
    };

    const shiftedForeground: Grid = state.foreground.shift(1, 0);

    // if the foreground touches the bottom of the screen, or collides with the background, then spawn a new tetromino
    if (currentForeground[currentForeground.length - 1].some(c => c) || state.background.overlap(shiftedForeground)){
        newState = spawnTetromino(mergeForeground(state), { tetromino: Tetromino.T });
    }

    let combo = 0;

    // FIXME: this is disgusting, change it
    while(newState.background.getCells().some(row => row.every(c => c))){
        newState.background = newState.background.deleteRow(newState.background.getCells().findIndex(row => row.every(c => c)));
        combo = combo ? combo * 2 : 100;   
    }

    newState.score += combo;
    
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
