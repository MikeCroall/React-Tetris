import { css } from 'aphrodite';
import * as React from 'react';
import { connect } from 'react-redux';
import { IStore } from '../../../reducers/rootReducer';
import styles from './styles';

export interface IScoreboardProps {
    lines: number;
    score: number;
}

export class Scoreboard extends React.Component<IScoreboardProps> {

    public render() {
        return (
            <div>
                <p className={css(styles.scores)}> {this.props.score} </p>
                <p className={css(styles.scores)}> {this.props.lines} </p>
            </div>
        );
    }
}

export default connect( (state: IStore) => ({
    lines: state.lines,
    score: state.score
}))(Scoreboard);