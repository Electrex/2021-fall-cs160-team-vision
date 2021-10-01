import React, { useState } from 'react';
import axios from 'axios';

const profile = async (token) =>{
    try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        }
        const res = await axios.get('/api/profile/me', config);
        console.log(res.json);
        return res.json
      } catch (error) {
        console.log(error.response.data);
      }
}

function UserLanding(props){
    const token = localStorage.getItem('agora_token')
    const json = profile(token)

    return (
        <div>
            <h1>
                You are a user maybe 
            </h1>
        </div>
    )
}

export default UserLanding