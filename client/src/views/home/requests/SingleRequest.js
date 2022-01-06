import React from "react";
import { Button } from "react-bootstrap";
import { FaKey } from "react-icons/fa";
import { MdVerifiedUser } from "react-icons/md";
import { AiFillWarning } from "react-icons/ai";
import { decryptPassword } from "crypto/password";
import { useAuth } from "redux/hooks/auth";
import { emit } from "socket/secureSocket";
import { useMainSocket } from "socket/SocketProvider";
import { cryptoKeys } from "crypto/crypto_keys";
import { cryptos } from "crypto/crypto-middleware";
const SingleRequest = ({ req }) => {
  const { privateKey, publicKey } = useAuth();
  const [decValue, setDecValue] = React.useState(null);
  const [isVerified, setIsVerified] = React.useState(false);
  const decryptClicked = decValue !== null;
  const socket = useMainSocket();

  const handleDecryptPassword = () => {
    const pass = decryptPassword(privateKey, req.value);
    if (pass === "") {
      setDecValue({});
    } else {
      setDecValue(JSON.parse(pass));
    }

    const _isVerified = cryptos.verifySign(pass, req.signature, req.senderPublicKey);
    setIsVerified(_isVerified);
  };

  const handleDelete = () => {
    emit(socket, "main:deleteSharedPass", { id: req.id });
  };

  const handleAccept = () => {
    const encryptedPassword = cryptoKeys.publicKeyEncrypt(publicKey, decValue.value).toString("base64");
    emit(socket, "main:acceptSharedPassword", { id: req.id, ...decValue, value: encryptedPassword });
  };

  return (
    <div>
      {decryptClicked ? (
        <div className="d-flex justify-content-between">
          <div>
            <p>
              <strong>Title</strong>: {decValue.title}
            </p>
            <p>
              <strong>Username</strong>: {decValue.username}
            </p>
            <p>
              <strong>Value</strong>: {decValue.value}
            </p>
            <p>
              <strong>Description</strong>: {decValue.description}
            </p>
          </div>
          <div>{isVerified ? <MdVerifiedUser style={{ color: "#0A58CA" }} size={26} /> : <AiFillWarning style={{ color: "#FFC107" }} size={26} />}</div>
        </div>
      ) : (
        <p style={{ wordBreak: "break-word" }}>{req.value}</p>
      )}
      {!decryptClicked && (
        <Button onClick={handleDecryptPassword}>
          Decrypt with Private Key <FaKey />
        </Button>
      )}
      {decryptClicked && (
        <>
          <Button disabled={!isVerified} onClick={handleAccept} style={{ marginRight: "1rem" }}>
            Accept
          </Button>
          <Button onClick={handleDelete} variant="danger">
            Delete
          </Button>
        </>
      )}
    </div>
  );
};

export default SingleRequest;
