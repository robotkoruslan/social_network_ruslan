const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");
const cors = require("cors");
const users = require("./routes/users");
const config = require("./config/db");
const app = express();
const cookieSession = require("cookie-session")
const port = 3002;


app.use(cookieSession({
    name: 'session',
    keys: ["this is my secret"],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

// Passport init
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

app.use(cors());

app.use(bodyParser.json());

mongoose.connect(config.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

mongoose.connection.on("connected", () => {
  console.log("Succesfull conection to database");
});
mongoose.connection.on("error", (err) => {
  console.log("Not succesfull conection to database" + err);
});

app.listen(port, () => {
  console.log("Server was ranning" + port);
});

// WHERE LOGGED IN
app.get('/welcome', (req, res) => {
  if(req.session.user){
      return res.redirect('/');
  }
  res.sendFile(__dirname + '/index.html');
});

// WHERE LOGGED OUT
app.post('/logout', (req, res) => {
  req.session.user = null;
  res.json({
      success : true
  })
})

