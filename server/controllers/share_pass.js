const SharedPass = require("../models/shared_pass");
const Password = require("../models/password");
const User = require("../models/user");
const cryptoMiddleware = require("./crypto-middleware");
const { Op } = require("sequelize");
const Users = require("../models/users");

const valideAndGetDeData = (data, sendedHmac, mainNsp, signature, publicKey, symKey) => {
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

const encrpytData = (data, symKey) => {
  const hmac = cryptoMiddleware.getHmac(data, symKey);
  const encryptedData = cryptoMiddleware.cipher(data, symKey);

  return { hmac, encryptedData };
};

exports.sharePass = function (client, mainNsp) {
  client.on("main:getUsersInfo", async function (id) {
    const userId = id;
    const userExist = await User.findByPk(userId);
    if (!userExist) return mainNsp.emit("main:unauthorized");

    const users = await User.findAll({ where: { id: { [Op.not]: userId } } });

    const usersList = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      publicKey: user.publicKey,
    }));

    const { hmac, encryptedData } = encrpytData(usersList, Users[userId]);
    mainNsp.emit(
      "main:gotUsersInfo",
      {
        users: encryptedData,
      },
      hmac
    );
  });

  client.on("main:postSharedPass", async function (id, data, signature, recieverId) {
    const userId = id;
    let sender = await User.findByPk(userId);
    let reciever = await User.findByPk(recieverId);

    if (!userId || !reciever) return mainNsp.emit("main:unauthorized");

    if (data && signature && reciever) {
      let sharedPass = await SharedPass.create({
        value: data,
        sednerId: userId,
        senderPublicKey: sender.publicKey,
        signature: signature,
        userId: recieverId,
      });
      // await reciever.addSharedpass(sharedPass);

      mainNsp.emit("main:sharedDone", sharedPass);
    } else mainNsp.emit("main:uncompletedData");
  });

  client.on("main:getSharedPass", async function (id) {
    const userId = id;

    let user = await User.findByPk(userId);
    if (!user) return mainNsp.emit("main:unauthorized");

    const sharedPasswords = await SharedPass.findAll({ where: { userId } });
    const results = await Promise.all(
      sharedPasswords.map(async (pass) => {
        const sender = await User.findByPk(pass.sednerId);
        return {
          sender: {
            id: sender.id,
            email: sender.email,
            name: sender.name,
          },
          value: pass.value,
          id: pass.id,
          signature: pass.signature,
          senderPublicKey: pass.senderPublicKey,
        };
      })
    );

    mainNsp.emit("main:gotSharedPasses", results);
  });

  client.on("main:deleteSharedPass", async function (userID, data, sendedHmac, signature, OnSuccess) {
    const userId = userID;

    let user = await User.findByPk(userId);
    if (!user) return mainNsp.emit("main:unauthorized");

    const ddata = valideAndGetDeData(data, sendedHmac, mainNsp, signature, user.publicKey, Users[userId]);

    if (!ddata) return;
    const { id } = ddata;
    if (id) {
      try {
        const sharedPass = await SharedPass.findByPk(id);
        await sharedPass.destroy();

        if (OnSuccess) {
          OnSuccess();
        }
        return mainNsp.emit("main:sharedPassDeleted", {
          isSuccess: true,
          id,
        });
      } catch (ex) {
        return mainNsp.emit("main:sharedPassDeleted", { isSuccess: false });
      }
    } else {
      mainNsp.emit("main:uncompleteData");
    }
  });

  client.on("main:acceptSharedPassword", async (userID, data, sendedHmac, signature, cb) => {
    const userId = userID;
    if (!userId) return mainNsp.emit("main:unauthorized");

    let user = await User.findByPk(userId);
    let ddata = valideAndGetDeData(data, sendedHmac, mainNsp, signature, user.publicKey, Users[userId]);
    if (!ddata) return;

    const { id, title, username, value, description } = ddata;
    if (id && title && username && value) {
      let password = await Password.create({
        title,
        username,
        value,
        description,
      });
      await user.addPassword(password);

      if (!password) {
        return mainNsp.emit("main:passwordStored", { isSuccess: false, message: "Failed to Store password" });
      }
      try {
        const sharedPass = await SharedPass.findByPk(id);
        await sharedPass.destroy();
      } catch (ex) {
        return mainNsp.emit("main:passwordStored", { isSuccess: false, message: "Failed to Delete the Shared Password" });
      }

      if (cb) {
        cb();
      }
      const { hmac, encryptedData } = encrpytData(password, Users[userId]);
      mainNsp.emit(
        "main:passwordStored",
        {
          isSuccess: true,
          password: encryptedData,
        },
        hmac
      );
      mainNsp.emit("main:sharedPasswordAccepted", id);
    } else {
      mainNsp.emit("main:uncompleteData");
    }
  });
};
