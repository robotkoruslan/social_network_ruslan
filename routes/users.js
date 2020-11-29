const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config/db");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const mongoose = require("mongoose");
var mongodb = require("mongodb");
const { json } = require("body-parser");
var ObjectId = mongodb.ObjectId;

// Users list
router.post("/", function (req, res) {
  const token = req.body.accessToken;
  User.findOne(
    {
      accessToken: token,
    },
    function (error, user) {
      if (user === null) {
        res.json({
          status: "error",
          message: "User has been logged out. Please login again.",
        });
      } else {
        User.find().then((user) =>
          res.json({
            status: "success",
            message: "Record has been fetched.",
            user: user,
          })
        );
      }
    }
  );
});
// router.post("/", function (req, res) {
//   const token = req.body.accessToken;
//   if (token == undefined) {
//     res.json({
//       status: "error",
//       message: "User has been logged out. Please login again.",
//     });
//   } else {
//     User.find(
//       {
//         accessToken: { $ne: token },
//       },
//       function (error, user) {
//         if (user === null) {
//           res.json({
//             status: "error",
//             message: "User has been logged out. Please login again.",
//           });
//         } else {
//           res.json({
//             status: "success",
//             message: "Record has been fetched.",
//             user: user,
//           });
//         }
//       }
//     );
//   }
// });

//Get user
router.post("/getUser", function (req, res) {
  const token = req.body.accessToken;
  User.findOne(
    {
      accessToken: token,
    },
    function (error, user) {
      if (user === null) {
        res.json({
          status: "error",
          message: "User has been logged out. Please login again.!!!",
          user
        });
      } else {
          res.json({
            status: "success",
            message: "Record has been fetched.",
            user: user
          })
      
      }
    }
  );
});

router.post("/post2", function (req, res) {
  const token = req.body.accessToken;
  const _id = req.body._id;
  User.findOne(
    {
      accessToken: token,
    },
    function (err, user) {
      if (user == null) {
        res.json("No token");
      } else {
        User.findOne(
          {
            _id: _id,
          },
          function (err, user) {
            if (user == null) {
              res.json("User not found");
            } else {
              res.json(user);
            }
          }
        );
      }
    }
  );
});

router.post("/post", function (req, res) {
  const accessToken = req.body.accessToken;
  const _id = req.body._id;
  User.findOne(
    {
      accessToken: accessToken,
    },
    function (err, user) {
      if (user == null) {
        res.json("Please login");
      } else {
        User.findOne(
          {
            _id: _id,
          },
          function (error, user) {
            if (user == null) {
              res.json("error User not found");
            } else {
              res.json(user);
            }
          }
        );
      }
    }
  );
});

router.post("/sendFriendRequest", function (req, res) {
  const accessToken = req.body.accessToken;
  const _id = req.body._id;

  User.findOne(
    {
      accessToken: accessToken,
    },
    function (error, user) {
      if (user == null) {
        res.json({
          status: "error",
          message: "User has been logged out. Please login again",
        });
      } else {
        const me = user;
        User.findOne(
          {
            _id: ObjectId(_id),
          },
          function (error, user) {
            if (user == null) {
              res.json({
                status: "error",
                message: "User does not exist",
              });
            } else {
              User.updateOne(
                {
                  _id: _id,
                },
                {
                  $push: {
                    friends: {
                      _id: me._id,
                      name: me.name,
                      status: "Pending",
                      sentByMe: false,
                      inbox: [],
                    },
                  },
                },
                function (error, data) {
                  User.updateOne(
                    {
                      _id: me._id,
                    },
                    {
                      $push: {
                        friends: {
                          _id: user._id,
                          name: user.name,
                          status: "Pending",
                          sentByMe: true,
                          inbox: [],
                        },
                      },
                    },
                    function (error, data) {
                      res.json({
                        status: "success",
                        message: "Friend request has been sent.",
                      });
                    }
                  );
                }
              );
            }
          }
        );
      }
    }
  );
});

router.post("/acceptFriendRequest", function (req, res) {
  const accessToken = req.body.accessToken;
  const _id = req.body._id;
  User.findOne(
    {
      accessToken: accessToken,
    },
    function (error, user) {
      if (user == null) {
        res.json({
          status: "error",
          message: "User has been logged out. Please login again",
        });
      } else {
        const me = user;
        User.findOne(
          {
            _id: _id,
          },
          function (error, user) {
            if (user == null) {
              res.json({ status: "error", message: "User does not exist" });
            } else {
              User.updateOne(
                {
                  _id: _id,
                },
                {
                  $push: {
                    notification: {
                      _id: _id,
                      type: "friend_request_accepted",
                      content: me.name + " accepted your friend request.",
                      createdAt: new Date().getTime(),
                    },
                  },
                }
              );
              User.updateOne(
                {
                  $and: [
                    {
                      _id: _id,
                    },
                    {
                      "friends._id": me._id,
                    },
                  ],
                },
                {
                  $set: {
                    "friends.$.status": "Accepted",
                  },
                },
                function (error, data) {
                  User.updateOne(
                    {
                      $and: [
                        {
                          _id: me._id,
                        },
                        {
                          "friends._id": user._id,
                        },
                      ],
                    },
                    {
                      $set: {
                        "friends.$.status": "Accepted",
                      },
                    },
                    function (error, data) {
                      res.json({
                        status: "success",
                        message: "Friend request has been accepted.",
                      });
                    }
                  );
                }
              );
            }
          }
        );
      }
    }
  );
});

