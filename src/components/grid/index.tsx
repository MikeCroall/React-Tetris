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

        console.log(`New Grid. 
            Dim:    ${this.props.width}x${this.props.height},
            Offset: (${this.state.xOffset}x${this.state.yOffset})`);
    }

    /**
     * Clones the Grid
     */
    public clone = (): Grid => (console.log('Cloning Grid'), new Grid(this.getDimensions(), { 
        cells: this.getCells(),
        xOffset: this.state.xOffset, 
        yOffset: this.state.yOffset
    }));

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

        // TODO: fix this, the code is dirty

        // get the width of the grid, so that rows can be filled properly
        const { width } = this.props;

        // get this grid's cell data, and its (x, y) offset from the (0, 0) origin
        const { cells, xOffset = 0, yOffset = 0 } = this.state;

        return yOffset ? [

            // fill in y offset rows of false data
            ...Array(yOffset).fill(false).map(r => Array(width + xOffset).fill(false)),

            // pad the grid's rows with the x offset data
            ...cells.map(r => xOffset ? [...Array(xOffset).fill(false), ...r.slice(0)] : r.slice(0))
        ] : 
        [...cells.map(r => xOffset ? [...Array(xOffset).fill(false), ...r.slice(0)] : r.slice(0))];
    }

    /**
     * Returns a copy of the grid's cells, padded to a given width and height
     */
    public getPaddedCells = (w: number, h: number): boolean[][] => {
    
        // get this grid's cell data, and its (x, y) offset from the (0, 0) origin
        const cells = this.getOffsetCells();

        // get the width of the grid, so that rows can be filled properly
        const height = cells.length;
        const width = cells[0].length;

        const xOffset = Math.max(0, w - width || 0);
        const yOffset = Math.max(0, h - height || 0);

        console.log(`Getting padded cells. Aimed proportions = ${w}x${h}. 
        Current proportions = ${width}x${height}. Offsets = ${xOffset}x${yOffset}.`)

        const result = [

            // pad the grid's rows with the x offset data
            ...cells.map(r => xOffset ? [...r.slice(0), ...Array(xOffset).fill(false)] : r),

            // fill in y offset rows of false data
            ...Array(yOffset).fill(false).map(r => Array(w).fill(false))
        ].slice(0, h);

        console.log(`Final result = `, result);

        return result;
    }

    /**
     * Merges the contents of this, and another, Grid's cells into a new one
     * @param other the other Grid to merge data with
     */    
    public merge = (other: Grid): Grid => {

        console.log('Merging cells');

        const { width, height } = this.props;

        // get the cells of the other grid, adjusted for offsets
        const otherCells = other.getPaddedCells(width, height);

        return new Grid(this.getDimensions(), {
            cells: this.getCells().map((row, y) => 
                row.map((cell, x) => cell || otherCells[y][x])
            )
        })
    }

    /** 
     * Shifts copied cell data up or right, returning a new Grid with this cell data
     * @param down number of rows to add/remove from the start of the grid
     * @param right the number of columns to add/remove from the start of the grid
     */
    public shift = (down: number, right: number): Grid => {

        console.log(`Shifting by (${right}, ${down})`);

        const { cells } = this.state;
        const xOffset = Math.max(0, (this.state.xOffset || 0) + right);
        const yOffset = Math.max(0, (this.state.yOffset || 0) + down);

        return new Grid(this.props, {cells, xOffset, yOffset});

    }
   
    /** 
     * Returns whether or not the Grids overlap 
     * @param other the Grid to compare against
     */
    public overlap = (other: Grid): boolean => {

        console.log('Overlapping cells');

        const { width, height } = this.props;

        const adjustedOther = other.getPaddedCells(width, height);
    
        return this.state.cells.map(
            (row, y) => row.map(
                (cell, x) => [adjustedOther[y][x], cell].every(c => c)
            ).some(x => x)
        ).some(x => x);
    }

    
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
