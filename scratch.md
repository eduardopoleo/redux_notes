```javascript
const createStore = (reducer) => {
  let state;
  let listeners = [];

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(l => l())
  };

  const subscribe = (listener) => {
    listeners.push(listener);

    return () => {
      listeners = listeners.filter(l => l !== listener);
    }
    //This function will be called subscribe()(listener)
  };

  const getState = () => state;
  //I do not remember what is this for.
  //This is only to get the initial state going.
  //The reducer should be written such that will return the current state for an empty action
  
  dispatch({});
  return {getState, dispatch, subscribe};
};

This is how we use these functions
const { createStore } = Redux;
const store = createStore(todoApp);

store.dispatch(action)
store.getState()
store.subscribe(render);

const combineReducers = (reducers) => {
  //This state and action are filled up by the create store who will
  //use the top level reducer when we instantiate it.
  //state = reducer(state, action)
  return (state = {}, action) => {
    return Object.keys(reducers).reduce(
      (nextState, key) => {
        //This basically calls the reducer which will return an object with the specific part of the
        //state that its in charge of updating.
        nextState[key] = reducers[key](
          state[key],
          action
        );
        return nextState;
      },
      {}
    );
  };
};
// This is how reduce work in a general way.

[a, b, c, d, e].reduce(function(previousValue, currentValue) {
  return previousValue + currentValue;
}, initial_value);
// the initial value which is the one we will be filling does no have to be
// of the same type that the collection we iterating over.
//In the reducer above we are iterating over objects key (todos, filter)
//and we filling the empty array that is provided at the beginning.
```
