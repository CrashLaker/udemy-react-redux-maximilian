import React, { useState } from 'react';
import './App.css';
import Person from './Person/Person';

const app = props =>  {
  const [ personsState, setPersonsState ] = useState({
    persons: [
      {name: 'Max', age: 22},
      {name: 'Manu', age: 21},
      {name: 'Stephanie', age: 20},
    ]
  })

  const switchNameHandler = () => {
    //console.log('trigger click')
    setPersonsState({
      persons: [
        {name: 'Max', age: 22},
        {name: 'Manu', age: 21},
        {name: 'Stephanie', age: 20},
      ]
    })
  }

  return (
    <div className="App">
      <h1>Hi i'm a react app</h1> 
      <button onClick={switchNameHandler}>switch name</button>
      <Person name="CRASH" />
      <Person name="LOL">aaaaaaaa</Person>
      <Person name="CRASH" />
    </div>
  );
}


export default app;
