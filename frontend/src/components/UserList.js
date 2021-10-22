import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

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
          return {};
        }
        console.log(res.data);
        return res.data;
      } catch (error) {
        console.log(error.response.data);
        return {};
      }
}

function UserList(props) {
    const history = useHistory();
    const [query, setQuery] = useState('');
    const searchQuery = props.location.search.substring(1)
    // const searchResult = search(searchQuery)

    const handleSearch = (query) => {
        history.push(`/users?${query}`);
    }

    var rows = [];
    for (let i =0; i < 10; i++){
        rows.push((
            <tr>
                <td>User {i}</td>
                <td>{100*i + 3*i*i}</td>
                <td>{i*5}</td>
                <td><button>Follow</button></td>
                <td><button>View Profile</button></td>
            </tr>
        ))
    }

    const table = (
        <table>
            <thead>
                <tr>
                    <th>User Name</th>
                    <th>Followers</th>
                    <th>Reviews</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
    );

    return (
        <div className='Container'>
            <h1>User List</h1>
            <div>
            <input
                type='text'
                placeholder='Search for User'
                name='query'
                value={query}
                onChange={(e) => {setQuery(e.target.value)}}
                required
            />
            <button onClick={(e) => handleSearch(query)}>Search</button>
            <br></br><br></br>
            </div>
            <div>
                {table}
            </div>
        </div>
    );
}

export default UserList;