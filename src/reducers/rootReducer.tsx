import { 
    MERGE_FOREGROUND,
    MOVE_TETROMINO, 
    RESET_STATE,
    ROTATE_TETROMINO,
    SPAWN_TETROMINO,
    UPDATE_BACKGROUND,
    UPDATE_SCORE,
 } from '../actions';
import { Grid } from '../components/grid';
import { buildTetriminoGrid, buildTetrominoCells, getRandomTetromino, Tetromino } from '../components/tetromino';
import { mergeForegroundReducer, resetStateReducer, spawnTetrominoReducer, updateBackgroundReducer, updateScoreReducer } from './engineReducers';
import { moveTetrominoReducer, rotateTetrominoReducer } from './playerReducers';

export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 20;

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
 */
export default function tetrisApp(state: IStore = initialState, action: any): IStore {
    switch (action.type) {
        case RESET_STATE:       return resetStateReducer();
        case MOVE_TETROMINO:    return moveTetrominoReducer(state, action);
        case ROTATE_TETROMINO:  return rotateTetrominoReducer(state);
        case SPAWN_TETROMINO:   return spawnTetrominoReducer(state);
        case MERGE_FOREGROUND:  return mergeForegroundReducer(state);
        case UPDATE_BACKGROUND: return updateBackgroundReducer(state);
        case UPDATE_SCORE:      return updateScoreReducer(state, action);
        default:                return state;
    }
}

