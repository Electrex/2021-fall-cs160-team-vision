import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

function ManageReview(props) {
    const history = useHistory();
    const [data, setData] = useState("");
    const getAllData = () => {
        axios
            .get("/api/review")
            .then((response) => {
                console.log(response.data);
                setData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    useEffect(() => {
        getAllData();
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
            <h3>No data yet</h3>
        );
    }

    return (
        <div>
            <h1 className='pageTitle'>Reviews</h1>
            {displayData()}
        </div>
    );
}

export default ManageReview;