import { cryptos } from "crypto/crypto-middleware";
import { cryptoKeys } from "crypto/crypto_keys";
import { toast } from "react-toastify";
import { store } from "redux/store";

export const emit = (socket, eventName, data, cb) => {
  const { privateKey, userID } = store.getState().auth;
  const encryptedData = cryptos.cipher(data);
  const hmac = cryptoKeys.getHmac(data);
  if (privateKey && userID) {
    const signature = cryptos.getSignature(data, privateKey);
    socket.emit(eventName, userID, encryptedData, hmac, signature, cb);
  } else {
    socket.emit(eventName, encryptedData, hmac, cb);
  }
};

export const recieve = (encryptedData, hmac) => {
  const data = cryptos.decipher(encryptedData);
  if (cryptos.checkDataHmac(hmac, data)) {
    return data;
  } else {
    toast.error("HMAC Does NOT match!");
    return null;
  }
};
