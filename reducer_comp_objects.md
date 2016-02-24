```javascript
//Dan likes to have state as a parameter instead of todo
const todo = (todo, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if (todo.id !== action.id) {
        return state;
      }

      return {
        ...todo,
        completed: !todo.completed
      };
  default:
    return state;
  }
}

const todos = (state = [], action ) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(state, action)
      ];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action))
    default:
      return state;
  }
};

const visibilityFilter = ( state = 'SHOW_ALL', action ) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
}
//one reducer to manage all the global state of the application
//this reducer builds up the unique state of the application.
const todoApp = (state = {}, action) => {
  return {
    todos: todos(
      state.todos,
      action
    ),
    visibilityFilter: visibilityFilter(
      state.visibilityFilter,
      action
    )
  };
};

const { createStore } = Redux;
const store = createStore(todoApp);

console.log('initial state');
console.log(store.getState());
console.log('-------------')

console.log('Dispatching  ADD_TODO');
store.dispatch({
  type: 'ADD_TODO',
  id: 0,
  text: 'Learn Redux'
})

console.log('Current State');
console.log(store.getState());
console.log('----------------');

console.log('Dispatching  ADD_TODO');
store.dispatch({
  type: 'ADD_TODO',
  id: 1,
  text: 'Learn Redux'
})

console.log('Current State');
console.log(store.getState());
console.log('----------------');

console.log('Dispatching  TOGGLE_TODO');
store.dispatch({
  type: 'TOGGLE_TODO',
  id: 1
})

console.log('Current State');
console.log(store.getState());
console.log('----------------');
```
