import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from '../../../axios-orders'

import Button from '../../../components/UI/Button/Button'
import Spinner from '../../../components/UI/Spinner/Spinner'
import Input from '../../../components/UI/Input/Input'
import classes from './ContactData.css'
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../../store/actions/index';


class ContactData extends Component {
  state = {
    //name: '',
    //email: '',
    //address: {
    //  street: '',
    //  postalCode: ''
    //},
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Name',
        },
        validation: {
          required: true
        },
        touched: false,
        valid: false,
        value: '',
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Street',
        },
        validation: {
          required: true
        },
        touched: false,
        valid: false,
        value: '',
      },
      zipCode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Zipcode',
        },
        validation: {
          required: true,
          minLength: 5,
          maxLength: 5,
        },
        touched: false,
        valid: false,
        value: '',
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Country',
        },
        validation: {
          required: true
        },
        touched: false,
        valid: false,
        value: '',
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your Email',
        },
        validation: {
          required: true
        },
        touched: false,
        valid: false,
        value: '',
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            { value: 'fastest', displayValue: 'fastest' },
            { value: 'cheapest', displayValue: 'cheapest' },
          ]
        },
        value: 'cheapest',
        valid: true,
      }
    },
    formIsValid: false,
    loading: false,
  }

  inputChangeHandler = (event, inputIdentifier) => {
    const updatedOrderForm = {
      ...this.state.orderForm
    }
    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier]
    }
    updatedFormElement.value = event.target.value
    updatedFormElement.valid = this.checkValidity(event.target.value, 
                                        updatedFormElement.validation)
    updatedFormElement.touched = true
    updatedOrderForm[inputIdentifier] = updatedFormElement

    let formIsValid = true 
    for (let inputIdentifier in updatedOrderForm){
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid
    }

    console.log(formIsValid) 

    this.setState({
      orderForm: updatedOrderForm,
      formIsValid: formIsValid,
    })
  }

  orderHandler = (event) => {
    event.preventDefault(); 
    const formData = {}
    for (let formElementIdentifier in this.state.orderForm){
      formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value
    }
    const order = {
      ingredients: this.props.ings,
      price: this.props.price,
      orderData: formData,
      userId: this.props.userId,
    }

    this.props.onOrderBurger(order, this.props.token)
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

  render() {
    const formElementsArray = [];
    for (let key in this.state.orderForm){
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key]
      })
    }
    let form = (
        <form>
          {formElementsArray.map(formElement => (
            <Input key={formElement.id}
                  elementType={formElement.config.elementType}
                  elementConfig={formElement.config.elementConfig}
                  value={formElement.config.value}
                  invalid={!formElement.config.valid}
                  shouldValidate={formElement.config.validation}
                  touched={formElement.config.touched}
                  changed={(event) => this.inputChangeHandler(event, formElement.id)}
                    />
          ))}
          <Button btnType="Success" 
                  disabled={!this.state.formIsValid}
                  clicked={this.orderHandler}>ORDER</Button>
        </form>
    );
    if (this.props.loading)
      form = <Spinner/>
    return (
      <div className={classes.ContactData}>
        <h4>Enter your contact data</h4>
        {form}
      </div>
    );
  }

}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));