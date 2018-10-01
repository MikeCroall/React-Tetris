import { Grid } from "../../components/grid";
import { GRID_HEIGHT, GRID_WIDTH } from "../../reducers/rootReducer";

export const endCondition = (foreground: Grid, background: Grid): boolean => (foreground.getState().yOffset === undefined || foreground.getState().yOffset === 1 ) && background.overlap(foreground);


/**
 * Returns whether or not a grid is currently overflowing the global grid width
 * @param grid the Grid instance to check for overflow
 */
export const horizontalOverflow = (grid: Grid): boolean => {
    const { xOffset = 0 } = grid.getState();
    return grid.getCells().some(
        (r: number[]) =>
            r.some((c: number, x: number) =>
                c !== 0 && (x + xOffset >= GRID_WIDTH)
            )
    );
}

/**
 * Returns whether or not the grid is currently overflowing the global grid height
 * @param grid the Grid instance to check for overflow
 */
export const verticalOverflow = (grid: Grid): boolean => grid.getPaddedCells({ width: GRID_WIDTH, height: GRID_HEIGHT }).pop()!.some(c => c !== 0);

/**
 * Returns whether or not the grid is currently overflowing the global grid dimensions
 * @param grid the Grid instance to check for overflow
 */
export const overflow = (grid: Grid): boolean => horizontalOverflow(grid) || verticalOverflow(grid);
