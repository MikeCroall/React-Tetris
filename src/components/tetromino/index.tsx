import * as _ from 'lodash';
import { Grid } from '../grid/';

// the different tetromino names
export enum Tetromino {
    LONG_BOY = 'longBoy',
    BACKWARDS_L = 'backL',
    L = 'l',
    SQUARE = 'square',
    BACKWARDS_Z = 'backZ',
    T = 't',
    Z = 'z'
};

// probably overkill but oh well...
interface ICoordinate {
    x: number;
    y: number;
}

/** Maps each Tetromino enum to a nested Array of its coordinates 
 * Each sub-array contains the coordinates of the tetromino at different rotations
 */
const tetrominoCoordinates: Record<Tetromino, ICoordinate[][]> = {
    backL: [
        [{ x: 0, y: 0 }, ..._.range(3).map(x => ({ x, y: 1 }))],
        [{ x: 2, y: 0 }, ..._.range(3).map(y => ({ x: 1, y }))],
        [{ x: 2, y: 2 }, ..._.range(3).map(x => ({ x, y: 1 }))],
        [{ x: 0, y: 2 }, ..._.range(3).map(y => ({ x: 1, y }))]
    ], 
    backZ: [
        [...[1, 2].map(x => ({ x, y: 0 })), ...[0, 1].map(x => ({ x, y: 1 }))],
        [...[1, 2].map(y => ({ x: 1, y })), ...[0, 1].map(y => ({ x: 0, y }))],
        [...[1, 2].map(x => ({ x, y: 0 })), ...[0, 1].map(x => ({ x, y: 1 }))],
        [...[1, 2].map(y => ({ x: 1, y })), ...[0, 1].map(y => ({ x: 0, y }))]
    ],
    l: [
        [{ x: 2, y: 0 }, ..._.range(3).map(x => ({ x, y: 1 }))],
        [{ x: 2, y: 2 }, ..._.range(3).map(y => ({ x: 1, y }))],
        [{ x: 0, y: 2 }, ..._.range(3).map(x => ({ x, y: 1 }))],
        [{ x: 0, y: 0 }, ..._.range(3).map(y => ({ x: 1, y }))]
    ],
    longBoy: [
        _.range(4).map(x => ({ x, y: 0 })),
        _.range(4).map(y => ({ x: 0, y })),
        _.range(4).map(x => ({ x, y: 0 })),
        _.range(4).map(y => ({ x: 0, y })),
    ],
    square: [
        [0, 1].reduce((acc, x) => 
            [...acc, ...[0, 1].map(y => ({ x, y }))], 
        []),
        [0, 1].reduce((acc, x) =>
            [...acc, ...[0, 1].map(y => ({ x, y }))],
        []),
        [0, 1].reduce((acc, x) =>
            [...acc, ...[0, 1].map(y => ({ x, y }))],
        []),
        [0, 1].reduce((acc, x) =>
            [...acc, ...[0, 1].map(y => ({ x, y }))],
        [])
    ],
    t: [
        [{ x: 1, y: 0 }, ..._.range(3).map(x => ({ x, y: 1 }))],
        [{ x: 1, y: 1 }, ..._.range(3).map(y => ({ x: 0, y }))],
        [{ x: 1, y: 2 }, ..._.range(3).map(x => ({ x, y: 1 }))],
        [{ x: 0, y: 1 }, ..._.range(3).map(y => ({ x: 1, y }))]
    ],
    z: [
        [...[1, 2].map(x => ({ x, y: 1 })), ...[0, 1].map(x => ({ x, y: 0 }))],
        [...[1, 2].map(y => ({ x: 0, y })), ...[0, 1].map(y => ({ x: 1, y }))],
        [...[1, 2].map(x => ({ x, y: 1 })), ...[0, 1].map(x => ({ x, y: 0 }))],
        [...[1, 2].map(y => ({ x: 0, y })), ...[0, 1].map(y => ({ x: 1, y }))]
    ]
}

/**
 * Returns a random tetromino from 
 */
export const getRandomTetromino = (): Tetromino => 
    _.sample([
        Tetromino.LONG_BOY,
        Tetromino.BACKWARDS_L,
        Tetromino.L,
        Tetromino.SQUARE,
        Tetromino.BACKWARDS_Z,
        Tetromino.T,
        Tetromino.Z
    ])!;

/**
 * Returns an Array of ICoordinate ({x, y}) Objects for a given Tetromino and orientation
 * @param tetromino a Tetromino instance
 * @param orientation the orientation to get the coordinates for
 */
const getTetromino = (tetromino: Tetromino, orientation: number = 0): ICoordinate[] => tetrominoCoordinates[tetromino][orientation]; 

/**
 * Builds a 4x4 boolean grid representation for a given Tetromino and orientation
 * @param tetromino the Tetromino instance to use the coordinates for
 * @param orientation the orientation (* 90deg) to get the coordinates for
 */
export const buildTetrominoCells = (tetromino: Tetromino, orientation: number = 0): boolean[][] => {
    
    // create placeholder cells
    const cells = Array(4).fill(false).map(row => Array(4).fill(false));

    // add the tetromino cells onto it
    getTetromino(tetromino, orientation % 4).map(c => {
        cells[c.y][c.x] = true
    });
    
    return cells;
}

/**
 * Creates a grid containing this Tetromino at the top
 * @param tetromino the Tetromino enum instance (Optional)
 */
export const buildTetriminoGrid = (tetromino: Tetromino = getRandomTetromino(), orientation: number = 0): Grid => 

    // create a new Grid instance with these cells
    new Grid({ width: 4, height: 4 }, { cells: buildTetrominoCells(tetromino, orientation) });
