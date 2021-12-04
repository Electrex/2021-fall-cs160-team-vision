import React, { useState, useEffect } from 'react';
import { useHistory, NavLink } from 'react-router-dom';
import axios from 'axios';

function ManageReview(props) {
    const history = useHistory();
    const [data, setData] = useState("");
    const getAllData = () => {

        // const config = {
        //     headers: {
        //       'Content-Type': 'application/json',
        //       'x-auth-token': sessionStorage.getItem('agora_token')
        //     }
        //   }
          
        // const res = await axios.get('/api/users/myID', config);
        // const id = res.id;

        axios
            .get(`/api/review/`)
            .then((response) => {
                console.log(response.data);
                setData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    useEffect(async () => {
        await getAllData();
    }, []);
    const displayData = () => {
        return data ? (
            data.map((data) => {
                return (
                    <div className='DarkApp standardPage' key={data.id}>
                        <h3>{data.title}<a href={data.link}>Buy</a></h3>
                        <img src={data.imageURL} height="400"></img>
                        <h4>{data.description}</h4>
                        <h4>{data.user.name}</h4>
                    </div>
                );
            })
        ) : (
            <div>
                <h3>Loading Data</h3>
            </div>
        );
    }

    return (
        <div className='DarkApp standardPage'>
            <div className='pageSwitcherShort'>
                            <NavLink
                                to='/me/reviews/add'
                                activeClassName='pageSwitcherItem-active'
                                className='pageSwitcherItem'
                            >
                                Create Review
                            </NavLink>
                            <button 
                                onClick={() => props.history.goBack()} 
                                className='pageSwitcherItem'
                            >
                                Go Back
                            </button>
                        </div>
            <h1 className='pageTitle'>Reviews</h1>
            {displayData()}
        </div>
    );
}

export default ManageReview;