const mongoose = require('mongoose');
const ProfileSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    bio: {
      type: String,
      required: true
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null
      }
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null
      }
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'review'
      }
    ]
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);