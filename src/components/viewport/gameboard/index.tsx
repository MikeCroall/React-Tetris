import { css } from 'aphrodite';
import * as React from 'react';
import { connect } from 'react-redux';
import { IStore } from '../../../reducers/rootReducer';
import styles from './styles';

/** 
 * Gameboard needs an array of 2d grid layers, and WxH dimensions
 */
export interface IGameboardProps {
    grid: boolean[][];
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
                                <div className={css(styles.cell, cell ? styles.active : null)} key={x + '' + y} />)
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