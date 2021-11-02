import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import './style.css';

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

function UserList(props) {
    const history = useHistory();
    const [query, setQuery] = useState('');
    const [displayRows, setRows] = useState([]);
    let [searchResult, setSearchResult] = useState([]);
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

    fetchData()
    .then(response => {
        setSearchResult(response)
        for (let i = 0; i < searchResult.length; i++){
            rows.push((
                <tr key = {i}>
                    <td className='tableRowLabelLeft'>{searchResult[i].user.name}</td>
                    <td className='tableRowLabelCenter'>{searchResult[i].followers.length}</td>
                    <td className='tableRowLabelCenter'>{searchResult[i].reviews.length}</td>
                    <td><button className='tableButton'>Follow</button></td>
                    <td><button className='tableButton'>View Profile</button></td>
                </tr>
            ))
        }
        setRows(rows);
    })

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
        window.location.reload(false);
    }

    return (
        <div className='DarkApp'>
            <h1 className='pageTitle'>User List</h1>
            <div>
            <input
                type='text'
                placeholder='Search for User'
                name='query'
                value={query}
                onChange={(e) => {setQuery(e.target.value)}}
                required
                className='searchFieldInput'
            />
            <button className='searchFieldButton' onClick={(e) => handleSearch(query)}>Search</button>
            <br></br><br></br>
            </div>
            <div>
                {table}
            </div>
        </div>
    );
}

export default UserList;
