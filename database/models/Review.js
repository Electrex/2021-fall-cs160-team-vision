const mongoose = require('mongoose');
require('mongoose-type-url');
const ReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    link: {
        type: mongoose.Schema.Types.Url,
        required: true
    },
    imageURL: {
        type: mongoose.Schema.Types.Url,
        required: true
    }
});

module.exports = Review = mongoose.model('review', ReviewSchema);