/** 
 * The number of cells wide and high the grid is
 */
interface IDimensions {
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

    private state: IGridState;

    /**
     * Requires width and height dimensions in props, cell state is optional
     * @param props the width and height props
     * @param state the cell data
     */
    constructor(dimensions: IDimensions, state? : IGridState) {

        // use state parameter if provided, otherwise fill with nulls
        this.state = state || {
            cells: Array(dimensions.height).fill(false).map(row => Array(dimensions.width).fill(false))
        };
    }

    /**
     * Clones the Grid
     */
    public clone = (): Grid => (new Grid(this.getDimensions(), { 
        cells: this.getCells(),
        xOffset: this.state.xOffset, 
        yOffset: this.state.yOffset
    }));

    /**
     * Clones the Grid with a row removed, and a new one appended to the start
     */
    public deleteRow = (y: number): Grid => new Grid(this.getDimensions(), {
        cells: [
            Array(this.getDimensions().width).fill(false), 
            ...this.getCells().slice(0, y), 
            ...this.getCells().slice(y + 1)
        ]
    });

    /** 
     * Returns the (width, height) dimensions of this grid 
     */
    public getDimensions = (): IDimensions => ({width: this.getCells()[0].length, height: this.getCells().length});

    public getState = (): IGridState => ({
        cells: this.getCells(),
        xOffset: this.state.xOffset,
        yOffset: this.state.yOffset
    });

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
        const { width } = this.getDimensions();

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
     * @param width the number of values in each row of the grid
     * @param height the number of rows in the gri
     */
    public getPaddedCells = (otherDimensions: IDimensions): boolean[][] => {
    
        // get this grid's cell data, and its (x, y) offset from the (0, 0) origin
        const cells = this.getOffsetCells();
        
        // get the width of the grid, so that rows can be filled properly
        const xOffset = Math.max(0, otherDimensions.width - cells[0].length || 0);
        const yOffset = Math.max(0, otherDimensions.height - cells.length || 0);
        
        return [

            // pad the grid's rows with the x offset data
            ...cells.map(r => xOffset ? [...r.slice(0), ...Array(xOffset).fill(false)] : r),

            // fill in y offset rows of false data
            ...Array(yOffset).fill(false).map(r => Array(otherDimensions.width).fill(false))
        ].slice(0, otherDimensions.height );
    }

    /**
     * Merges the contents of this, and another, Grid's cells into a new one
     * @param other the other Grid to merge data with
     */    
    public merge = (other: Grid): Grid => {

        // get the cells of the other grid, adjusted for offsets
        const otherCells = other.getPaddedCells(this.getDimensions());

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
    public shift = (down: number, right: number): Grid => 

        new Grid(this.getDimensions(), { 
            cells: this.getCells(), 
            xOffset: Math.max(0, (this.state.xOffset || 0) + right), 
            yOffset: Math.max(0, (this.state.yOffset || 0) + down)
        });
   
    /** 
     * Returns whether or not the Grids overlap 
     * @param other the Grid to compare against
     */
    public overlap = (other: Grid): boolean => {
        
        const adjustedOther = other.getPaddedCells(this.getDimensions());
    
        return this.state.cells.map(
            (row, y) => row.map(
                (cell, x) => [adjustedOther[y][x], cell].every(c => c)
            ).some(x => x)
        ).some(x => x);
    }
    
}
