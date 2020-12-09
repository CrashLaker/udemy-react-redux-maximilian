import React, { useState, useEffect } from 'react';
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

const burgerBuilder = (props) => {
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    props.onInitIngredients()
  }, [])

  const updatePurchaseState = (ingredients) => {
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


  const purchaseHandler = () => {
    if (props.isAuthenticated){
      setPurchasing(true)
    }else{
      props.onSetAuthRedirectPath('/checkout')
      console.log('burgerbuilder setauthredirect path /checkout')
      props.history.push('/auth')
    }
  }

  const purchaseCancelHandler = () => {
    setPurchasing(false)
  }

  const purchaseContinueHandler = () => {
    props.onInitPurchase()
    props.history.push({
      pathname: '/checkout',
    })
  }

  const disabledInfo = {
    //...this.state.ingredients
    ...props.ings
  }
  for (let key in disabledInfo){
    disabledInfo[key] = disabledInfo[key] <= 0
  }


  let burger = props.error ? <p>Ingredients cant be loaded</p> : <Spinner />
  let orderSummary = null
  //if (this.state.ingredients){
  if (props.ings){
      //burger = <Burger ingredients={this.state.ingredients}/>
      burger = <Burger ingredients={props.ings}/>
      orderSummary =  <OrderSummary ingredients={props.ings}
                        price={props.price}
                        purchaseCancel={purchaseCancelHandler}
                        purchaseContinue={purchaseContinueHandler}/>
  }

  return (
    <Aux>
      <Modal show={purchasing}
              modalClose={purchaseCancelHandler}>
              {orderSummary}
      </Modal>
      {burger}
      <BuildControls
        ingredientAdded={props.onIngredientAdded}
        ingredientRemoved={props.onIngredientRemoved}
        disabled={disabledInfo}
        purchasable={updatePurchaseState(props.ings)}
        ordered={purchaseHandler}
        price={props.price}
        isAuth={props.isAuthenticated}
        />
    </Aux>
  );

}

const mapStateToProps = state => {
  console.log(state)
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null,
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
    ),
    onSetAuthRedirectPath: (path) => dispatch(
      actions.setAuthRedirectPath(path)
    )
  }
}

//export default withErrorHandler(BurgerBuilder, axios);
export default connect(mapStateToProps, mapDispatchToProps)(
  withErrorHandler(burgerBuilder, axios)
)