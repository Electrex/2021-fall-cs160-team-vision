import React, { useState } from 'react';
import {Route, Switch, useHistory} from 'react-router-dom';
import UserLanding from "./UserLanding";
import ManageReview from "./ManageReview";
import CreateReview from "./CreateReview";
import SignIn from "./SignIn";
import Register from "./Register";
import UserList from "./UserList";
import Profile from './Profile';

function LandingPage(props) {
    const history = useHistory();

    const routeChange = (path) => {
        history.push(path);
    }

    return (
        <div className='Container'>
            <h1>Home Page</h1>
            <div className='RegisterLoginButtons'>
                <button onClick={() => routeChange('/signup')}>Register</button>
                <button onClick={() => routeChange('/signin')}>Log in</button>
            </div>

            <hr/>
            {/* Things below the hr tag is just for development, to make things easier for people to view the page they are editing*/}
            <button onClick={() => routeChange('/')}>LandingPage</button>
            <button onClick={() => routeChange('/me')}>UserLanding</button>
            <button onClick={() => routeChange('/me/reviews')}>ManageReview</button>
            <button onClick={() => routeChange('/me/reviews/add')}>CreateReview</button>
            <button onClick={() => routeChange('/signin')}>SignIn</button>
            <button onClick={() => routeChange('/signup')}>Register</button>
            <button onClick={() => routeChange('/users')}>UserList</button>
            <button onClick={() => routeChange('/profile')}>Profile</button>

        </div>
    );
}

export default LandingPage;