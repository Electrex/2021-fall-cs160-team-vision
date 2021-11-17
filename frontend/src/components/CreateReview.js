import React, { useState } from 'react';
//import { useHistory } from 'react-router-dom';
import axios from 'axios';
import "./style.css";

function CreateReview(props) {
    //const history = useHistory();

    //create review object according to backend api
    const createReview = (title, desc, link, image) => {
        return {title: title, description: desc, link: link, imageURL: image}
    };

    //establish hooks
    const [title, setTitle] = useState('');
    const [description, setDesc] = useState('');
    const [link, setLink] = useState('');
    const [imageURL, setImage] = useState('');

    // create initial clean state
    const dummy = createReview('','','','');

    //clear the state by setting state to dummy values
    const clearState = () => {
        setDesc(dummy.description);
        setImage(dummy.imageURL);
        setLink(dummy.link);
        setTitle(dummy.title);
    }
    
    //construct JSON from review object and send it to /api/review
    const postReview = async (event) => {
        event.preventDefault();
        const submitAttempt = createReview(title,description, link, imageURL)
        try {
            const token = sessionStorage.getItem('agora_token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                }
            };
            const body = JSON.stringify(submitAttempt);
            const response = await axios.post('/api/review', body, config); 
            if (response.status === 400 || response.status === 500) {
                return null
            }
            console.log(response.data);
            alert('Review Submitted!');
            return {error:false, body:response};
        } catch(error){
            return {error:true, body:error.response};
        }
    }

    const submitReview = async (event) => {
        const result = await postReview(event);
        if (!result.error){
            props.history.push('/me/reviews');
            alert('Review Submitted!');
        } else {
            if(result.body.status === 401){
                alert('You are not logged in! Click OK to proceed to the login page');
                clearState()
                props.history.push('/signin')
            }else{
                clearState()
            }
            
        }
    }
    return (
        <div className='DarkApp'>
            <div className='pageSwitcher'>
              <button 
                  onClick={() => props.history.goBack()} 
                  className='pageSwitcherItem'
              >
                  Go Back
              </button>
            </div>
            <h1 className='pageTitle'>Create your review here!</h1>
            <form onSubmit={event => submitReview(event)}>
                <label className='standardPage' htmlFor='link'>
                    Add a link to the product you are reviewing:
                </label><br />
                <input 
                    type='url'
                    placeholder='Product Page Hyperlink'
                    name='link'
                    value={link}
                    onChange={event => {setLink(event.target.value)}}
                    required
                /><br />
                <label className='standardPage' htmlFor='title'>
                    What is the title of your review?
                </label><br />
                <input 
                    type='text'
                    placeholder='My Review'
                    name='title'
                    value={title}
                    onChange={event => {setTitle(event.target.value)}}
                    required
                /><br />
                <label className='standardPage' htmlFor='desc'>
                    Enter your review here:</label> <br />
                <textarea
                    type='text'
                    placeholder='What is your opinion on the product?'
                    name='desc'
                    value={description}
                    onChange={event => {setDesc(event.target.value)}}
                    required
                />
                <br />
                <label className='standardPage' htmlFor='image'>
                    Add image URL here:
                </label><br />
                <input 
                    type='url'
                    placeholder='My image URL'
                    name='image'
                    value={imageURL}
                    onChange={event => {setImage(event.target.value)}}
                    required
                /><br />
                <input type='submit' className='btn btn-primary smallButton' value='Submit' />
            </form>
        </div>
    );
}

export default CreateReview;
