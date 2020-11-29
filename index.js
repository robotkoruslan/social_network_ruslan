const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");
const cors = require("cors");
const users = require("./routes/users");
const config = require("./config/db");
const app = express();
const port = 3001;



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

app.use('/users', users);