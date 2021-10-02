import React, { useState } from 'react';
import axios from 'axios';

function Register(props) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const initialState = {
    name: '',
    email: '',
    password: '',
    password2: ''
  };

  const clearState = () => {
    setEmail(initialState.email);
    setName(initialState.name);
    setPassword(initialState.password);
    setPassword2(initialState.password2);
  };

  const register = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      console.log('Passwords do not match')
    } else {
      const newUser = {
        name,
        email,
        password
      }

      try {
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        }

        const body = JSON.stringify(newUser);

        const res = await axios.post('/api/users', body, config);
        clearState();
        if (res.status === 400 || res.status === 500){
          return null
        }
        console.log(res.data);
        sessionStorage.setItem('agora_token', res.data.token)
        return res.data
      } catch (error) {
        console.log(error.response.data);
        return null
      }
    }
  };

  const createProfile = async (e) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': sessionStorage.getItem('agora_token')
      }
    }

    const newProfile = {
      user: sessionStorage.getItem('agora_token'),
      bio: `Hi! I am ${name}`,
      followers: [],
      following: [],
      reviews: []
    }

    try{
      const body = JSON.stringify(newProfile)
      const res = await axios.post('/api/profile', body, config);
      if (res.status === 400 || res.status === 500){
        return null
      }
      console.log(res.data);
      return res.data
    } catch (error) {
        console.log(error.response.data);
        return null
    }
  }

  const handleRegister = async (e) => {
    if (await register(e)){
      if(await createProfile(e)){
        props.history.push('/me')
      }
      else{
        setEmail(initialState.email);
        setName(initialState.name);
        setPassword(initialState.password);
        setPassword2(initialState.password2);
      }
    }
    else{
      setEmail(initialState.email);
      setName(initialState.name);
      setPassword(initialState.password);
      setPassword2(initialState.password2);
    }
  }

  return (
    <div className='App'>
      <form className='registration' onSubmit={e => handleRegister(e)}>
        <h1>Register</h1>
        <div>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={(e) => {setName(e.target.value)}}
            required
          />
        </div>
        <div>
          <input
            type='text'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={(e) => {setEmail(e.target.value)}}
            required
          />
        </div>
        <div>
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            minLength='6'
            onChange={(e) => {setPassword(e.target.value)}}
            />
        </div>
        <div>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            value={password2}
            minLength='6'
            onChange={(e) => {setPassword2(e.target.value)}}
            />
        </div>
        <input type='submit' className='btn btn-primary' value='Submit' />
      </form>
    </div>
  );
}

export default Register;
