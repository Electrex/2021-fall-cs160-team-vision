const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');

const Review = require('../../../database/models/Review');
const Profile = require('../../../database/models/Profile');

// @route   POST api/review
// @desc    Create a new review
// @access  Private
router.post('/', [auth, [
    check('title', 'Title is required')
        .not()
        .isEmpty(),
    check('description', 'Description is required')
        .not()
        .isEmpty(),
    check('link', 'Link is required')
        .not()
        .isEmpty(),
    check('imageURL', 'Image link is required')
        .not()
        .isEmpty()
    ]],
    async (req, res) => {
        // check the payload fields for validity
        const errors = validationResult(req);
        // If any fields are empty then return error to response
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        // deconstruct the request object payload into corresponding fields
        const {
            title,
            description,
            link,
            imageURL
        } = req.body;

        // build the review object based on the fields passed into the request
        const reviewFields = {};
        reviewFields.user = req.user.id;
        reviewFields.title = title;
        reviewFields.description = description;
        reviewFields.link = link;
        reviewFields.imageURL = imageURL;

        try {
            // Create new review with the fields and save it in the database
            review = new Review(reviewFields);
            await review.save();

            const profile = await Profile.findOne({ user: req.user.id });
            profile.reviews.push(review);
            await profile.save();

            return res.send(review);

        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server error');
        }
    }
)

// @route   GET api/review
// @desc    Get all product reviews
// @access  Public
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find().populate('user', ['name', 'avatar']);
        res.json(reviews);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/review/user/:user_id
// @desc    Get all reviews made by a specific user
// @access  Public
router.get('/user/:user_id', async (req, res) => {
    try {
        // search database for a profile with the given user_id
        const reviews = await Review.find({user: req.params.user_id}).populate('user', ['name', 'avatar']);
        
        // If there is no such user, then return an error response since that user doesn't exist
        if (!reviews) {
            return res.status(400).json({msg: 'User not found'});
        }
        
        // return the json object representation of all the user reviews
        res.json(reviews);
    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectID') {
            return res.status(400).json({msg: 'User not found'});
        }
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/review/:review_id
// @desc    Delete review by ID
// @access  Private
router.delete('/', auth, async (req, res) => {
    try {
        //Remove review
        await Review.findOneAndRemove({user: req.user.id, _id: req.params.review_id});

        const profile = await Profile.findOne({ user: req.user.id });
        profile.reviews.pull({ _id: req.params.review_id });
        await profile.save();

        res.json({msg: 'User deleted'});
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router