import * as React from 'react';
import keydown, { Keys } from 'react-keydown';
import { connect } from 'react-redux';
import { Move, moveTetromino, rotateTetromino } from './actions';
import Gameboard from './components/viewport/gameboard';
import Scoreboard from './components/viewport/scores';
import { IStore } from './reducers/rootReducer';

interface IAppProps {
  left: () => void;
  right: () => void;
  up: () => void;
  down: () => void;
  rotate: () => void;
}

class App extends React.Component<IAppProps> {  
  public render() {
    console.log('App props', this.props.left);
    return (
      <div className="App">
        <Scoreboard />
        <Gameboard />
      </div>
    );
  }

  @keydown(Keys.LEFT, Keys.RIGHT, Keys.UP, Keys.DOWN, Keys.R)
  private submit(event: any){ 
    switch(event.key){
      case 'ArrowLeft':   return this.props.left();
      case 'ArrowRight':  return this.props.right();
      case 'ArrowUp':     return this.props.up();
      case 'ArrowDown':   return this.props.down();
      case 'r':           return this.props.rotate();
    }
  }
}

const mapDispatchToProps = (dispatch:any) => {
  const actions = {
    down: () => dispatch(moveTetromino(Move.DOWN)),
    left: () => dispatch(moveTetromino(Move.LEFT)),
    right: () => dispatch(moveTetromino(Move.RIGHT)),
    rotate: () => dispatch(rotateTetromino()),
    up: () => dispatch(moveTetromino(Move.UP))
  }
  return actions;
}

export default connect(
  () => ({}),
  mapDispatchToProps
)(App);