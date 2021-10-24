import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import e from 'express';

function CreateReview(props) {
    // const history = useHistory();

    //create review object according to backend api
    const createReview = (title, image, description, link) => {
        return {title: title, description: description, link: link, imageURL: image}
    }

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
        event.preventDefault()
        const submitAttempt = createReview(title,description, link, imageURL)
        try {
            //const token = sessionStorage.getItem('agora_token');
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                    //'x-auth-token': token
                }
            }
            const body = JSON.stringify(submitAttempt)
            const result = await axios.post('/api/review', body, config); 
            if (result.status === 400 || result.status === 500) {
                return null
            }
            console.log(result.data);
            return result.data;
        } catch(error){
            console.log(error.response.data)
            return null
        }
    }

    const submitReview = (event) => {
        if (await postReview(event)){
            props.history.push('/me');
            alert('Review Submitted!');
        } else {
            clearState()
        }
    }
    return (
        <div className='Container'>
            <h1>Create your review here!</h1>
            <form onSubmit={event => submitReview(event)}>
                <label for='link'>
                    Add a link to the product you are reviewing:
                </label>
                <input 
                    type='url'
                    placeholder='Product Page Hyperlink'
                    name='link'
                    value={link}
                    onChange={event => {setLink(event.target.value)}}
                    required
                />
                <label for='title'>
                    What is the title of your review?
                </label>
                <input 
                    type='text'
                    placeholder='My Review'
                    name='title'
                    value={title}
                    onChange={event => {setTitle(event.target.value)}}
                    required
                />
                <label for='desc'>
                    Enter your review here:
                <textarea
                    type='text'
                    placeholder='What is your opinion on the product?'
                    name='desc'
                    value={description}
                    onChange={event => {setDesc(event.target.value)}}
                    required
                />
                </label>
                <label for='image'>
                    Add image URL here:
                </label>
                <input 
                    type='image'
                    placeholder='My image URL'
                    name='image'
                    value={imageURL}
                    onChange={event => {setImage(event.target.value)}}
                    required
                />
                <input type='submit' className='btn btn-primary' value='Submit' />
            </form>
        </div>
    );
}

export default CreateReview;
