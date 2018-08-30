import * as React from 'react';
import { Grid } from './components/grid/';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Grid width={10} height={30}/>
      </div>
    );
  }
}

export default App;
