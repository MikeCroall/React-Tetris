import { Tetromino } from "../components/tetromino";

/** ACTION TYPES */

/** USER */
export const MOVE_TETROMINO = 'MOVE_TETROMINO';         // move the tetromino   (u, d, l, r)
export const ROTATE_TETROMINO = 'ROTATE_TETROMINO';     // rotate the tetromino (clockwise)

/** GAME ENGINE */
export const SPAWN_TETROMINO = 'SPAWN_TETROMINO';       // spawns a tetromino onto the foreground
export const MERGE_FOREGROUND = 'MERGE_FOREGROUND';     // merges the fore-, and back-, ground
export const UPDATE_BACKGROUND = 'UPDATE_BACKGROUND';   // updates the background to remove full rows
export const UPDATE_SCORE = 'UPDATE_SCORE';             // update the score

/** CONSTANTS FOR ACTIONS */
export enum Move {
    UP = 'U',
    DOWN = 'D',
    LEFT = 'L',
    RIGHT = 'R'
}

/** ACTION CREATORS */

/** USER */
export const moveTetromino = (move: Move) => ({ type: MOVE_TETROMINO, move });
export const rotateTetromino = () => ({ type: ROTATE_TETROMINO });

/** GAME ENGINE */
export const spawnTetromino = (tetromino: Tetromino) => ({ type: SPAWN_TETROMINO, tetromino });
export const mergeForeground = () => ({ type: MERGE_FOREGROUND });
export const updateBackground = () => ({ type: UPDATE_BACKGROUND });
export const updateScore = (score: number) => ({ type: UPDATE_SCORE, score });