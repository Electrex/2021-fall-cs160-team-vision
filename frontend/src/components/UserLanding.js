import React, { useState } from 'react';
import axios from 'axios';
import { useHistory, NavLink } from 'react-router-dom';

const profile = async (token) =>{
    try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        }
        const res = await axios.get('/api/profile/me', config);
        console.log(res.data);
        return res.data;
      } catch (error) {
        console.log(error.response.data);
      }
}

function UserLanding(props){
  const history = useHistory();
    const token = sessionStorage.getItem('agora_token');
    const json =  profile(token);
    const [query, setQuery] = useState('');

    const handleSearch = (query) => {
        history.push(`/users?${query}`);
    }

    return (
      <div className='DarkApp'>
        <div className='pageSwitcher'>
              <NavLink
                to='/me/profile'
                activeClassName='pageSwitcherItem-active'
                className='pageSwitcherItem'
              >
                Profile
              </NavLink>
              <NavLink
                to="/me/reviews"
                activeClassName='pageSwitcherItem-active'
                className='pageSwitcherItem'
              >
                Manage Reviews
              </NavLink>
              <button 
                  onClick={() => props.history.goBack()} 
                  className='pageSwitcherItem'
              >
                  Go Back
              </button>
        </div>
        
        <div>
            <input
            type='text'
            placeholder='Search for User'
            name='query'
            value={query}
            onChange={(e) => {setQuery(e.target.value)}}
            required
          />
          <button className='smallButton' onClick={(e) => handleSearch(query)}>Search</button>
        </div>
        <div>
          <h2 className='pageTitle'>
            Following:
          </h2>
          <h3>
            {json.followers}
          </h3>
        </div>
      </div>
    )
}

export default UserLanding