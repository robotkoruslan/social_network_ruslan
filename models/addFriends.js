const mongoose = require("mongoose");

const addFriendsSchema = mongoose.Schema({
  id: {
    type: String,
  },
  _ids: {
    type: Array,
  },
});

const addFriends = (module.exports = mongoose.model("addFriends", addFriendsSchema));