import React, { useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import UserLanding from './components/UserLanding';

function App(){
  return(
    <BrowserRouter>
      <main>
        <Switch>
          <Route path='/' exact component={HomePage}/>
          <Route path='/login' exact component={Login}/>
          <Route path='/register' exact component={Register}/>
          <Route path='/me' exact component={UserLanding}/>
        </Switch>
      </main>
    </BrowserRouter>
  )
}

export default App;
