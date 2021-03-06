import React, { Component } from 'react';

import axios from '../../../axios-orders'

import Button from '../../../components/UI/Button/Button'
import Spinner from '../../../components/UI/Spinner/Spinner'
import Input from '../../../components/UI/Input/Input'
import classes from './ContactData.css'


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
    this.setState({loading: true})
    const formData = {}
    for (let formElementIdentifier in this.state.orderForm){
      formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value
    }
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      orderData: formData
    }
    this.setState({loading: true})
    axios.post('/orders.json', order).then((rs) => {
      console.log(rs)
      this.setState({loading: false })
      this.props.history.push('/')
    }).catch(err => {
      this.setState({loading: false })
      console.log(err)
    })
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
    if (this.state.loading)
      form = <Spinner/>
    return (
      <div className={classes.ContactData}>
        <h4>Enter your contact data</h4>
        {form}
      </div>
    )
  }

}

export default ContactData;