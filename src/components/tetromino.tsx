import * as _ from 'lodash';
import { Grid } from './grid/grid';

// all tetrominoes fit in a 4x4 grid template
const template = Array(4).map(_ => Array(4).fill(null));

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

interface Coordinate {
    x: number;
    y: number;
}

/** Maps each Tetromino enum to a nested Array of its coordinates 
 * Each sub-array contains the coordinates of the tetromino at different rotations
 */
const tetrominoCoordinates: Record<Tetromino, Array<Array<Coordinate>>> = {
    longBoy: [
        _.range(4).map(x => ({ x, y: 0 })),
        _.range(4).map(y => ({ x: 0, y }))
    ],
    backL: [
        [{ x: 0, y: 0 }, ..._.range(3).map(x => ({ x, y: 1 }))],
        [{ x: 2, y: 0 }, ..._.range(3).map(y => ({ x: 1, y }))],
        [{ x: 2, y: 2 }, ..._.range(3).map(x => ({ x, y: 1 }))],
        [{ x: 0, y: 2 }, ..._.range(3).map(y => ({ x: 1, y }))]
    ],
    l: [
        [{ x: 2, y: 0 }, ..._.range(3).map(x => ({ x, y: 1 }))],
        [{ x: 2, y: 2 }, ..._.range(3).map(y => ({ x: 1, y }))],
        [{ x: 0, y: 2 }, ..._.range(3).map(x => ({ x, y: 1 }))],
        [{ x: 0, y: 0 }, ..._.range(3).map(y => ({ x: 1, y }))]
    ],
    square: 
        [[0, 1].reduce((acc, x) => 
            [...acc, ...[0, 1].map(y => ({ x, y }))], 
        [])]
    ,
    backZ: [
        [...[1, 2].map(x => ({ x, y: 0 })), ...[0, 1].map(x => ({ x, y: 1 }))],
        [...[1, 2].map(y => ({ x:1 , y })), ...[0, 1].map(y => ({ x: 0, y }))]
    ],
    t: [
        [{ x: 1, y: 0 }, ..._.range(3).map(x => ({ x, y: 1 }))],
        [{ x: 1, y: 1 }, ..._.range(3).map(y => ({ x: 0, y }))],
        [{ x: 1, y: 2 }, ..._.range(3).map(x => ({ x, y: 1 }))],
        [{ x: 0, y: 1 }, ..._.range(3).map(y => ({ x: 1, y }))]
    ],
    z: [
        [...[1, 2].map(x => ({ x, y: 1 })), ...[0, 1].map(x => ({ x, y: 0 }))],
        [...[1, 2].map(y => ({ x: 0, y })), ...[0, 1].map(y => ({ x: 1, y }))]
    ]
}

/**
 * Creates a grid containing this Tetromino at the top
 * @param tetromino the Tetromino enum instance
 */
export const buildTetriminoGrid = (tetromino: Tetromino): Grid<boolean> => {

    // create placeholder cells
    const cells = Array(10).map(row => Array(10).fill(false));

    // add the tetromino cells onto it
    tetrominoCoordinates[tetromino].map(c => cells[c.y][c.x] = true);

    // create a new Grid instance with these cells
    return new Grid({ width: 10, height: 10 }, { cells });

}