import React from 'react';
import { useHistory} from 'react-router-dom';

import "./style.css";

function LandingPage(props) {
    const history = useHistory();

    const routeChange = (path) => {
        history.push(path);
    }

    return (
        <div className='App'>
            <div className='appAside' />
            <div className='appForm'>
                <p>
                    For online-shoppers who want reliable sources for product reviews and recommendations, Agora is a social media service that implements a follower-based user-review system. 
                    Unlike other sites such as Amazon, which uses anonymous reviews, and Pinterest, which focus exclusively on photos, 
                    our site displays billboards with recommended products from other users, where products recommended by users with more followers are deemed a more attractive buyer’s choice.
                    </p>
            </div>
        </div>
    );
}

export default LandingPage;