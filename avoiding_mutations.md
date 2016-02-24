Avoiding mutations with  concat(), slice(), ...spread.

```javascript
const addCounter = (list) => {
    return [...list, 0];
};

const removeCounter = (list, index) => {
  return [
    ...list.slice(0, index),
    ...list.slice(index + 1)
  ];
};

const incrementCounter = (list, index) => {
   return [
     ///slice the initial array from the beginning to the index
     /// spread them individually on the new array
     ...list.slice(0,index),
     list[index] + 1,
     ...list.slice([index+1])
   ];

   //concats concatenates arrays together
   //slice the array from beginning to the index
   //cats the incremented elements
   //slices and cats the rest of the array
//   return list
//     .slice(0,index)
//     .concat(list[index] + 1)
//     .concat(list.slice(index+1));
};

const testAddCounter = () => {
  const listBefore = [];
  const listAfter = [0];

  deepFreeze(listBefore);

  expect(
    addCounter(listBefore)
  ).toEqual(listAfter);
};

const testRemoveCounter = () => {
  const listBefore = [0, 10, 20];
  const listAfter = [0, 20];

  deepFreeze(listBefore);

  expect(
    removeCounter(listBefore, 1)
  ).toEqual(listAfter);
};

const testIncrementCounter = () => {
  const listBefore  = [0, 10, 20];
  const listAfter = [0, 11, 20];

  // freezes the initial list to avoid mutations
  // does recursive freezing throughout all the objects branches.
  deepFreeze(listBefore);

  expect(
    incrementCounter(listBefore, 1)
  ).toEqual(listAfter);
};

testAddCounter();
testRemoveCounter();
testIncrementCounter();

console.log('All test passed.');
```
Avoiding mutations with Object.assign() and ... spread.

```javascript
const toggleTodo = (todo) => {
// first argument is the object to be fill,
// the rest are the sources of properties that are going to fill the initial object
// for repeated properties on different sources the last declaration wins
//   return Object.assign({}, todo, {
//     completed: !todo.completed
//   })

  //spreads all the properties of the todo onto the new object and the overrides
  // the completed property
  return {
    ...todo,
    completed: !todo.completed
  };
};

const testToggleTodo = () => {
  const todoBefore = {
    id: 0,
    text: 'Learn Redux',
    completed: false
  };

  const todoAfter = {
    id: 0,
    text: 'Learn Redux',
    completed: true
  };

  deepFreeze(todoBefore);

  expect (
    toggleTodo(todoBefore)
  ).toEqual(todoAfter);
};

testToggleTodo();

console.log('All test passed yei');
```
Use Object.assign for objects and concat for arrays
