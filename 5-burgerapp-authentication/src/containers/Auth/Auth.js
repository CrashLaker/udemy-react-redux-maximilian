import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'
import Spinner from '../../components/UI/Spinner/Spinner'

import classes from './Auth.css'

import * as actions from '../../store/actions'

class Auth extends Component {
  state = {
    controls: {
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
    },
    isSignup:  true,
  }


  inputChangeHandler = (event, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: this.checkValidity(
          event.target.value, 
          this.state.controls[controlName].validation
        ),
        touched: true,
      }
    }

    this.setState({
      controls: updatedControls
    })
  }

  componentDidMount(){
    if (!this.props.buildingBurger && this.props.authRedirectPath !== '/'){
      this.props.onSetAuthRedirectPath()
    }
  }

  checkValidity(value, rules){
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

  submitHandler = (event) => {
    event.preventDefault();
    this.props.onAuth(
      this.state.controls.email.value,
      this.state.controls.password.value,
      this.state.isSignup,
    ) 
  }

  switchAuthModeHandler = () => {
    console.log('trigger switch auth mode')
    this.setState(prevState => {
      return {isSignup: !prevState.isSignup}
    })
  }

  render (){
    const formElementsArray = [];
    for (let key in this.state.controls){
      formElementsArray.push({
        id: key,
        config: this.state.controls[key]
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
        changed={(event) => this.inputChangeHandler(event, formElement.id)}
          />
    ))

    if (this.props.loading){
      form = <Spinner />
    }

    let errorMessage = null;

    if (this.props.error){
      errorMessage = (
        <p>{this.props.error.message}</p>
      )
    }

    let authRedirect = null;
    if (this.props.isAuthenticated){
      authRedirect = <Redirect to={this.props.authRedirectPath}/>
    }

    return (
      <div className={classes.Auth}>
        {authRedirect}
        {errorMessage}
        <form onSubmit={this.submitHandler}>
          {form}
          <Button btnType="Success">SUBMIT</Button>
        </form>
        <Button btnType="Danger"
                clicked={this.switchAuthModeHandler}>
          Switch to {!this.state.isSignup ? 'SIGN UP' : 'SIGN IN'}
        </Button>
      </div>
    )
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(Auth);