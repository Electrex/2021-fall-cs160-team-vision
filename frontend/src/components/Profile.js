import React, { useState, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import axios from 'axios';
import './style.css';


// Function to get a profile, depending on if a user ID is provided
const fetchProfile = async (token, userID) => {
    if (userID != null) {
        return await getOtherProfile(token, userID);
    } else {
        return await getUserProfile(token);
    }
}


// Function to get the user profile using the session token
const getUserProfile = async (token) => {
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


// Function to get another user's profile using their user ID
const getOtherProfile = async (token, userID) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            }
        }
        const result = await axios.get(`/api/profile/${userID}`, config);
        return result.data;
    } catch (error) {
        console.log(error.response.data);
    }
}


// Function to follow the current profile
const handleFollow = async (token, userID) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            }
        }
        const body = {}
        const res = await axios.post(`/api/profile/follow/${userID}`, body, config);
        return res.data;
    } catch (error) {
        console.log(error.response.data);
    }
}


// Initial value for the profile state
const initialState = {
    username: '',
    followerCount: 0,
    followers: [],
    recommendations: []
}


// Function to get the names from each follower and reviews of the profile
const getLists = (response) => {
    if (response == null) {
        return [];
    }

    var followers = [];
    var recommendations = [];
    for (let i = 0; i < response.followers.length; i++) {
        followers.push(response.followers[i])
    }
    for (let i = 0; i < response.reviews.length; i++) {
        recommendations.push(response.reviews[i])
    }

    console.log(followers);
    console.log(recommendations);
    return [followers, recommendations];
}


// TODO: add a unfollow button to the profile
// TODO: add better formatting and view reviews to the recommendation list
// TODO: add better formatting to the followers list
// TODO: Address and fix edge case where the user ID happens to be the same as the logged-in user (to prevent following own profile).
function Profile(props) {
    const history = useHistory();
    const token = sessionStorage.getItem('agora_token');
    const [profileState, setProfileState] = useState(initialState);
    const userID = props.match.params.id; // Grabs user ID from the URL
    console.log(userID);

    useEffect(() => {
        fetchProfile(token, userID).then(response => {
            var currentState = {};

            // Placing followers and recs into separate lists seems to avoid the "Objects cannot be a React child" error
            // TODO: find a more elegant solution to this
            const lists = getLists(response);
            console.log(lists);
            if (response != null) {
                currentState = {
                    username: response.user.name,
                    followerCount: response.followers.length,
                    followers: lists[0],
                    recommendations: lists[1]
                }
            } else {
                currentState = initialState;
            }
            setProfileState(currentState);
        })
    }, [userID]);

    if (userID != null) { // A user ID was received by the profile page and is not the logged-in user
        return (
            <div className='App'>
                <div className='appAside' />
                <div className='appForm'>
                    <div>
                        <div className='pageSwitcherShort'>
                            <NavLink
                                to='/users'
                                activeClassName='pageSwitcherItem-active'
                                className='pageSwitcherItem'
                            >
                                Find Users
                            </NavLink>
                            <NavLink
                                to='/me'
                                activeClassName='pageSwitcherItem-active'
                                className='pageSwitcherItem'
                            >
                                Following
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
                        <h1>Profile</h1>
                        <button className='formFieldButton'
                            onClick={() => handleFollow(token, userID)}>
                            Follow
                        </button>
                        <p>Username: {profileState.username}</p>
                        <p>Number of Followers: {profileState.followerCount}</p>
                        <p>Followers: {profileState.followers.map(follower => <p>{follower.name} <button className='tableButton'
                            onClick={() => history.push(`/profile/${follower._id}`)}>View Profile</button></p>)}</p>
                        <p>User Reviews: {profileState.recommendations.map(rec => <p>{rec.title}</p>)}</p>
                    </div>
                </div>
            </div>);
    } else if (profileState != null && profileState !== initialState) { // No user id, but user is logged in
        return (
            <div className='App'>
                <div className='appAside' />
                <div className='appForm'>
                    <div>
                        <div className='pageSwitcherShort'>
                            <NavLink
                                to='/users'
                                activeClassName='pageSwitcherItem-active'
                                className='pageSwitcherItem'
                            >
                                Find Users
                            </NavLink>
                            <NavLink
                                to='/me'
                                activeClassName='pageSwitcherItem-active'
                                className='pageSwitcherItem'
                            >
                                Following
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
                        <h1>User Profile</h1>
                        <p>Username: {profileState.username}</p>
                        <p>Number of Followers: {profileState.followerCount}</p>
                        <p>Followers: {profileState.followers.map(
                            follower => <p>{follower.name} <button className='tableButton'
                                onClick={() => history.push(`/profile/${follower._id}`)}>View Profile</button></p>)}</p>
                        <p>User Reviews: {profileState.recommendations.map(rec => <p>{rec.title}</p>)}</p>
                    </div>
                </div>
            </div>);
    } else { // User is not logged in, meaning that profileState is null
        const handleSignIn = () => {
            history.push('/signin');
        }

        return (
            <div className='App'>
                <div className='appAside' />
                <div className='appForm'>
                    <div>
                        <div className='pageSwitcherShort'>
                            <NavLink
                                to='/users'
                                activeClassName='pageSwitcherItem-active'
                                className='pageSwitcherItem'
                            >
                                Find Users
                            </NavLink>
                            <NavLink
                                to='/me'
                                activeClassName='pageSwitcherItem-active'
                                className='pageSwitcherItem'
                            >
                                Following
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
                    </div>
                    <h1>Access Denied</h1>
                    <div>
                        <p>Sorry, you must be logged in to use this feature.</p>
                        <button className='formFieldButton'
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

