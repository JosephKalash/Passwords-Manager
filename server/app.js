const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./utils/database");
const User = require("./models/user");
const Password = require("./models/password");
const SharedPass = require("./models/shared_pass");

const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server); //create socket obj
const socketioAuth = require("./controllers/socket-auth");
const socketCAServer = require("./controllers/CA-server");
var ioCA = require('socket.io-client');
const { PORT = 8000 } = process.env;

app.use(bodyParser.urlencoded({ extended: true }));

socketCAServer(ioCA);
socketioAuth(io);

User.hasMany(Password);
User.hasMany(SharedPass);

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    server.listen(PORT, () => {
      console.log("\n****http://localhost:" + PORT + "*****");
    });
  })
  .catch((err) => {
    console.log(err);
  });
