STATE: Minimum representation of the data in the app.
Properties:
- There is only one per application
- Is immutable.
- It can only be changed by dispatching actions

ACTION: Minimum representation of the change of data of your application.

Properties:
- Must contain a property 'type' with a string value
{
  type: "INCREMENT
}
E,g the app is just a counter

Sometimes a more complex object is required to express the change in the application

{
  type: "INCREMENT",
  index: 1
}
In case that there are different counters

{
  id: 0,
  text: "hey",
  type: "ADD_TODO"
}
In the case of a todo application


Pure Function: Does not change the value passed to them and have not side effects

function square(x) {
  return x * x
}

Impure Function: Call the database or the network and have side-effects

PRINCIPLE:
The ui is best represented with with pure function of the application STATE
Redux
- The mutation of the state is best represented as a pure function of the:
ACTION and PREVIOUS STATE
- And returns the next state of the application

PRINCIPLE: You have to write a function that takes the 'Previous State', 'Action'
and return a NEW state representing the new data of the application.
This function is called REDUCER

A simple example of a reducer is

```javascript
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

expect(
  counter(0, {type: "INCREMENT"})
).toEqual(1);

expect(
  counter(1, {type: "INCREMENT"})
).toEqual(2);

expect(
  counter(2, {type: "DECREMENT"})
).toEqual(1);

expect(
  counter(1, {type: "DECREMENT"})
).toEqual(0);

expect(
  counter(1, {type: "SOMETHING"})
).toEqual(1);

expect(
  counter(undefined, {})
).toEqual(0);

console.log("Your test have passed yei");
```


```javascript
//reducer function pure function that returns the new state for a given action
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

//redux provide a store
const { createStore } = Redux;
//the store as of now takes as a parameter the reducer function
const store = createStore(counter);

const render = () => {
  document.body.innerText = store.getState();
};

//can subscribe to callbacks which tell what to do when an action is called
store.subscribe(render);
render(); //this will render the initial state

document.addEventListener('click', () => {
  //dispatch action that will trigger change the state
  store.dispatch({type: 'INCREMENT'});
});
//Every time we click on the document an action is dispatched
//This action changes the state of the application
//And the render callback is run
```
What we know about the store:

- Takes in the reducer function
- It is able to subscribe to callback functions
- It is able to dispatch actions to modify the state
- It stores the current state

Little side note about arrow functions in JS

```javascript
  function (parameter) {
    return 'something'
  }
  //drop the name of function
  (parameter) => {
    return 'something'
  }

  (parameter) => 'something' //does an implicit return when it is a single statement
  //does not matter if it is spread accross different lines

  //little exercise  transform into ES6

  function getVerifiedToken(selector) {
    return getUsers(selector)
      .then(function (users) { return users[0]; })
      .then(verifyUser)
      .then(function (user, verifiedToken) { return verifiedToken; })
      .catch(function (err) { log(err.stack); });
  }

  function getVerifiedToken(selector){
    return getUsers(selector)
      .then(users => users[0])
      .then(verifyUser)
      .then((user, verifiedToken) => verifiedToken)
      .catch(err => log(err.stack));
  }

  const getVerifiedToken = selector =>
    getUsers(selector)
      .then(users => users[0])
      .then(verifyUser)
      .then((user, verifiedToken) => verifiedToken)
      .catch(err => log(err.stack));
  //rules

  //We can evoke a return function
  function d() {
    function e() {
        alert('E');
    }
    return e;
  }
  d()(); //This is how we evoke the returned function.
  //alerts 'E'
```

And this is the whole story with the store created from scratch.

```javascript
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


const store = createStore(counter);

const render = () => {
  document.body.innerText = store.getState();
};

store.subscribe(render);
render();

document.addEventListener('click', () => {
  store.dispatch({type: 'INCREMENT'});
});
```
