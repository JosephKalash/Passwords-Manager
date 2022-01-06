require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const crypto = require("./crypto_middleware");

app.use(bodyParser.urlencoded({ extended: true }));

// const signature = crypto.getSignature('hello');
// const isVerified = crypto.verifySign('hello',signature);

io.on("connection", function (client) {
  console.log("*** server connected***");

  client.on("digitalCertificate", function (publicKey, domain) {
    console.log("*** server certificate signed***");

    const signature = crypto.getSignature(publicKey);
    
    client.emit("signedCertificate", signature);
  });

  client.on("disconnect", function () {
    console.log("***disconnect***");
  });
});

server.listen(8080, () => {
  console.log("\n****http://localhost:" + 8080 + "*****");
});
