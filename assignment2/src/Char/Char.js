import React from 'react'


const char = (props) => {
  const style = {
    display: 'inline-block',
    padding: '16px',
    textAlign: 'center',
    margin: '16px',
    border: '1px solid black'
  }

  return (
    <div onClick={props.clicked} style={style}>
     {props.children} 
    </div>
  )
}


export default char