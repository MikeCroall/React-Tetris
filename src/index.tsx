import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { Move, moveTetromino, spawnTetromino, updateBackground } from './actions';
import App from './App';
import { Tetromino } from './components/tetromino';
import rootReducer, { initialState } from './reducers/rootReducer';
import registerServiceWorker from './registerServiceWorker';

const store = createStore(rootReducer, initialState);
store.dispatch(spawnTetromino(Tetromino.T));

setInterval(() => {
  store.dispatch(moveTetromino(Move.DOWN));
  store.dispatch(updateBackground());
}
, 1000)


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
