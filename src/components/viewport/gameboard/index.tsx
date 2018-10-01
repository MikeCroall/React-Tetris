import { css } from 'aphrodite';
import * as React from 'react';
import { connect } from 'react-redux';
import { IStore } from '../../../reducers/rootReducer';
import styles from './styles';

/**
 * Gameboard needs an array of 2d grid layers, and WxH dimensions
 */
export interface IGameboardProps {
    grid: number[][];
}

/**
 * Displays a set of grid information
 */
export class Gameboard extends React.Component<IGameboardProps> {

    public render() {
        return (
            <div className={css(styles.grid)}>
                {
                    this.props.grid.map((row, y) => (
                        <div className={css(styles.row)} key={y} >
                            {
                                row.map((cell, x) =>
                                <div className={css(styles.cell,
                                    cell === 1 ? styles.longBoy :
                                    cell === 2 ? styles.backL :
                                    cell === 3 ? styles.l :
                                    cell === 4 ? styles.square :
                                    cell === 5 ? styles.backZ :
                                    cell === 6 ? styles.t :
                                    cell === 7 ? styles.z :
                                    cell !== 0 ? styles.activeDefault : null)} key={x + '' + y} />)
                            }
                        </div>
                    ))
                }
            </div>
        );
    }
}

export default connect( (state: IStore) => ({
    grid: state.background.merge(state.foreground).getCells()
}))(Gameboard);
