const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        // Search the database for a profile with the user containing the user id, populate the user field (with only the name and avatar)
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', 
        ['name', 'avatar']);

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
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});


// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', async (req, res) => {
    try {
        // search database for a profile with the given user_id
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar']);
        
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