import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function UserList(props) {
    const history = useHistory();
    const [query, setQuery] = useState('');
    const searchQuery = props.location.search.substring(1)

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
                {searchQuery}
            </div>
        </div>
    );
}

export default UserList;