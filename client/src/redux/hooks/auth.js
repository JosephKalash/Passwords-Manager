import { useSelector, useDispatch } from "react-redux";
import * as actions from "redux/actions/authActions";
import { useAuthSocket, useCaSocket } from "socket/SocketProvider";
import { emit } from "socket/secureSocket";
import { generateKeyPair } from "crypto/crypto_keys";
import { tempRegister } from "localStorage/authLocalStorage";
import { toast } from "react-toastify";

export const useAuth = () => {
  const { userID, name, email, password, privateKey, publicKey, isAuthenticated } = useSelector((state) => state.auth);
  const socket = useAuthSocket();
  const caSocket = useCaSocket();
  const dispatch = useDispatch();

  const login = (values) => {
    emit(socket, "auth:authentication", values);
    dispatch(actions.keepPassword(values.password));
  };

  const logout = () => {
    dispatch(actions.logout());
    // socket.close();
    window.location.reload();
  };

  const register = (values) => {
    toast.info("Generating private & public keys for client!");

    setTimeout(() => {
      const { privateKey, publicKey } = generateKeyPair();
      caSocket.emit("digitalCertificate", publicKey);

      caSocket.on("signedCertificate", (ca_signature) => {
        toast.success("Signed from CA server");
        tempRegister(values.email, { privateKey, publicKey, ca_signature });
        emit(socket, "auth:register", { ...values, publicKey, ca_signature });
        dispatch(actions.keepPassword(values.password));
        caSocket.off("signedCertificate");
      });
    }, 10);
  };

  return {
    userID,
    name,
    email,
    password,
    privateKey,
    publicKey,
    isAuthenticated,
    login,
    logout,
    register,
  };
};
