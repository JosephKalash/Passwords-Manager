import React from "react";
import { Modal, Button } from "react-bootstrap";
import { AiOutlineEye } from "react-icons/ai";
import { FaKey } from "react-icons/fa";
import { useAuth } from "redux/hooks/auth";
import { decryptPassword } from "crypto/password";
import "../styles/home.css";

const PasswordField = ({ value, item }) => {
  const [show, setShow] = React.useState(false);
  const [decryptClicked, setDecryptClicked] = React.useState(false);
  const [decryptedPassword, setDecrpytedPassword] = React.useState("");
  const { privateKey } = useAuth();

  const handleDecryptPassword = () => {
    setDecryptClicked(true);
    const pass = decryptPassword(privateKey, value);
    setDecrpytedPassword(pass);
  };

  const closeModal = () => {
    setShow(false);
    setTimeout(() => {
      setDecryptClicked(false);
      setDecrpytedPassword("");
    }, 500);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        ********
        <AiOutlineEye onClick={() => setShow(true)} size={22} style={{ cursor: "pointer", color: "blue" }} />
      </div>
      <Modal show={show} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{item.username}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>{decryptClicked ? "Password" : "Encrypted Password"}</label>
          <p className="password-area">{decryptClicked ? decryptedPassword : value}</p>
          <Button onClick={handleDecryptPassword} disabled={decryptClicked}>
            Decrypt with Private Key <FaKey />
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PasswordField;
