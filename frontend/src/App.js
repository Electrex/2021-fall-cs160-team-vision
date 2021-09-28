import React, { useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Register from './components/Register'
import UserLanding from './components/UserLanding';

function App(){
  return(
    <BrowserRouter>
      <main>
        <Switch>
          <Route path='/' exact component={Register}/>
          <Route path='/me' exact component={UserLanding}/>
        </Switch>
      </main>
    </BrowserRouter>
  )
}

export default App;
