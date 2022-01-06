const User = require("../models/user");
const cryptoKeys = require("../crypto_keys");
const cryptoMiddleware = require("./crypto-middleware");
const users = require("../models/users");
const { CA_PUBLIC_KEY } = require("../config");

const valideAndGetDeData = (data, sendedHmac, authNsp, eventName) => {
  const ddata = cryptoMiddleware.decipher(data, authNsp.symKey);
  const isEqual = cryptoMiddleware.checkDataHmac(sendedHmac, ddata, authNsp.symKey);

  if (!isEqual) {
    authNsp.emit(eventName, { message: "untrusted data" });
    return null;
  }
  // const signature = cryptoMiddleware.getSignature(ddata, cryptoKeys.privateKey);
  // const isVerified = cryptoMiddleware.verifySign(ddata, signature, cryptoKeys.publicKey);
  // if (!isVerified) {
  //   mainNsp.emit(eventName, { message: "untrusted data" });
  //   return null;
  // }

  return ddata;
};

const encrpytData = (authData, authNsp) => {
  const hmac = cryptoMiddleware.getHmac(authData, authNsp.symKey);
  const authDataEncrypted = cryptoMiddleware.cipher(authData, authNsp.symKey);

  return { hmac, authDataEncrypted };
};

var authenticate = async (authNsp, data, sendedHmac) => {
  let ddata = valideAndGetDeData(data, sendedHmac, authNsp, "auth:unauthorized");
  if (!ddata) return;

  const { email, password } = ddata;
  try {
    const user = await User.findOne({
      where: { email: email },
    });
    if (user && checkPasswords(password, user.password, cryptoKeys.key)) {
      console.log("****authenticated****");
      authNsp.userId = user.id;
      users[user.id] = authNsp.symKey;

      const authData = { userID: user.id, name: user.name, email: user.email };
      const { hmac, authDataEncrypted } = encrpytData(authData, authNsp);

      authNsp.emit("auth:authenticated", authDataEncrypted, hmac);
    } else {
      authNsp.emit("auth:unauthorized", {
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    authNsp.emit("auth:unauthorized", {
      message: "Authentication failure",
    });
  }
};

const checkPasswords = (sendedPass, userPass, sym) => {
  const sendedHashed = cryptoMiddleware.getHmac(sendedPass, sym);
  return sendedHashed === userPass;
};

module.exports = {
  registerHandler: function (client, authNsp) {
    client.on("auth:register", (data, hmac) => {
      console.log("******register*******");
      postSignup(client, authNsp, data, hmac);
    });
  },
  authenticationHandler: function (client, authNsp) {
    client.on("auth:authentication", function (data, hmac) {
      authenticate(authNsp, data, hmac);
    });
  },
};

var postSignup = async (client, authNsp, data, sendedHmac) => {
  let ddata = valideAndGetDeData(data, sendedHmac, authNsp, "auth:register:fail");
  if (!ddata) return;

  const { name, email, password, publicKey, ca_signature } = ddata;
  const isVerifiedByCA = cryptoMiddleware.verifySign(publicKey, ca_signature, CA_PUBLIC_KEY);

  console.log("---------------------------------------");
  if (isVerifiedByCA) {
    const msg = "User is trusted by the CA server!";
    console.log(msg);
    authNsp.emit("auth:caUserValidate", { email, message: msg, isSuccess: true });
  } else {
    const msg = "Sorry, Untrasted User! - we checked the CA server";
    console.log(msg);
    authNsp.emit("auth:caUserValidate", { email, message: msg, isSuccess: false });
  }
  console.log("---------------------------------------");

  //validation
  if (name && email && password && publicKey) {
    try {
      let existUser = await User.findOne({ where: { email: email } });
      //user exist
      if (existUser)
        return authNsp.emit("auth:register:fail", {
          email,
          message: "User Already Exists",
        });

      const hashed = cryptoMiddleware.getHmac(password, cryptoKeys.key);

      let user = await User.create({
        name: name,
        email: email,
        password: hashed,
        publicKey,
      });
      authNsp.userId = user.id;
      users[user.id] = authNsp.symKey;
      
      const authData = {
        userID: user.id,
        name: user.name,
        email: user.email,
        password: password,
      };
      const { hmac, authDataEncrypted } = encrpytData(authData, authNsp);
      return authNsp.emit("auth:register:done", authDataEncrypted, hmac);
    } catch (e) {
      console.log(e);
    }
  }
  return authNsp.emit("auth:register:fail", { email, message: "Uncorrect data" });
};
