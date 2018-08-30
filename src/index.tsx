import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { spawnTetromino } from './actions';
import App from './App';
import { Tetromino } from './components/tetromino';
import rootReducer from './reducers/rootReducer';
import registerServiceWorker from './registerServiceWorker';

const store = createStore(rootReducer);

console.log(store.getState());

const unsubscribe = store.subscribe(() =>
  console.log(store.getState())
)

store.dispatch(spawnTetromino(Tetromino.BACKWARDS_Z));

unsubscribe()

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