router.post("/unfriend", function (req, res) {
  const accessToken = req.body.accessToken;
  const _id = req.body._id;
  User.findOne(
    {
      accessToken: accessToken,
    },
    function (error, user) {
      if (user == null) {
        res.json({
          status: "error",
          message: "User has been logged out. Please login again",
        });
      } else {
        const me = user;
        User.findOne(
          {
            _id: _id,
          },
          function (error, user) {
            if (user == null) {
              res.json({
                status: "error",
                message: "User does not exist",
              });
            } else {
              User.updateOne(
                {
                  _id: _id,
                },
                {
                  $pull: {
                    friends: {
                      _id: me._id,
                    },
                  },
                },
                function (error, data) {
                  User.updateOne(
                    {
                      _id: me._id,
                    },
                    {
                      $pull: {
                        friends: {
                          _id: user._id,
                        },
                      },
                    },
                    function (error, data) {
                      res.json({
                        status: "success",
                        message: "Friend has been removed.",
                      });
                    }
                  );
                }
              );
            }
          }
        );
      }
    }
  );
});

// router.get("/:username", (req, result) => {
//     User.findOne({
//         "username": req.params.username
//     }, function (error, user) {
//         if (user == null) {
//             result.send({
//                 "status": "error",
//                 "message": "User does not exists"
//             });
//         } else {
//             res.json(user)
//             // result.render("userProfile", {
//             //     "user": user
//             // });
//         }
//     });
// });

//Delete user
router.delete("/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id).then((user) => res.json(user));
});

// Register
router.get("/register", (req, res) => {
  res.send("Register Page");
});

router.post("/register", (req, res) => {
  const username = req.body.username;

  User.findOne(
    {
      username: username,
    },
    function (error, user) {
      if (user == null) {
        let newUser = new User({
          name: req.body.name,
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
          accessToken: "",
        });

        User.createUser(newUser, (err, user) => {
          if (err) {
            res.json({ status: "error", message: "User has not been added." });
          } else {
            res.json({ status: "success", message: "User has been added." });
          }
        });
      } else {
        res.json({ status: "error", message: "User already exist" });
      }
    }
  );

  //  res.redirect('/users/login');
});

// Login
router.get("/login", function (req, res) {
  res.send("login");
});

router.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne(
    {
      username: username,
    },
    function (error, user) {
      if (user == null) {
        res.json({
          status: "error",
          message: "User does not exist",
        });
      } else {
        bcrypt.compare(password, user.password, function (error, isVerify) {
          if (isVerify) {
            var accessToken = jwt.sign({ username: username }, config.secret);
            User.findOneAndUpdate(
              {
                username: username,
              },
              {
                $set: {
                  accessToken: accessToken,
                },
              },
              function (error, data) {
                res.json({
                  status: "success",
                  message: "Login successfully",
                  username: username,
                  accessToken: accessToken,
                  _id: user._id,
                });
              }
            );
          } else {
            res.json({
              status: "error",
              message: "Password is not correct",
            });
          }
        });
      }
    }
  );
});

// router.post("/login", (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   User.getUserByUsername(username, (err, user) => {
//     if (err) throw err;
//     if (!user) {
//       return res.json({ success: false, msg: "This user was not found." });
//     }

//     User.comparePassword(password, user.password, (err, isMatch) => {
//       if (err) throw err;
//       if (isMatch) {
//         const token = jwt.sign(user.toJSON(), config.secret, {
//           expiresIn: 3600 * 24,
//         });

//         res.json({
//           success: true,
//           token: "JWT" + token,
//           user: {
//             id: user._id,
//             name: user.name,
//             username: user.username,
//             email: user.email,
//           },
//         });
//         res.redirect("/login");
//       } else {
//         return res.json({ success: false, msg: "Password mismatch" });
//       }
//     });
//   });
// });

//Log out
router.get("/logout", function (req, res) {
  req.logout();
  res.send("logout");
  //res.redirect('/users/login');
});

// //Add friends
// router.post("/sendFriendRequest", function (req, res) {
//   const _id = req.fields._id;
// });

// //Add friends relationship between two users.
// router.post ('/addfriend', function (req, res) {
//     if (req.body.requestor && req.body.target) {
//         User.findOne({ email: req.body.requestor }, (err, requestor) => {
//             if (err)
//                 res.send(err);
//             if (requestor) {
//                 User.findOne({ email: req.body.target, friends: { $nin: [requestor._id] } }, (err, target) => {
//                     if (err) res.send(err);
//                     if (target) {

//                         //Add target to requestor's friend list
//                         User.findByIdAndUpdate(requestor._id,
//                             { "$push": { "friends": target._id } },
//                             { "new": true, "upsert": true },
//                             (err, user) => {
//                                 if (err)
//                                     res.send(err);
//                             });

//                         //Add target to requestor's followed list
//                         User.findByIdAndUpdate(requestor._id,
//                             { "$push": { "followed": target._id } },
//                             { "new": true, "upsert": true },
//                             (err, user) => {
//                                 if (err)
//                                     res.send(err);
//                             });

//                         //Add requestor to target's friend list
//                         User.findByIdAndUpdate(target._id,
//                             { "$push": { "friends": requestor._id } },
//                             { "new": true, "upsert": true },
//                             (err, user) => {
//                                 if (err)
//                                     res.send(err);
//                             });

//                         //Add requestor to target's friend list
//                         User.findByIdAndUpdate(target._id,
//                             { "$push": { "followed": requestor._id } },
//                             { "new": true, "upsert": true },
//                             (err, user) => {
//                                 if (err)
//                                     res.send(err);
//                             });

//                     } else {
//                         res.status(404).send("Requester and targeted user are friends already, or targeted user does not exist!");
//                     }

//                     res.status(200).json({
//                         success: true
//                     });
//                 });

//             } else {
//                 res.status(404).send("Requested user does not exist!");
//             }
//         });

//     } else {
//         res.status(400).send("wrong parameters!");
//     }
// })

module.exports = router;
