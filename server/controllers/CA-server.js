const cryptoKeys = require("../crypto_keys");
const Certificate = require("../models/certificate");

module.exports = function CAServerSocket(io) {
  var socket = io.connect("http://localhost:8080/", {
    reconnection: true,
  });

  socket.on("connect", function () {
    console.log("connected to localhost:3000");

    socket.emit("digitalCertificate", cryptoKeys.publicKey, "localehost");

    socket.on("signedCertificate", function (sign) {
      console.log("sign from the CA server:", sign,'\n\n *++++++++++');
      Certificate.setCertificate(cryptoKeys.publicKey,'localhost',sign);
    });
  }); 
};
