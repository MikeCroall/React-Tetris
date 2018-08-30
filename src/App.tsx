import * as React from 'react';
import Gameboard from './components/viewport/gameboard';
import Scoreboard from './components/viewport/scores';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Scoreboard />
        <Gameboard />
      </div>
    );
  }
}

export default App;
