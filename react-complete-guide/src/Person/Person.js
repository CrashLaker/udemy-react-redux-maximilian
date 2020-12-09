import React from 'react';

const person = (props) => {
  return (
    <div>
      <p>i'm {props.name} a person {Math.random() * 100} </p>
      <p>{props.children}</p>
    </div>
  )
}


export default person;