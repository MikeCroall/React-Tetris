import { css } from 'aphrodite';
import * as React from 'react';
import { connect } from 'react-redux';
import { IStore } from '../../../reducers/rootReducer';
import styles from './styles';

export interface IScoreboardProps {
    score: number
}

export class Scoreboard extends React.Component<IScoreboardProps> {

    public render() {
        return (
            <p className={css(styles.scores)}> {this.props.score} </p>
        );
    }
}

export default connect( (state: IStore) => ({
    score: state.score
}))(Scoreboard);