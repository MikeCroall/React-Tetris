import { Grid } from '../components/grid';
import { buildTetrominoCells } from '../components/tetromino';
import { horizontalOverflow, overflow, verticalOverflow } from '../helpers/grid';
import { IStore } from './rootReducer';

/**
 * Modify state for moving the tetromino (foreground grid)
 * @param state the current state of the store
 * @param move the Up, Down, Left or Right Move enum instance
 * @returns the new state of the store, with the foreground change
 */
export function moveTetrominoReducer(state: IStore, action: any): IStore {

    // shift the foreground (change x or y offsets) based on the action move (key) input
    const shiftedForeground: Grid = state.foreground.shift(
        action.move === 'U' ? -1 : (action.move === 'D' ? 1 : 0),
        action.move === 'R' ? 1 : (action.move === 'L' ? -1 : 0)
    );

    // if the shifted foreground overlaps the background, or overflows, then don't use it
    return Object.assign({}, state, {
        foreground: (state.background.overlap(shiftedForeground) || horizontalOverflow(shiftedForeground) || verticalOverflow(state.foreground)) ?
            state.foreground : shiftedForeground
    });
}

/**
 * Modify state for rotating the tetromino (foreground grid)
 * @param state the current state of the store
 * @param the new state of the store, with the foreground rotated
 */
export function rotateTetrominoReducer(state: IStore): IStore {

    // get the current foreground from the state
    const { foreground, tetromino, tetrominoOrientation } = state;
    const { xOffset = 0, yOffset = 0 } = foreground.getState();

    // create a new foreground grid, by rotating the Tetromino, and maintaing the {x, y} offsets
    const rotatedForeground = new Grid(
        { width: 4, height: 4 },
        { cells: buildTetrominoCells(tetromino!, (tetrominoOrientation + 1) % 4), xOffset, yOffset });

    // the foreground should be rotated if it doesn't cause an overflow
    const rotated = !overflow(rotatedForeground);

    // if the rotation is allowed, then use the new rotate foreground and increment the orientation
    return Object.assign({}, state, {
        foreground: rotated ? rotatedForeground : foreground,
        tetrominoOrientation: rotated ? (tetrominoOrientation + 1) % 4 : tetrominoOrientation
    });

}