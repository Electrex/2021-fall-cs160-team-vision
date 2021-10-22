import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const search = async (q) => {
    try {
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        }

        const body = {'name': q};

        const res = await axios.post('/api/profile/byname', body, config);
        clearState();
        if (res.status === 400 || res.status === 500){
          return {}
        }
        console.log(res.data);
        return res.data
      } catch (error) {
        console.log(error.response.data);
        return {}
      }
}

function UserList(props) {
    const history = useHistory();
    const [query, setQuery] = useState('');
    const searchQuery = props.location.search.substring(1)
    const searchResult = search(searchQuery)

    const handleSearch = (query) => {
        history.push(`/users?${query}`);
    }

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
            </div>
            <div>
                {searchResult}
            </div>
        </div>
    );
}

export default UserList;