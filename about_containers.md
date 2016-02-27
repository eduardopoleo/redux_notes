Problem: One big top level component:
- forces passing down props to many other intermediate components that really
 do not care about that info.
- This breaks the encapsulation principle because the top level component needs to
know about the state of all the children components.
- Re-rendering the whole application all the time is not very efficient.

Solution:
- Create intermediate container components that read of directly the state from
the store and that manage an specific part of the application.
- The Mother component does not pass down information anymore to all children.
- Gotcha: We have to subscribe ( or force the update) this new independent intermediate components
to the state of the store because they will not longer update with the render of the
mother component.
- He admits that the data flow less explicit.

```javascript
componentDidMount() {
this.unsubscribe =  store.subscribe(() =>
    this.forceUpdate()
  );
}

//Why do we have to unmount it (is it due to optimization?)
// Specifically, calling setState() in an unmounted component means that your app is
// still holding a reference to the component after the component has been unmounted -
// which often indicates a memory leak!
//Facebook recommends unsubscribing callbacks in the componentWillUnmount

componentWillUnmount(){
  this.unsubscribe();
  //This basically calls This
  store.subscribe(() => this.forceUpdate();)()
  //and this will unsubscribe
}



//This works because:
const subscribe = (listener) => {
  listeners.push(listener);

  return () => {
    listeners = listeners.filter(l => l !== listener);
  }
  //This function will be called subscribe()(listener)
};
```

By abstracting all the logic into containers components the final
top level component will look like this.

```javascript
const TodoApp = () => (
  <div>
   <AddTodo />
   <VisibleTodoList />
   <Footer />
  </div>
);
```
Consequenses:
- No need to pass any prop coming from the state cus each container manages its own state
- No need to create an explicit render function and subscribe it cus the containers are going to subscribe and update themselves
- There is only one initial explicit react render, the rest of the update is done through the forceUpdate calls. Is this a good pattern?
- forceUpdate just calls render()

```javascript
 ReactDOM.render(
   <TodoApp />,
   document.getElementById('root')
 )
```

EXTRA:
- Container components do not have to be at the top, presentational components can render container components as well.
- He even says that extracting into presentational components is not always the best choice

Problem: Extracting the state into a global variable and use it in all the containers.
- Bad for testing because we might want pass down a different store and not being tide up to the high level store. Can't you just test for the props?
- Makes it hard on the server because since all the reducers are pure we need to create an instance of the state for every request and I guess this is inefficient. Isn't this a problem even if I have different containers don't they have to re render as well everything.

Solution:
- Passing the store as prop for the first rendering and then pass it down to all the
the components inside them. Don't they have to render and update the state anyways.

Problem: Passing down the store down the line is clunky

Solution:
- Use react context to pass down the store information as children

```javascript
class Provider extends Component {
  getChildContext() {
    return {
      store: this.props.store
    };
  }

  render () {
    return this.props.children;
  }
}
//In this case defining this is necessary
Provider.childContextTypes = {
  store: React.PropTypes.object
};

ReactDOM { createStore } = Redux;

ReactDOM.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp />
  </Provider>,
  document.getElementById('root')
)

// Finally inside the components there is
const { store } = this.context

// Again this is necessary
Component.contextTypes = {
  store: React.PropTypes.object
};
```

To avoid boilerplate react redux provides a provider that automagically exposes
all the store to all the components that are being wrapped on it.

General pattern for the container component: video(27)
- Subscribe to the store when they mount
- Forceupdate and rerender when the there is a change in the state
- unsubscribe from the store when unmounted
- Get the full state from the store using context.  
- Render the presentational components passing the information they calculate from the
store/state
- specify the store in the store types

An example is this:
```javascript
class VisibleTodoList extends Component {
  componentDidMount(){
    // 1.Get the store from its corresponding context
    const { store } = this.context;
    // 2.subscribes to the redux store
    this.unsubscribe = store.subscribe(() =>
      // 3.updates in every change of the state
      this.forceUpdate()  
    );
  }
  // 4. Unsubscribe when unmounted
  componentWillUnmount() {
    this.unsubscribe();
  }
  //Render a presentational component passing down the:
    // - state info
    // - callback info
  render() {
    const props = this.props;
    const { store } = this.context;
    const state = store.getState();

    return (
      <TodoList
        todos={
          getVisibleTodos(
            state.todos,
            state.visibilityFilter
          )
        }
        onTodoClick={ id =>
          store.dispatch({
            type: 'TOGGLE_TODO',
            id
          })
        }
      />
    )
  }
}
// Generate the context types
VisibleTodoList.contextTypes = {
  store: React.PropTypes.object
};
```
Now with react redux you can re-write and break this down into this:

```javascript
const mapStateToProps = (state) => {
  return {
    todos: getVisibleTodos(
      state.todos, state.visibilityFilter
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTodoClick: (id) => {
      dispatch({
        type: "TOGGLE_TODO",
        id
      })
    }
  };
};
```
And then I can directly use the react-redux library and use

```javascript
const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList);
```

Edge Case.
- About a component that has no need to pass down props (from state)
- No need to pass callbacks
- Makes a dispatch and hence need to be get the store from the context

This component is sort of both the container an presentational. We can still
wrap it using connect to avoid requiring the context variable
This assumes that react-redux will keep at pace will the "unstable context"
```javascript
const AddTodo = (props, { store }) => {
  let input;

  return (
    <div>
      <input ref={node => {
        input = node;
      }} />
      <button onClick={() => {
        store.dispatch({
          type: 'ADD_TODO',
          id: nextTodoId++,
          text: input.value
        })
        input.value = '';
      }}>
        Add Todo
      <button/>
    </div>
  );
};

AddTodo.contextTypes = {
  store: React.PropsTypes.object
};
```
It can be changed into:

```javascript
AddTodo = connect(
  state => {
    return {};
  },

  dispatch => {
    return {dispatch}
  }
)(AddTodo);

AddTodo = connect(
  null,
  dispatch => {
    return {dispatch}
  }
)(AddTodo);

AddTodo = connect(
  null,
  null
)(AddTodo);
//Now it is pretty common to just connect to the store for the dispatch
// This equates to:
AddTodo = connect()(AddTodo)

const AddTodo = ({dispatch}) => {
  let input;

  return (
    <div>
      <input ref={node => {
        input = node;
      }} />
      <button onClick={() => {
        dispatch({
          type: 'ADD_TODO',
          id: nextTodoId++,
          text: input.value
        })
        input.value = '';
      }}>
        Add Todo
      <button/>
    </div>
  );
};
//And we got rid of the context definitions
```
CASE: When container props are require (in addition to the state) to calculate
the props for the child components.

```javascript
<FilterLink>
  render(){
    return(
      <Link
        active={
          this.props.filter === state.visibilityFilter
        }
        onClick={()=>
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter: props.filter
          })
        }
      >
      {props.children}
      </Link>
    );
  }
</FilterLink>

const mapStateToLinkProps = (
  state,
  ownProps
) => {
  return {
    active:
      ownProps.filter ===
      state.visibilityFilter
  };
};

const mapDispatchToProps = (
  dispatch,
  ownProps
) => {
  return {
    onClick: () => {
      dispatch({
        type: 'SET_VISIBILITY_FILTER',
        filter: ownProps.filter
      });
    }
  };
}

const FilterLink = connect(
  mapStateToLinkProps,
  mapDispatchToLinkProps
)(Link);
```
