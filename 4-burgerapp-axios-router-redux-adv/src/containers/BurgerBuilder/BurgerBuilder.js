import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';

import axios from '../../axios-orders';

class BurgerBuilder extends Component {
  state = {
    purchasing: false,
  }

  componentDidMount(){
    this.props.onInitIngredients()
  }

  updatePurchaseState (ingredients) {
    if (!ingredients) return false
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
    this.props.onInitPurchase()
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


    let burger = this.props.error ? <p>Ingredients cant be loaded</p> : <Spinner />
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
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingName) => dispatch(
      actions.addIngredient(ingName)
    ),
    onIngredientRemoved: (ingName) => dispatch(
      actions.removeIngredient(ingName)
    ),
    onInitIngredients: () => dispatch(
      actions.initIngredients()
    ),
    onInitPurchase: () => dispatch(
      actions.purchaseInit()
    )
  }
}

//export default withErrorHandler(BurgerBuilder, axios);
export default connect(mapStateToProps, mapDispatchToProps)(
  withErrorHandler(BurgerBuilder, axios)
)