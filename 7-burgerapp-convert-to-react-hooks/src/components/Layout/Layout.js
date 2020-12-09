import React, { useState } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';

import classes from './Layout.css'

const layout = props => {
  const [sideDrawerIsVisible, setSideDrawerIsVisible] = useState(false)

  const sideDrawerCloseHandler = () => {
    setSideDrawerIsVisible(false)
  }

  const sideDrawerToggle = () => {
    setSideDrawerIsVisible(!sideDrawerIsVisible)
  }

  return (
    <Aux>
      <Toolbar 
        isAuth={props.isAuthenticated}
        drawerToggleClicked={sideDrawerToggle}/>
      <SideDrawer closed={sideDrawerCloseHandler}
                  isAuth={props.isAuthenticated}
                  open={sideDrawerIsVisible}/>
      <main className={classes.Content}>
        { props.children }
      </main>
    </Aux>
  );
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
  }
}

export default connect(mapStateToProps)(layout);