import React, { useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import CreateReview from './components/CreateReview';
import LandingPage from './components/LandingPage';
import ManageReview from "./components/ManageReview";
import SignIn from './components/SignIn';
import Register from './components/Register';
import UserLanding from './components/UserLanding';
import UserList from './components/UserList';

function App(){
  return(
    <BrowserRouter>
      <main>
        <Switch>
          <Route path='/' exact component={LandingPage}/>
          <Route path='/me' exact component={UserLanding}/>
          <Route path='/me/reviews' exact compoenent={ManageReview}/>
          <Route path='/me/reviews/add' exact compoenent={CreateReview}/>
          <Route path='/signin' exact component={SignIn}/>
          <Route path='/signup' exact component={Register}/>
          <Route path='/users' exact component={UserList}/>
        </Switch>
      </main>
    </BrowserRouter>
  )
}

export default App;
