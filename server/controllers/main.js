const User = require("../models/user");
const Password = require("../models/password");
const cryptoMiddleware = require("./crypto-middleware");
const Certificate = require("../models/certificate");
const users = require('../models/users');

const valideAndGetDeData = (data, sendedHmac, mainNsp, signature, publicKey,symKey) => {
  const ddata = cryptoMiddleware.decipher(data, symKey);
  const isEqual = cryptoMiddleware.checkDataHmac(sendedHmac, ddata, symKey);

  if (!isEqual) {
    mainNsp.emit("main:uncompleteData", { message: "untrusted data" });
    return null;
  }

  const isVerified = cryptoMiddleware.verifySign(ddata, signature, publicKey);
  console.log(isVerified);
  if (!isVerified) {
    mainNsp.emit("main:uncompleteData", { message: "untrusted data" });
    return null;
  }

  return ddata;
};

const encrpytData = (passData, symKey) => {
  const hmac = cryptoMiddleware.getHmac(passData, symKey);
  const encryptedPassData = cryptoMiddleware.cipher(passData, symKey);

  return { hmac, encryptedPassData };
};

exports.passwords = function (client, mainNsp) {
  client.on("main:getPasswords", async function (id) {
    //check user if logedin
    const userId = id;
    console.log(users[userId]);
    if (!userId) return client.emit("main:unauthorized");

    let user = await User.findByPk(userId);
    if(!user)return client.emit("main:unauthorized");
    let passwords = await user.getPasswords();

    const { hmac, encryptedPassData } = encrpytData(passwords, users[userId]);

    client.emit("main:gotPasswords", encryptedPassData, hmac);
  });

  client.on("main:postPassword", async function (userID,data, sendedHmac, signature, cb) {
    const userId = userID;
    console.log(signature);

    if (!userId) return client.emit("main:unauthorized");

    let user = await User.findByPk(userId);
    if(!user) return client.emit("main:unauthorized");
    let ddata = valideAndGetDeData(data, sendedHmac, mainNsp, signature, user.publicKey,users[userId]);
    if (!ddata) return;

    const { title, username, value, description } = ddata;
    if (title && username && value) {
      let password = await Password.create({
        title: title,
        username: username,
        value: value,
        description: description,
      });
      await user.addPassword(password);

      if (password) {
        const { hmac, encryptedPassData } = encrpytData(password, users[userId]);
        cb();
        return client.emit(
          "main:passwordStored",
          {
            isSuccess: true,
            password: encryptedPassData,
          },
          hmac
        );
      } else return client.emit("main:passwordStored", { isSuccess: false });
    } else {
      client.emit("main:uncompleteData");
    }
  });

  client.on("main:deletePassword", async function (userID,data, sendedHmac, signature, onSuccess) {
    const userId = userID;

    if (!userId) return client.emit("main:unauthorized");

    let user = await User.findByPk(userId);
    if(!user) return client.emit("main:unauthorized");
    let ddata = valideAndGetDeData(data, sendedHmac, mainNsp, signature, user.publicKey,users[userId]);
    if (!ddata) return;

    const { id } = ddata;
    if (id) {
      let passwords = await user.getPasswords({ where: { id: id } });
      if (passwords) {
        let password = passwords[0];
        await password.destroy();

        onSuccess();
        return client.emit(
          "main:passwordDeleted",
          {
            isSuccess: true,
          }
        );
      } else return client.emit("main:passwordDeleted", { isSuccess: false });
    } else {
      client.emit("main:uncompleteData");
    }
  });

  client.on("main:editPassword", async function (userID,data, sendedHmac, signature, cb) {
    const userId = userID;
    let user = await User.findByPk(userId);
    if (!user) return client.emit("main:unauthorized");

    let ddata = valideAndGetDeData(data, sendedHmac, mainNsp, signature, user.publicKey,users[userId]);

    const { id, title, username, value, description } = ddata;

    cb();
    if (title && username && value) {
      let password = await Password.findOne({ where: { id, userId } });

      password.title = title;
      password.username = username;
      password.value = value;
      password.description = description;

      await password.save();
      if (password) {
        const { hmac, encryptedPassData } = encrpytData(password, users[userId]);

        return client.emit(
          "main:passwordEdit",
          {
            isSuccess: true,
            password: encryptedPassData,
          },
          hmac
        );
      } else return client.emit("main:passwordEdit", { isSuccess: false });
    } else {
      client.emit("main:uncompleteData");
    }
  });
};
//socket.conn.request._query[‘token’]
//  Socket= new Socket({ url: `http://localhost:3000/ {
//   transportOptions: {
//     polling: {
//       extraHeaders: {
//         'Authorization': 'Bearer abc',
//       },
//     },
//   },
// } });

/**
 * 2
 * * use password as symmetric key for encrypt and decrypt messages
 * * create common iv in client and srever
 * * use password and iv for create cipher and decipher
 * 3
 * * in third phase generate public-private keyes then send public key to
 * * client. client generate symmetric key then send it encrypted to server
 * * with server-public key help
 * * server decrypt with private key if succed then everything is OK
 * * then all connection will be encrypted and decrypted by that client-public key
 * */
