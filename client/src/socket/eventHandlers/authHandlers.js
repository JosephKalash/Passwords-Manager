import { store } from "redux/store";
import * as actions from "redux/actions/authActions";
import { toast } from "react-toastify";
import { recieve } from "socket/secureSocket";
import { symmetricKey, cryptoKeys } from "crypto/crypto_keys";
import { getKeyPair, registerDone, registerFail } from "localStorage/authLocalStorage";
import { cryptos } from "crypto/crypto-middleware";
import { CA_PUBLIC_KEY } from "socket/configs";

export const loginHandler = (socket) => {
  socket.on("auth:authenticated", (encUser, hmac) => {
    const user = recieve(encUser, hmac);
    if (user) {
      const { privateKey, publicKey } = getKeyPair(user.email);

      store.dispatch(actions.login({ ...user, privateKey, publicKey }));
      toast.success("Logged in Successfully!");
    }
  });
  socket.on("auth:unauthorized", ({ message }) => {
    toast.error(message);
  });
};

export const registerHandler = (socket) => {
  socket.on("auth:register:done", (encUser, hmac) => {
    const user = recieve(encUser, hmac);
    if (user) {
      const { privateKey, publicKey } = registerDone(user.email);
      store.dispatch(actions.register({ ...user, privateKey, publicKey }));

      toast.success("Registered Successfully!");

      const loginValues = { email: user.email, password: user.password };
      const encryptedData = cryptos.cipher(loginValues);
      const hmac = cryptoKeys.getHmac(loginValues);
      socket.emit("auth:authentication", encryptedData, hmac);
    }
  });
  socket.on("auth:register:fail", ({ email, message }) => {
    registerFail(email);
    toast.error(message);
  });
};

export const publicKeyHandler = (socket) => {
  socket.on("auth:publicKey", (publicKey, certificate) => {
    toast.info("1. Certificate has been recieved");

    const isVerified = cryptos.verifySign(certificate.publicKey, certificate.sign, CA_PUBLIC_KEY);
    if (isVerified) {
      toast.success("2. Certificate has been verified from the CA", { delay: 1000 });

      toast.info("3. Public key has been recieved from the server", { delay: 3000 });
      const encryptedSymmetricKey = cryptoKeys.publicKeyEncrypt(publicKey, symmetricKey);
      socket.emit("auth:symmetricKey", encryptedSymmetricKey);
    } else {
      toast.error("Failed to Verify the server Certificate!", { delay: 1000 });
    }
  });
  socket.on("symmetric:done", () => {
    toast.success("4. Session key Done!", { delay: 4000 });
  });
};

export const caUserValidateHandler = (socket) => {
  socket.on("auth:caUserValidate", ({ message, isSuccess }) => {
    if (isSuccess) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  });
};

export default function authHandlers(socket) {
  publicKeyHandler(socket);
  loginHandler(socket);
  registerHandler(socket);
  caUserValidateHandler(socket);
}
