import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actionTypes from '../../store/actions';

import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
}

class BurgerBuilder extends Component {
  state = {
    //ingredients: {
    //  salad: 0,
    //  bacon: 0,
    //  cheese: 0,
    //  meat: 0
    //},
    //ingredients: null,
    //totalPrice: 4,
    //purchasable: false,
    purchasing: false,
    loading: false,
    error: false,
  }

  componentDidMount(){
    //axios.get('https://udemy-react-myburger-8cae3-default-rtdb.firebaseio.com/ingredients.json').then((rs) => {
    //  this.setState({ingredients: rs.data})
    //}).catch(err => {
    //  console.log(err)
    //  this.setState({error: true})
    //})
  }

  updatePurchaseState (ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey]
      })
      .reduce((sum, el) => {
        return sum + el
      }, 0)
    return sum > 0
  }


  purchaseHandler = () => {
    this.setState({ purchasing: true })
  }

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false })
  }

  purchaseContinueHandler = () => {
    this.props.history.push({
      pathname: '/checkout',
    })
  }

  render() {
    const disabledInfo = {
      //...this.state.ingredients
      ...this.props.ings
    }
    for (let key in disabledInfo){
      disabledInfo[key] = disabledInfo[key] <= 0
    }

    
    if (this.state.loading){
      orderSummary = <Spinner />
    }

    let burger = this.state.error ? <p>Ingredients cant be loaded</p> : <Spinner />
    let orderSummary = null
    //if (this.state.ingredients){
    if (this.props.ings){
        //burger = <Burger ingredients={this.state.ingredients}/>
        burger = <Burger ingredients={this.props.ings}/>
        orderSummary =  <OrderSummary ingredients={this.props.ings}
                          price={this.props.price}
                          purchaseCancel={this.purchaseCancelHandler}
                          purchaseContinue={this.purchaseContinueHandler}/>
    }

    return (
      <Aux>
        <Modal show={this.state.purchasing}
                modalClose={this.purchaseCancelHandler}>
                {orderSummary}
        </Modal>
        {burger}
        <BuildControls
          ingredientAdded={this.props.onIngredientAdded}
          ingredientRemoved={this.props.onIngredientRemoved}
          disabled={disabledInfo}
          purchasable={this.updatePurchaseState(this.props.ings)}
          ordered={this.purchaseHandler}
          price={this.props.price}
          />
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  console.log(state)
  return {
    ings: state.ingredients,
    price: state.totalPrice,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingName) => dispatch({
      type: actionTypes.ADD_INGREDIENT,
      ingredientName: ingName
    }),
    onIngredientRemoved: (ingName) => dispatch({
      type: actionTypes.REMOVE_INGREDIENT,
      ingredientName: ingName
    })
  }
}

//export default withErrorHandler(BurgerBuilder, axios);
export default connect(mapStateToProps, mapDispatchToProps)(
  withErrorHandler(BurgerBuilder, axios)
)