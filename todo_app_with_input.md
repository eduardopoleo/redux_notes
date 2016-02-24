```javascript
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
        return todo;
      }

      return {
        ...todo,
        completed: !todo.completed
      };
  default:
    return todo;
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

const { createStore } = Redux;
const { combineReducers } = Redux;

const { Component } = React;

const todoApp = combineReducers({
  todos,
  visibilityFilter
})

const store = createStore(todoApp);

let nextTodoId = 0;
//This is the view side of the application.
//the only interesting pattern is the ref callback. which allows me to refer
//to it when dispatching the action
//Also that I can inject ternaries inside the style prop
class TodoApp extends Component {
  render(){
    return (
      <div>
        <input ref={node => {
          this.input = node;
        }} />
        <button onClick={() => {
          store.dispatch({
            type: 'ADD_TODO',
            text: this.input.value,
            id: nextTodoId++
          });
          this.input.value = '';
        }}>
          Add Todo
        </button>
         <ul>
            {this.props.todos.map(todo =>
              <li key={todo.id}
                  onClick={() =>{
                    store.dispatch({
                      type: 'TOGGLE_TODO',
                      id: todo.id
                    });         
                  }}  
                  style={{
                          textDecoration: todo.completed ?
                            'line-through' :
                            'none'
                        }}>
                {todo.text}
              </li>
             )}
         </ul>
      </div>
    )
  }
}

const render = () => {
  ReactDOM.render(
    <TodoApp
      todos={store.getState().todos}
    />,
    document.getElementById('root')
  );
};
// The render methods will be registered as a listener and will be called everytime
//and action is dispatch
store.subscribe(render);
render();
```
