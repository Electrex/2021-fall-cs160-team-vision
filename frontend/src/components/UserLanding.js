import React, { useState } from 'react';
// import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useHistory, NavLink } from 'react-router-dom';
import UserList from './UserList';

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

const search = async (q) => {
    try {
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };

        const body = {'name': q};

        const res = await axios.post('/api/profile/byname', body, config);
        if (res.status === 400 || res.status === 500){
          return [];
        }
        console.log(res.data);
        return res.data;
      } catch (error) {
        console.log(error.response.data);
        return [];
      }
}

const fullList = async () => {
    try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          }
        }
        const res = await axios.get('/api/profile', config);
        console.log(res.data);
        return res.data;
      } catch (error) {
        console.log(error.response.data);
        return [];
      }
}

const myId = async () => {
  try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': sessionStorage.getItem('agora_token')
        }
      }
      const res = await axios.get('/api/users/myID', config);
      console.log(res.data);
      return res.data.id;
    } catch (error) {
      console.log(error.response.data);
      return '';
    }
}

function UserLanding(props){
  const history = useHistory();
    const [updateState, setUpdate] = useState(0);
    const token = sessionStorage.getItem('agora_token');
    const json =  profile(token);
    const [query, setQuery] = useState('');
    const [displayRows, setRows] = useState([]);
    const searchQuery = props.location.search.substring(1)
    let rows = [];

    const fetchData = async () => {
      let res;
      if (searchQuery.length === 0) {
        res = await fullList();
      } 
      else {
        res = await search(searchQuery);
      }
      return res;
    }

    const handleFollow = async (userId) => {
        try {
            const config = {
              headers: {
                'Content-Type': 'application/json',
                'x-auth-token': sessionStorage.getItem('agora_token')
              }
            }
            const body = {}
            const res = await axios.post(`/api/profile/follow/${userId}`, body, config);
            console.log(res.data);
          } catch (error) {
            console.log(error.response.data);
          }
          setUpdate(updateState + 1)
    }

    const viewProfile = (profileId) => {
        history.push(`/profile/${profileId}`)
    }

    useEffect(() => {
      const fetchData = async () =>{
          var searchResult = [];
          if (searchQuery.length == 0){
              searchResult = await fullList();
          }
          else{
              searchResult = await search(searchQuery);
          }
          const id = await myId();

          for (let i = 0; i < searchResult.length; i++){
              var buttonName = 'Follow';
              for (let j = 0; j < searchResult[i].followers.length; j++){
                if (searchResult[i].followers[j]._id == id){
                    buttonName = 'Unfollow'
                    rows.push((
                      <tr key = {i}>
                          <td className='tableRowLabelLeft'>{searchResult[i].user.name}</td>
                          <td className='tableRowLabelCenter'>{searchResult[i].followers.length}</td>
                          <td className='tableRowLabelCenter'>{searchResult[i].reviews.length}</td>
                          <td><button className='tableButton' 
                              onClick={()=>handleFollow(searchResult[i].user._id)}>
                                {buttonName}</button></td>
                          <td><button className='tableButton' onClick={()=>viewProfile(searchResult[i]._id)}>View Profile</button></td>
                      </tr>
                    ))
                }
              }    
          }
          setRows(rows)
      }
      fetchData();
  }, [updateState]);

    const table = (
        <table>
            <thead>
                <tr>
                    <th className='tableHeaderLabel'>Name</th>
                    <th className='tableHeaderLabel'>Followers</th>
                    <th className='tableHeaderLabel'>Reviews</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>{displayRows}</tbody>
        </table>
    );

    const handleSearch = (query) => {
        history.push(`/users?${query}`);
        setUpdate(updateState + 1);
    }

    return (
      <div className='DarkApp'>
        <div className='pageSwitcherShort'>
          <NavLink
            to='/users'
            activeClassName='pageSwitcherItem-active'
            className='pageSwitcherItem'
          >
            Find Users
          </NavLink>
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
            {table}
          </h3>
        </div>
      </div>
    )
}

export default UserLanding