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

///syntax is simpler: No class, extend, this.props
///Only render method basically
//No lifecycle method willRecieveProps, etc
//ref evaluate to null
const FilterLink = ({
  filter,
  currentFilter,
  children
}) => {
  if (filter === currentFilter){
    return <span>{children}</span>
  }

  return (
    <a href='#'
       onClick={e => {
        e.preventDefault();
        store.dispatch({
          type: 'SET_VISIBILITY_FILTER',
          filter
        });
       }}
    >
      {children}
    </a>
  );
}

const todoApp = combineReducers({
  todos,
  visibilityFilter
})

const store = createStore(todoApp);

const getVisibleTodos = (
  todos,
  filter
) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(
        t => t.completed
      )
    case 'SHOW_ACTIVE':
      return todos.filter(
       t => !t.completed
      )
  }
}

let nextTodoId = 0;
//This is the view side of the application.
//the only interesting pattern is the ref callback. which allows me to refer
//to it when dispatching the action
//Also that I can inject ternaries inside the style prop
class TodoApp extends Component {
  render(){
    const {
      todos,
      visibilityFilter
    } = this.props

    const visibleTodos = getVisibleTodos(
      todos,
      visibilityFilter
    );
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
            {visibleTodos.map(todo =>
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
         <p>
           Show:
           {' '}

            <FilterLink
              filter='SHOW_ALL'
              currentFilter={visibilityFilter}  
             >
              All
            </FilterLink>

             {' '}

            <FilterLink
              filter='SHOW_ACTIVE'
              currentFilter={visibilityFilter}  
             >
              Active
            </FilterLink>

             {' '}

            <FilterLink
              filter='SHOW_COMPLETED'
              currentFilter={visibilityFilter}  
             >
              Completed
            </FilterLink>
         </p>
      </div>
    )
  }
}



const render = () => {
  ReactDOM.render(
    <TodoApp
      {...store.getState()}
    />,
    document.getElementById('root')
  );
};
// The render methods will be registered as a listener and will be called everytime
//and action is dispatch
store.subscribe(render);
render();
```
