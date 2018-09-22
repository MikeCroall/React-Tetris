/** 
 * The number of cells wide and high the grid is
 */
interface IGridProps {
    width: number,
    height: number
}

/** 
 * State is just cell data (and potentially some positive x and y offsets)
 */
interface IGridState {
    cells: boolean[][],
    xOffset?: number,
    yOffset?: number
}

/** 
 * A 2D grid of cells, containing some data
 */
export class Grid {

    // FIXME: this used to be a react component, so these will need changing
    private props: IGridProps;
    private state: IGridState;

    /**
     * Requires width and height dimensions in props, cell state is optional
     * @param props the width and height props
     * @param state the cell data
     */
    constructor(props: IGridProps, state? : IGridState) {

        this.props = props;

        // use state parameter if provided, otherwise fill with nulls
        this.state = state || {
            cells: Array(props.height).fill(false).map(row => Array(props.width).fill(false))
        };
    }

    /**
     * Clones the Grid
     */
    public clone = (): Grid => new Grid(this.getDimensions(), { cells: this.getCells() });

    /**
     * Clones the Grid with a row removed, and a new one appended to the start
     */
    public deleteRow = (y: number): Grid => new Grid(this.getDimensions(), {
        cells: [
            Array(this.props.width).fill(false), 
            ...this.getCells().slice(0, y), 
            ...this.getCells().slice(y + 1)
        ]
    });

    /** 
     * Returns the (width, height) dimensions of this grid 
     */
    public getDimensions = (): IGridProps => ({width: this.props.width, height: this.props.height});

    /** 
     * Returns a copy of the cells in this grid's state 
     */
    public getCells = (): boolean[][] => this.state.cells.slice(0).map(row => row.slice(0));

    /**
     * Returns a copy of the grid's cells once offsets have been applied
     */
    public getOffsetCells = (): boolean[][] => {

        // get the width of the grid, so that rows can be filled properly
        const { width } = this.props;

        // get this grid's cell data, and its (x, y) offset from the (0, 0) origin
        const { cells, xOffset = 0, yOffset = 0 } = this.state;

        return [

            // fill in y offset rows of false data
            ...Array(yOffset).fill(false).map(r => Array(width + xOffset).fill(false)),

            // pad the grid's rows with the x offset data
            ...cells.map(r => [Array(xOffset).fill(false), ...r])
        ];
    }

    /**
     * Returns a copy of the grid's cells, padded to a given width and height
     */
    public getPaddedCells = (w: number, h: number): boolean[][] => {
        
        // get the width of the grid, so that rows can be filled properly
        const { width, height } = this.props;

        // get this grid's cell data, and its (x, y) offset from the (0, 0) origin
        const cells = this.getOffsetCells();

        const xOffset = w - width || 0;
        const yOffset = h - height || 0;

        return [

            // fill in y offset rows of false data
            ...Array(yOffset).fill(false).map(r => Array(w).fill(false)),

            // pad the grid's rows with the x offset data
            ...cells.map(r => [Array(xOffset).fill(false), ...r])
        ];
    }

    /**
     * Merges the contents of this, and another, Grid's cells into a new one
     * @param other the other Grid to merge data with
     */    
    public merge = (other: Grid): Grid => {

        const otherCells = other.getCells();

        return new Grid(this.getDimensions(), {
            cells: this.getCells().map((row, y) => 
                row.map((cell, x) => cell || otherCells[y][x])
            )
        })
    }

    /** 
     * Shifts copied cell data up or right, returning a new Grid with this cell data
     * @param up number of rows to add/remove from the start of the grid
     * @param right the number of columns to add/remove from the start of the grid
     */
    public shift = (up: number, right: number): Grid => {

        let cells = this.getCells();

        const leftSide = cells.some(r => r[0]);
        const rightSide = cells.some(r => r[r.length - 1]);
        const topSide = cells[0].some(r => r);
        const bottomSide = cells[cells.length - 1].some(r => r);

        // only allowing left or right shifts if no blocking cells exist
        if ((right > 0 && !rightSide) || (right < 0 && !leftSide)) {
            cells = cells.map(row => this.horizontalShift(row, right));
        }

        // only allowing up or right shifts if no blocking cells exist
        if ((up > 0 && !topSide) || (up < 0 && !bottomSide)) {
            cells = this.verticalShift(cells, up);
        }

        return new Grid(this.getDimensions(), { cells })
    }
   
    /** 
     * Returns whether or not the Grids overlap 
     * @param other the Grid to compare against
     */
    public overlap = (other: Grid): boolean =>
        this.state.cells.map(
            (row, y) => row.map(
                (cell, x) => [other.getCells()[y][x], cell].every(c => c)
            ).some(x => x)
        ).some(x => x);

    
    /** 
     * Shifts an array of elements into the right / left with no wrapping
     * @param arr the array to shift
     * @param right the number of cells to add/remove when shifting
     */
    private horizontalShift = (arr: any[], right: number): any[]=> {
        // FIXME: tidy up this function a bit
        if ((right < 0 && arr[0]) || (right > 0 && arr[arr.length - 1])){
            return arr;
        }
    
        const sArr = [...Array(Math.abs(right)).fill(false), ...arr, ...Array(Math.abs(right)).fill(false)];
        return right < 0 ? sArr.slice(sArr.length - arr.length) : sArr.slice(0, arr.length);
    }

    /** 
     * Shifts a nested array of elements up / down with no wrapping
     * @param arrs the nested array to shift
     * @param up the number of rows to add/remove when shifting 
     */
    private verticalShift = (arrs: any[][], up: number): any[][] => {

        const { height } = this.props;

        if (up === 0){
            return arrs;
        }

        const sArr = [
            Array(Math.abs(height)).fill(false),
            ...arrs, 
            Array(Math.abs(height)).fill(false)
        ];
        
        return up > 0 ? sArr.slice(sArr.length - arrs.length) : sArr.slice(0, arrs.length);
    }
    
}
