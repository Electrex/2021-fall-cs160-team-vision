import React from 'react';
import { NavLink, useHistory} from 'react-router-dom';

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

                <hr/>
                <p>Things below the hr tag is just for development to make things easier for people to view the page they are editing.</p>
                <button onClick={() => routeChange('/')}>LandingPage</button>
                <button onClick={() => routeChange('/me')}>UserLanding</button>
                <button onClick={() => routeChange('/me/reviews')}>ManageReview</button>
                <button onClick={() => routeChange('/me/reviews/add')}>CreateReview</button>
                <button onClick={() => routeChange('/signin')}>SignIn</button>
                <button onClick={() => routeChange('/signup')}>Register</button>
                <button onClick={() => routeChange('/users')}>UserList</button>
                <button onClick={() => routeChange('/profile')}>Profile</button>
            </div>
        </div>
    );
}

export default LandingPage;