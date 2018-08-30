import { css } from 'aphrodite';
import * as React from 'react';
import styles from './styles';

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
interface IGridState {
    cells: boolean[][]
}

/** 
 * A 2D grid of cells, containing some data
 */
export class Grid extends React.Component<IGridProps, IGridState> {

    /**
     * Requires width and height dimensions in props, cell state is optional
     * @param props the width and height props
     * @param state the cell data
     */
    constructor(props: IGridProps, state? : IGridState) {
        super(props);

        // use state parameter if provided, otherwise fill with nulls
        this.state =  {
            cells: Array(props.height).fill(false).map(row => Array(props.width).fill(false))
        }
    }

    public render() {
        return (
            <div className={css(styles.grid)}>
                {
                    this.state.cells.map((row, y) => (
                        <div className={css(styles.row)}>
                            {
                                row.map((cell, x) => <div className={css(styles.cell, cell ? styles.active : null)} key={x + '' + y}/> )
                            }
                        </div>
                    ))
                }
            </div>
        );
    }

    /** 
     * Returns the (width, height) dimensions of this grid 
     */
    public getDimensions = (): IGridProps => ({width: this.props.width, height: this.props.height});

    /** 
     * Returns a copy of the cells in this grid's state 
     */
    public getCells = (): any[][] => this.state.cells.map(row => row.slice(0));

    /** 
     * Shifts copied cell data up or right, returning a new Grid with this cell data
     * @param up number of rows to add/remove from the start of the grid
     * @param right the number of columns to add/remove from the start of the grid
     */
    public shift = (up: number, right: number): Grid => 
        new Grid(this.getDimensions(), {
            cells: this.verticalShift(this.getCells(), up).map(row => this.horizontalShift(row, right))
        })

    /** 
     * Shifts an array of elements into the right / left with no wrapping
     * @param arr the array to shift
     * @param right the number of cells to add/remove when shifting
     */
    public horizontalShift = (arr: any[], right: number): any[]=> {
        const sArr = [...Array(Math.abs(right)), ...arr, ...Array(Math.abs(right))];
        return right > 0 ? sArr.slice(sArr.length - arr.length) : sArr.slice(0, arr.length);
    }

    /** 
     * Shifts a nested array of elements up / down with no wrapping
     * @param arrs the nested array to shift
     * @param up the number of rows to add/remove when shifting 
     */
    public verticalShift = (arrs: any[][], up: number): any[][] => {
        return arrs;
    }

    /** 
     * Returns whether or not the Grids overlap 
     * @param other the Grid to compare against
     */
    public overlap = (other: Grid): boolean => 
        this.state.cells.map(
            (row, y) => row.map(
                (cell, x) => other.getCells()[y][x] !== null && cell !== null
            ).some(x => x)
        ).some(x => x);
    
}