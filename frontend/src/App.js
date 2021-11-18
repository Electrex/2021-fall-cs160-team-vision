import React, { useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import CreateReview from './components/CreateReview';
import LandingPage from './components/LandingPage';
import ManageReview from "./components/ManageReview";
import Login from './components/Login';
import Register from './components/Register';
import UserLanding from './components/UserLanding';
import UserList from './components/UserList';
import Profile from './components/Profile';
import About from './components/About';

function App(){
  return(
    <BrowserRouter>
      <main>
        <Switch>
          <Route path='/' exact component={LandingPage}/>
          <Route path='/me' exact component={UserLanding}/>
          <Route path='/me/profile' exact component={Profile}/>
          <Route path='/me/reviews' exact component={ManageReview}/>
          <Route path='/me/reviews/add' exact component={CreateReview}/>
          <Route path='/signin' exact component={Login}/>
          <Route path='/signup' exact component={Register}/>
          <Route path='/users' component={UserList}/>
          <Route path='/about' component={About}/>
          <Route path='/profile/:id' component={Profile}/>
        </Switch>
      </main>
    </BrowserRouter>
  )
}

export default App;
