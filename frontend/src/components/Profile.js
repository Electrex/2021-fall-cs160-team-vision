import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './style.css';


// Function to get user profile using the session token
const profile = async (token, userID) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            }
        }
        const result = await axios.get('/api/profile/me', config);
        return result.data;
    } catch (error) {
        console.log(error.response.data);
    }
}


// TODO: use /api/profile/:userid API call to support viewing of other people's profiles
// TODO: format the recommendation list (should have some profiles w/ existing recs in database to help test this)
// TODO: format the followers list (similar to above TODO)
function Profile(props) {
    const history = useHistory();
    const token = sessionStorage.getItem('agora_token');
    const [profileState, setProfileState] = useState({});

    const fetchProfile = async () => {
        // TODO: check if a userID was recieved
        return await profile(token, null);
    }

    fetchProfile().then(response => {
        var currentState = {};
        if (response != null) {
            currentState = {
                username: response.user.name,
                followerCount: response.followers.length,
                followers: response.followers,
                recommendations: response.reviews
            }
        } else {
            currentState = null;
        }
        setProfileState(currentState);
    })

    if (profileState != null) { // A profile state exists
        const handleFollow = () => {
            history.push('/');
        }

        return (
            <div className='App'>
                <div className='appAside' />
                <div className='appForm'>
                    <div>
                        <h1>Profile</h1>
                        <p>Username: {profileState.username}</p>
                        <p>Number of Followers: {profileState.followerCount}</p>
                        <button className='searchFieldButton'
                            onClick={() => handleFollow()}
                        >
                            Follow
                        </button>
                        <p>Followers: {profileState.followers}</p>
                        <p>User Recommendations: {profileState.recommendations}</p>
                    </div>
                </div>
            </div>);
    } else { // User is not logged in => profileState is null
        const handleSignIn = () => {
            history.push('/signin');
        }

        return (
            <div className='App'>
                <div className='appAside' />
                <div className='appForm'>
                    <h1>Profile</h1>
                    <div>
                        <p>Sorry, you must be logged in to use this feature.</p>
                        <button classname='formFieldButton'
                            onClick={() => handleSignIn()}
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Profile;
