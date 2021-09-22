import React, { useState } from 'react';
import Axios from "axios";

function App() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const register = () => {
    Axios.post('http://localhost:6969/api/users', {
      name: name,
      email: email,
      password: password,
    }).then((response) => {
      console.log('App: ', response);
    });
  };

  return (
    <div className='App'>
      <div className='registration'>
        <h1>Register</h1>
        <div>
          <label>Name</label>
          <input type='text'
                 onChange={(e) => {setName(e.target.value)}}/>
        </div>
        <div>
          <label>Email</label>
          <input type='text'
                 onChange={(e) => {setEmail(e.target.value)}}/>
        </div>
        <div>
          <label>Password</label>
          <input type='text'
                 onChange={(e) => {setPassword(e.target.value)}}/>
          <button onClick={register}>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default App;
