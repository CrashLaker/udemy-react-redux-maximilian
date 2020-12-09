import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';
import buildControls from '../../components/Burger/BuildControls/BuildControls';

export const addIngredient = (name) => {
  return {
    type: actionTypes.ADD_INGREDIENT,
    ingredientName: name,
  }
}

export const removeIngredient = (name) => {
  return {
    type: actionTypes.REMOVE_INGREDIENT,
    ingredientName: name,
  }
}

export const setIngredients = (ingredients) => {
  return {
    type: actionTypes.SET_INGREDIENTS,
    ingredients: ingredients,
  }
}

export const fetchIngredientsFailed = () => {
  return {
    type: actionTypes.FETCH_INGREDIENTS_FAILED,
  }
}

export const initIngredients = () => {
  return dispatch => {
    axios.get('https://udemy-react-myburger-8cae3-default-rtdb.firebaseio.com/ingredients.json').then((rs) => {
      dispatch(setIngredients(rs.data))
    }).catch(err => {
      dispatch(fetchIngredientsFailed())
    })
  }
}