import * as React from 'react';
import { connect } from 'react-redux';
import { IStore } from '../../../reducers/rootReducer';

export interface IScoreboardProps {
    score: number
}

export class Scoreboard extends React.Component<IScoreboardProps> {

    constructor(props: IScoreboardProps){
        super(props);
    }

    public render() {
        return (
            <p> {this.props.score} </p>
        );
    }
}

export default connect( (state: IStore) => ({
    score: state.score
}))(Scoreboard);