import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import "./style.css";

function LandingPage(props) {
    const history = useHistory();

    const routeChange = (path) => {
        history.push(path);
    }

    return (
        <div className='App'>
            <div className='appAside' />
            <div className='appForm'>
                <div className='pageSwitcher'>
                    <NavLink
                        to='/signin'
                        activeClassName='pageSwitcherItem-active'
                        className='pageSwitcherItem'
                    >
                        Sign In
                    </NavLink>
                    <NavLink
                        to='/signup'
                        activeClassName='pageSwitcherItem-active'
                        className='pageSwitcherItem'
                    >
                        Sign Up
                    </NavLink>
            	</div>

                <h1>Agora</h1>
                <h3>The site to use for shoppers who are looking for recommendations from trusted reviewers.</h3>
                <p>To learn more about our vision, <a style={{color: '#ADD8E6'}} onClick={() => routeChange('/about')}>click here!</a></p>
                <hr/>
                <p>Things below the hr tag is just for development to make things easier for people to view the page they are editing.</p>
                <button onClick={() => routeChange('/')}>LandingPage</button>
                <button onClick={() => routeChange('/me')}>UserLanding</button>
                <button onClick={() => routeChange('/me/profile')}>Profile</button>
                <button onClick={() => routeChange('/me/reviews')}>ManageReview</button>
                <button onClick={() => routeChange('/me/reviews/add')}>CreateReview</button>
                <button onClick={() => routeChange('/signin')}>SignIn</button>
                <button onClick={() => routeChange('/signup')}>Register</button>
                <button onClick={() => routeChange('/users')}>UserList</button>
                <button onClick={() => routeChange('/about')}>About</button>
            </div>
        </div>
    );
}

export default LandingPage;