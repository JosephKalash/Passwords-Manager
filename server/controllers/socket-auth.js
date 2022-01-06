const auth = require("./auth");
const main = require("./main");
const sp = require("./share_pass");
const cryptoKeys = require("../crypto_keys");
const cryptoMiddleware = require("./crypto-middleware");
const Certificate = require("../models/certificate");

/**
 * @param {Object} io - the socket.io server socket
 * authenticate - indicates if authentication was successfull
 * postAuthenticate=noop -  called after the client is authenticated
 */

module.exports = function socketIOAuth(io) {
  const authNsp = io.of("/auth");
  const mainNsp = io.of("/main");
  authNsp.on("connection", function (client) {
    client.emit("auth:publicKey", cryptoKeys.publicKey, Certificate.getCertificate());
    client.on("auth:symmetricKey", function (data) {
      const symKey = cryptoMiddleware.getSymmetricByPrivate(data);

      console.log("***got session key***");
      client.symKey = symKey;
      client.emit("symmetric:done");
    });

    auth.registerHandler(client, client);

    auth.authenticationHandler(client, client);

    client.on("disconnect", function () {
      console.log("***disconnect auth***");
    });
  });

  // mainNsp.use((client, next) => {
  //   client.user = user;
  //   next();
  // });
  mainNsp.on("connection", function (client) {
    main.passwords(client, client);

    sp.sharePass(client, client);
    client.on("disconnect", function () {
      console.log("***disconnect  main***");
    });
  });
};
