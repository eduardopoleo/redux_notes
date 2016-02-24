```javascript
//reducer todos that will control the state of the application
// takes the previous state and the action
const todos = (state = [], action ) => {
  switch (action.type) {
  // checks for the action type
   case 'ADD_TODO':
  //  the information for the new todo has to be extracted from the action
  // I wonder how do I keep an increasing id counter for rails apps
    return [
      // 'spread' all the current properties into the new array
      // and create the new element from the action information
      ...state,
      {
        id: action.id,
        text: action.text,
        completed: false
      }        
    ];

    case 'TOGGLE_TODO':
    //there always going to be a bit of logic to avoid mutating the todo
      return state.map(todo => {
        if (todo.id !== action.id) {
          return todo;
        }
        //again this spreads out the properties of the todo with action.id
        //and overwrites the completed property.
        return {
          ...todo,
          completed: !todo.completed
        };
      })
    default:
      return state;
  }
};

const testAddTodo = () => {
  const stateBefore = [];
// the action contain all the information necessary to produce a change in the state
  const action = {
    type: 'ADD_TODO',
    id: 0,
    text: 'Learn Redux'
  };

// each element of the state contains enough information to define a todo
  const stateAfter = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false
    }
  ];

  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(
    todos(stateBefore, action)
  ).toEqual(stateAfter);
};

const testToggleTodo = () => {
  const stateBefore = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false
    },

    {
      id: 1,
      text: 'Go shopping',
      completed: false
    }
  ];

  const stateAfter = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false
    },

    {
      id: 1,
      text: 'Go shopping',
      completed: true
    }
  ];

  const action = {
    type: 'TOGGLE_TODO',
    id: 1
  };

  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(
    todos(stateBefore, action)
  ).toEqual(stateAfter);
};

testAddTodo();
testToggleTodo();
console.log('All tests passed.');
```
