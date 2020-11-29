var mongoose = require('mongoose');
var FriendsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String
});

mongoose.model('Friends', FriendsSchema);
module.exports = mongoose.model('Friends');