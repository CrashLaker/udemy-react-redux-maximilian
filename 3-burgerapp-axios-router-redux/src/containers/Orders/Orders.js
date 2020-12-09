import React, { Component } from 'react';

import Order from '../../components/Order/Order'
import axios from '../../axios-orders'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import order from '../../components/Order/Order';

class Orders extends Component {
  state = {
    orders: []
  }

  componentDidMount() {
    axios.get('orders.json').then((rs) => {
      const fetchedOrders = []
      for (let key in rs.data){
        fetchedOrders.push({
          ...rs.data[key],
          id: key,
        })
      }
      console.log(fetchedOrders)
      this.setState({
        orders: fetchedOrders
      })
    })
  }

  render() {
    return (
      <div>
        {this.state.orders.map((order) => {
          return <Order key={order.id} 
                        ingredients={order.ingredients} 
                        price={order.price}/>
        })}
      </div>
    )
  }
}

export default withErrorHandler(Orders, axios);