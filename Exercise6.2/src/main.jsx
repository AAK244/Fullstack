import React from 'react';
import ReactDOM from 'react-dom/client';
import counterReducer from './reducer';
import { createStore } from 'redux';

const store = createStore(counterReducer);

const render = () => {
  const state = store.getState();

  return (
    <div>
      <button onClick={() => store.dispatch({ type: 'GOOD' })}>good</button>
      <button onClick={() => store.dispatch({ type: 'OK' })}>ok</button>
      <button onClick={() => store.dispatch({ type: 'BAD' })}>bad</button>
      <button onClick={() => store.dispatch({ type: 'ZERO' })}>reset stats</button>
      <div>good {state.good}</div>
      <div>ok {state.ok}</div>
      <div>bad {state.bad}</div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));

store.subscribe(() => {
  root.render(render());
});

root.render(render());
