import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'
import Spinner from '../../components/UI/Spinner/Spinner'

import classes from './Auth.css'

import { updateObject } from '../../shared/utility'

import * as actions from '../../store/actions'

const auth = (props) => {
  const [authForm, setAuthForm] = useState({
    email: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Mail address',
      },
      validation: {
        required: true
      },
      touched: false,
      valid: false,
      value: 'test@test.com',
    },
    password: {
      elementType: 'input',
      elementConfig: {
        type: 'password',
        placeholder: 'Your password',
      },
      validation: {
        required: true,
        minLength: 7,
      },
      touched: false,
      valid: false,
      value: 'sorlaker',
    },
  }) 
  const [isSignup, setIsSignup] = useState(true)


  const inputChangeHandler = (event, controlName) => {
    const updatedControls = updateObject( authForm, {
        [controlName]: updateObject( authForm[controlName], {
            value: event.target.value,
            valid: checkValidity(
              event.target.value,
              authForm[controlName].validation
            ),
            touched: true
        })
      })

    setAuthForm(updatedControls)
  }

  useEffect(() => {
    if (!props.buildingBurger && props.authRedirectPath !== '/'){
      props.onSetAuthRedirectPath()
    }
  }, [])

  const checkValidity = (value, rules) => {
    let isValid = true 
    if (!rules) return isValid

    if (rules.required){
      isValid = value.trim() !== '' && isValid
    }

    if (rules.minLength){
      isValid = value.length >= rules.minLength && isValid
    }

    if (rules.maxLength){
      isValid = value.length <= rules.maxLength && isValid
    }

    return isValid
  }

  const submitHandler = (event) => {
    event.preventDefault();
    props.onAuth(
      authForm.email.value,
      authForm.password.value,
      isSignup,
    ) 
  }

  const switchAuthModeHandler = () => {
    setIsSignup(!isSignup)
  }

  const formElementsArray = [];
  for (let key in authForm){
    formElementsArray.push({
      id: key,
      config: authForm[key]
    })
  }

  let form = formElementsArray.map(formElement => (
    <Input key={formElement.id}
      elementType={formElement.config.elementType}
      elementConfig={formElement.config.elementConfig}
      value={formElement.config.value}
      invalid={!formElement.config.valid}
      shouldValidate={formElement.config.validation}
      touched={formElement.config.touched}
      changed={(event) => inputChangeHandler(event, formElement.id)}
        />
  ))

  if (props.loading){
    form = <Spinner />
  }

  let errorMessage = null;

  if (props.error){
    errorMessage = (
      <p>{props.error.message}</p>
    )
  }

  let authRedirect = null;
  if (props.isAuthenticated){
    authRedirect = <Redirect to={props.authRedirectPath}/>
  }

  return (
    <div className={classes.Auth}>
      {authRedirect}
      {errorMessage}
      <form onSubmit={submitHandler}>
        {form}
        <Button btnType="Success">SUBMIT</Button>
      </form>
      <Button btnType="Danger"
              clicked={switchAuthModeHandler}>
        Switch to {!isSignup ? 'SIGN UP' : 'SIGN IN'}
      </Button>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    buildingBurger: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
  } 
}

export default connect(mapStateToProps, mapDispatchToProps)(auth);