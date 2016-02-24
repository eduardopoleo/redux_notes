```javascript

//This is (I think) for the top level reducer
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

const {combineReducers} = Redux;

// the above top level reducer is equivalent to this
const todoApp = combineReducers({
  todos: todos,
  visibilityFilter: visibilityFilter
})
```
For a state like this

```javascript
  [object Object] {
    todos: [[object Object] {
    completed: false,
    id: 0,
    text: "Learn Redux"
  }],
    visibilityFilter: "SHOW_ALL"
  }
```

- The key is equal to the name of the state the manage (state.todos, state.visibilityFilter)
- The values are the reducers it should call to update the corresponding parts of
the state.

This top level reducer will assemble the result into a single top level object.
CONVENTION: Name the reducer after the state key the manage. This simplifies the
combination to :

```javascript
  const todoApp = combineReducers({
    todos,
    visibilityFilter
  })
```
