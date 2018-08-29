import * as React from 'react';

/** 
 * The number of cells wide and high the grid is
 */
interface IGridProps {
    width: number,
    height: number
}

/** 
 * State is just cell data
 */
interface IGridState<T> {
    cells: Array<Array<T>>
}

/** 
 * A 2D grid of cells, containing some data
 */
export class Grid<T> extends React.Component<IGridProps, IGridState<T>> {

    /**
     * Requires width and height dimensions in props, cell state is optional
     * @param props the width and height props
     * @param state the cell data
     */
    constructor(props: IGridProps, state? : IGridState<T>) {
        super(props);

        // use state parameter if provided, otherwise fill with nulls
        this.state = state || {
            cells: Array(props.height).map(_ => Array(props.width).fill(null))
        }
    }

    public render() {
        return (
            <div className="grid">
                <p> Tetris </p>
            </div>
        );
    }

    /** 
     * Returns the (width, height) dimensions of this grid 
     */
    getDimensions = (): IGridProps => ({width: this.props.width, height: this.props.height});

    /** 
     * Returns a copy of the cells in this grid's state 
     */
    getCells = (): Array<Array<T>> => this.state.cells.map(row => row.slice(0));

    /** 
     * Shifts copied cell data up or right, returning a new Grid with this cell data
     * @param up number of rows to add/remove from the start of the grid
     * @param right the number of columns to add/remove from the start of the grid
     */
    shift = (up: number, right: number): Grid<T> => 
        new Grid(this.getDimensions(), {
            cells: this.verticalShift(this.horizontalShift(this.getCells(), right), up)
        })

    /** 
     * Shifts an array of elements into the right / left with no wrapping
     * @param arr the array to shift
     * @param right the number of cells to add/remove when shifting
     */
    horizontalShift = (arr: Array<any>, right: number): Array<any> => {
        const sArr = [...Array(Math.abs(right)), ...arr, ...Array(Math.abs(right))];
        return right > 0 ? sArr.slice(sArr.length - arr.length) : sArr.slice(0, arr.length);
    }

    /** 
     * Shifts a nested array of elements up / down with no wrapping
     * @param arrs the nested array to shift
     * @param up the number of rows to add/remove when shifting 
     */
    verticalShift = (arrs: Array<Array<any>>, up: number): Array<Array<any>> => {
        return arrs;
    }

    /** 
     * Returns whether or not the Grids overlap 
     * @param other the Grid to compare against
     */
    overlap = (other: Grid<T>): boolean => 
        this.state.cells.map(
            (row, y) => row.map(
                (cell, x) => other.getCells()[y][x] !== null && cell !== null
            ).some(x => x)
        ).some(x => x);
    
}