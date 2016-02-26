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
  children,
  onClick
}) => {
  if (filter === currentFilter){
    return <span>{children}</span>
  }

  return (
    <a href='#'
       onClick={e => {
        e.preventDefault();
        onClick(filter);
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



const AddTodo = ({
  onAddClick
}) =>{
  let input;

  return (
   <input ref={node => {
        input = node;
      }} />
      <button onClick={() => {
        onAddClick(input.value);
        input.value = '';
      }}>
        Add Todo
      </button>
  )
}

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

const Footer = ({
    visibilityFilter
    onFilterlink
}) => (
  <p>
     Show:
     {' '}

      <FilterLink
        filter='SHOW_ALL'
        currentFilter={visibilityFilter}
        onClick={onFilterLink}
       >
        All
      </FilterLink>

       {' '}

      <FilterLink
        filter='SHOW_ACTIVE'
        currentFilter={visibilityFilter}
        onClick={onFilterLink}
       >
        Active
      </FilterLink>

       {' '}

      <FilterLink
        filter='SHOW_COMPLETED'
        currentFilter={visibilityFilter}
        onClick={onFilterLink}
       >
        Completed
      </FilterLink>
   </p>
)

const Todo = ({
  onClick,
  completed,
  text
}) => (
  <li
    onClick={onClick}
    style={{
            textDecoration: completed ?
              'line-through' :
              'none'
          }}>
       {text}
  </li>
);

const TodoList = ({
  todos,
  onTodoClick
}) => (
  <ul>
    {todos.map(todo =>
      <Todo
         key={todo.id}
         {...todos}
         onClick={() => onTodoClick(todo.id)}//I have to do this trick cus the id is recorded in here
         //so the click that is passed down does not have any idea of what's it own id
      />
    )}
  </ul>
);

const TodoApp = ({
  todos,
  visibilityFilter
}) => (
  <div>
     <AddTodo
        onAddClick={text =>
          store.dispatch({
          type: 'ADD_TODO',
          id: nextTodoId++,
          text //I think I can do this cus its text: text ES6 syntax sugar
        });
       }
     />
     <TodosList
        todos={
          getVisibleTodos(
            todos,
            visibilityFilter
           );
        }
        onTodoClick={id =>// I gotta remember that this is the input parameter
          store.dispatch({
            type: 'TOGGLE_TODO',
            id //-> this is the idk
          })
        } />
     <Footer
        visibilityFilter={visibilityFilter}
        onFilterClick{filter => //This is how you pass a function that expects value back
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter
          })
        }
      />
  </div>
 );


// Pass all the state elements as props in this case
// The visibility filter is just a string in the statek
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
