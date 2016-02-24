This is how to composed reducers that will update a state array.
```javascript
// Extracted all the logic for updating one todo into its own reducer function
const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }

      return {
        ...state,
        completed: !state.completed
      };
  default:
    return state;
  }
}

// left the logic of updating the full state of the application into this higher level
// reducer
// when we have more different action that have to deal with other objects
// this will come in handy.
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
```
