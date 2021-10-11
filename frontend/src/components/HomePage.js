import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function HomePage(props) {
    const history = useHistory();

    const routeChange = (path) => {
        history.push(path);
    }

    return (
        <div className='Container'>
            <h1>Home Page</h1>
            <div className='RegisterLoginButtons'>
                <button onClick={() => routeChange('/register')}>Register</button>
                <button onClick={() => routeChange('/login')}>Log in</button>
            </div>
        </div>
    );
}

export default HomePage;