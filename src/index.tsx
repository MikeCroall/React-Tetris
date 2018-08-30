import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { Move, moveTetromino, spawnTetromino } from './actions';
import App from './App';
import { Tetromino } from './components/tetromino';
import rootReducer, { initialState } from './reducers/rootReducer';
import registerServiceWorker from './registerServiceWorker';

const store = createStore(rootReducer, initialState);

console.log(store.getState());

store.dispatch(spawnTetromino(Tetromino.BACKWARDS_Z));

setInterval(
  () => {
    store.dispatch(moveTetromino(Move.DOWN))
  }
, 1000);


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
