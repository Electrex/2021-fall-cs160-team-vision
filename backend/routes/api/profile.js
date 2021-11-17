const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');

const Profile = require('../../../database/models/Profile');
const User = require('../../../database/models/User');
const Review = require('../../../database/models/Review');

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        // Search the database for a profile with the user containing the user id, populate the user field (with only the name and avatar)
        const profile = await Profile.findOne({ user: req.user.id })
            .populate('user', ['name', 'avatar'])
            .populate('followers')
            .populate('following')
            .populate('reviews');

        // If there is no profile found with this user id, error
        if(!profile) {
            return res.status(400).json({msg: 'There is no profile for this user'});
        }
        
        // Return the json object for the user profile in the response 
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/profile/:user_id
// @desc    Returns all profiles who have names which match or contain the searched-for name as a substring
// @access  Public
router.get('/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })
            .populate('user', ['name', 'avatar'])
            .populate('followers')
            .populate('following')
            .populate('reviews');
        return res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/profile/byname
// @desc    Returns all profiles who have names which match or contain the searched-for name as a substring
// @access  Public
router.post('/byname', [
        check('name', 'Name is required')
            .not()
            .isEmpty()
    ], 
    async (req, res) => {
        // validate name is not empty
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        
        // deconstruct body of post into the name field
        var {name} = req.body;

        // strip punctuation
        var punctuationless = name.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
        //remove extra whitespace leftover
        name = punctuationless.replace(/\s{2,}/g," ");

        // split name by 1 or more whitepaces
        var namearr = name.split(/\s+/);

        try {
            let profiles = await Profile.find()
                .populate('user', ['name', 'avatar'])
                .populate('followers')
                .populate('following')
                .populate('reviews');

            profiles = profiles.filter(function(profile) {
                // console.log(profile);
                return namearr.some(substring=>profile.user.name.toUpperCase().includes(substring.toUpperCase())); // return only profiles with names containing the substring, case insensitive
            });

            return res.json(profiles);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server error');
        }
    }
);

// @route   POST api/profile/follow/:user_id
// @desc    Follow/Unfollow a user's profile by their ID
// @access  Private
router.post('/follow/:user_id', auth, async (req, res) => {
    try {
        const currentUser = await User.findOne({_id: req.user.id});
        const currentProfile = await Profile.findOne({user: req.user.id});

        // search database for a user with the given user_id
        const otherUser = await User.findOne({ _id: req.params.user_id})
        const profile = await Profile.findOne({user: req.params.user_id});
        
        // If there is no such user, then return an error response since that user doesn't exist
        if (!profile) {
            return res.status(400).json({msg: 'Profile not found'});
        }

        // Profile.findOneAndUpdate({ user: req.params.user_id }, 
        //     { $pull: { followers: currentUser }},
        //     (err, data) => {
        //         if (err) {
        //             return res.status(400).json({msg: 'Profile not found'});
        //         }
        //         res.json(data);
        //     }
        // );

        // If this user is already following this profile, then unfollow, otherwise follow
        if (profile.followers.indexOf(currentUser.id) !== -1) {
            profile.followers.pull({ _id: currentUser.id });
            currentProfile.following.pull({ _id: otherUser.id});
        } else {
            profile.followers.push({ _id: currentUser.id });
            currentProfile.following.push({ _id: otherUser.id});
        }
        await profile.save();
        await currentProfile.save();

        // return the json object representation of this user's profile who we just followed
        return res.send(profile);
    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectID') {
            return res.status(400).json({msg: 'Profile not found'});
        }
        res.status(500).send('Server error');
    }
});

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post('/', [auth, [
    check('bio', 'Bio is required')
        .not()
        .isEmpty()
    ]],
    async (req, res) => {
        // check the payload fields for validity
        const errors = validationResult(req);
        // If status or skills fields are empty then return error to response
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        // deconstruct the request object payload into corresponding fields
        const {
            followers,
            bio,
            reviews
        } = req.body;

        // build the profile object based on the fields passed into the request
        const profileFields = {};
        profileFields.user = req.user.id;
        profileFields.followers = followers;
        profileFields.bio = bio;
        profileFields.reviews = reviews;

        try {
            // search the database for a profile with the current user id from the token
            let profile = await Profile.findOne({user: req.user.id});

            // if the user already has a profile, then update it with the new fields
            if(profile) {
                //Update
                profile = await Profile.findOneAndUpdate({user: req.user.id}, 
                    {$set: profileFields},
                    {new: true}
                );

                // return the newly updated profile as the response
                // res.header("Content-Type",'application/json');
                // res.send(JSON.stringify(profiles, null, 4));
                return res.json(profile);
            }

            // Create new profile with the fields and save it in the database
            profile = new Profile(profileFields);
            await profile.save();
            
            return res.send(profile);

        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server error');
        }

        res.send('Hello');
    }
)

// @route   GET api/profile
// @desc    Get all user profiles
// @access  Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find()
            .populate('user', ['name', 'avatar'])
            .populate('followers')
            .populate('following')
            .populate('reviews');
        // res.header("Content-Type",'application/json');
        // res.send(JSON.stringify(profiles, null, 4));
        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/profile/:profile_id
// @desc    Get profile by profile ID
// @access  Public
router.get('/:profile_id', async (req, res) => {
    try {
        // search database for a profile with the given user_id
        const profile = await Profile.findOne({_id: req.params.profile_id});
            .populate('user', ['name', 'avatar'])
            .populate('followers')
            .populate('following')
            .populate('reviews');
        
        // If there is no such user, then return an error response since that user doesn't exist
        if (!profile) {
            return res.status(400).json({msg: 'Profile not found'});
        }
        
        // return the json object representation of this user profile
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectID') {
            return res.status(400).json({msg: 'Profile not found'});
        }
        res.status(500).send('Server error');
    }
});


// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/:user_id', async (req, res) => {
    try {
        // search database for a profile with the given user_id
        const profile = await Profile.findOne({user: req.params.user_id})
            .populate('user', ['name', 'avatar'])
            .populate('followers')
            .populate('following')
            .populate('reviews');
        
        // If there is no such user, then return an error response since that user doesn't exist
        if (!profile) {
            return res.status(400).json({msg: 'Profile not found'});
        }
        
        // return the json object representation of this user profile
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectID') {
            return res.status(400).json({msg: 'Profile not found'});
        }
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/profile
// @desc    Delete profile and corresponding user
// @access  Private
router.delete('/', auth, async (req, res) => {
    try {
        //Remove profile
        await Profile.findOneAndRemove({user: req.user.id});

        //Remove user
        await User.findOneAndRemove({_id: req.user.id});
        res.json({msg: 'User deleted'});
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;