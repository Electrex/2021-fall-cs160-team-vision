import React, {Component, useState} from 'react';

class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
        const [email, setEmail] = useState('');
        const [name, setName] = useState('');
        const [password, setPassword] = useState('');
    }


    render() {


        return (
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
        )
    }
};

export default RegisterForm;