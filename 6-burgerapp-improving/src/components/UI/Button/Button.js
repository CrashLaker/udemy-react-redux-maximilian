import React from 'react';

import classes from './Button.css';

const button = (props) => {
  console.log('button', props)
  return (
    <button className={[classes.Button, classes[props.btnType]].join(' ')}
            disabled={props.disabled}
            onClick={props.clicked}>{props.children}</button>
  )
}

export default button;