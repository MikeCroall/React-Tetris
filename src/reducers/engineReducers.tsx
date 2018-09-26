import { UPDATE_SCORE } from '../actions';
import { Grid } from '../components/grid';
import { buildTetriminoGrid, getRandomTetromino } from '../components/tetromino';
import { endCondition } from '../helpers/grid';
import { GRID_HEIGHT, GRID_WIDTH, initialState, IStore } from './rootReducer';

export const resetStateReducer = (): IStore => spawnTetrominoReducer(initialState);

/**
 * Modify state for adding a new tetromino (foreground grid)
 * @param state the current state of the store
 * @param tetromino the tetromino instance to add to the foreground
 */
export function spawnTetrominoReducer(state: IStore): IStore {

    // spawn a random Tetromino for us to use
    const tetromino = getRandomTetromino();

    // build a new Tetromino grid for the foreground, and save the Tetromino instance to the state
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
export const mergeForegroundReducer = (state: IStore): IStore => ({
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
export function updateBackgroundReducer(state: IStore): IStore {

    const currentForeground = state.foreground.getPaddedCells(state.background.getDimensions());

    let newState: IStore = {
        background: state.background.clone(),
        foreground: state.foreground.clone(),
        score: state.score,
        tetromino: state.tetromino,
        tetrominoOrientation: state.tetrominoOrientation
    };

    const shiftedForeground: Grid = state.foreground.shift(1, 0);

    if (endCondition(shiftedForeground, state.background)) {
        return resetStateReducer();
    }

    // if the foreground touches the bottom of the screen, or collides with the background, then spawn a new tetromino
    if (currentForeground[currentForeground.length - 1].some(c => c) || state.background.overlap(shiftedForeground)) {
        newState = spawnTetrominoReducer(mergeForegroundReducer(state));
    }

    let combo = 0;

    // FIXME: this is disgusting, change it
    while (newState.background.getCells().some(row => row.every(c => c))) {
        newState.background = newState.background.deleteRow(newState.background.getCells().findIndex(row => row.every(c => c)));
        combo = combo ? (combo + (combo * 2)) : 100;
    }

    return Object.assign({}, newState, updateScoreReducer(newState, { type: UPDATE_SCORE, score: combo }));
}

/**
 * Updates the score from store
 * @param state the current state of the store
 * @param score the new score to set
 */
export function updateScoreReducer(state: IStore, action: any): IStore {
    return Object.assign({}, state, {
        score: action.score + state.score
    });
}