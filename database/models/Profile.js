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
    followers: {
      type: Number,
      default: 0
    },
    reviews: [
      {
        title: {
          type: String,
          required: true
        },
        description: {
          type: String,
          required: true
        },
        link: {
          type: String,
          required: true
        },
        image: {
          type: String,
          required: true
        }
      }
    ]
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);