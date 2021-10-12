import React, { useState } from 'react';
import axios from 'axios';

function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Start with empty text
    const initialState = {
        email: '',
        password: ''
    }

    // Function to clear email and password fields
    const clearState = () => {
        setEmail(initialState.email);
        setPassword(initialState.password);
    };

    // Function to check for login validity
    const login = async (e) => {
        e.preventDefault();

        const loginAttempt = {
            email,
            password
        }

        try {
            const config = {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            const body = JSON.stringify(loginAttempt)
            const result = await axios.post('/api/auth', body, config); // Authenticate email and password
            if (result.status === 400 || result.status === 500) {
                return null
            }
            sessionStorage.setItem('agora_token', result.data.token)
            console.log(result.data);
            return result.data
        } catch (error) {
            console.log(error.response.data);
            return null
        }
    }

    // Set page state depending on login success
    // TODO: pass user information into next page? Not sure if that is required
    const handleLogin = async (e) => {
        if (await login(e)) {
            props.history.push('/me')
        }
        else {
            setEmail(initialState.email);
            setPassword(initialState.password);
        }
    }

    return (
        <div>
            <form className='login' onSubmit={e => handleLogin(e)}>
                <h1>Login</h1>
                <div>
                    <input
                        type='text'
                        placeholder='Email Address'
                        name='email'
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                        required
                    />
                </div>
                <div>
                    <input
                        type='password'
                        placeholder='Password'
                        name='password'
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                        required
                    />
                </div>
                <input type='submit' className='btn btn-primary' value='Submit' />
            </form>
        </div>
    )
}

export default Login;
