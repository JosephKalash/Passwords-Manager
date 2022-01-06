import { cryptoKeys } from "./crypto_keys";
import { cryptos } from "crypto/crypto-middleware";
import { store } from "redux/store";

export const decryptPassword = (privateKey, value) => {
  if (!value) return "";
  const encrypted = Buffer.from(value, "base64");
  const pass = cryptoKeys.privateKeyDecrpyt(privateKey, encrypted);
  return pass;
};

export const sharePassword = (socket, data, recUser) => {
  const { privateKey, userID } = store.getState().auth;
  const value = decryptPassword(privateKey, data.value);
  const ddata = JSON.stringify({
    title: data.title,
    username: data.username,
    description: data.description,
    filepath: data.filepath,
    value,
  });

  const encryptedData = cryptoKeys.publicKeyEncrypt(recUser.publicKey, ddata).toString("base64");
  const signature = cryptos.getSignature(ddata, privateKey);
  socket.emit("main:postSharedPass", userID, encryptedData, signature, recUser.id);
};
