Simple counter app with Redux

```javascript
//This is the reducer function
const counter = (state = 0, action) => {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    default:
      return state;
  }  
};

//The React components that form the dom elements to be updated
const Counter = ({
  value,
  onIncrement,
  onDecrement

  }) => (
  <div>
    <h1> {value} </h1>
    <button onClick={onIncrement}>+</button>
    <button onClick={onDecrement}>-</button>
  </div>
);

//instantiate the redux store
const {createStore} = Redux;
//We pass in the reducer function
const store = createStore(counter);

//This is the listener function that is called when an action is dispatch
//There are onClick call backs that are dispatch the an action on click
const render = () => {
  ReactDOM.render(
    <Counter
      value={store.getState()}
      onIncrement={()=>
        store.dispatch({
          type: 'INCREMENT'           
        })              
      }
      onDecrement={()=>
        store.dispatch({
          type: 'DECREMENT'           
        })              
      }
    />,
    document.getElementById('root')
  );
};

store.subscribe(render);
render();
```
