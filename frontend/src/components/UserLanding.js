import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';

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
    const [displayRows, setRows] = useState([]);

    const viewProfile = (profileId) => {
      history.push(`/profile/${profileId}`)
  }

    useEffect(() => {
      const fetchData = async () =>{
          var data = await profile(token);
          var follow = data.following
          var rows = [];
          for (let i = 0; i < follow.length; i++){
              rows.push((
                  <tr key = {i}>
                      <td className='tableRowLabelLeft'>{<img src={follow[i].avatar} height="50"></img>}</td>
                      <td className='tableRowLabelCenter'>{follow[i].name}</td>
                      <td><button className='tableButton' onClick={()=>viewProfile(follow[i]._id)}>View Profile</button></td>
                  </tr>
              ))
          }
          setRows(rows)
      }
      fetchData();
  }, []);

  const table = (
    <table>
        <thead>
            <tr>
                <th className='tableHeaderLabel'></th>
                <th className='tableHeaderLabel'></th>
                <th></th>
            </tr>
        </thead>
        <tbody>{displayRows}</tbody>
    </table>
);

    const handleSearch = (query) => {
        history.push(`/users?${query}`);
    }

    return (
      <div className='DarkApp'>
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