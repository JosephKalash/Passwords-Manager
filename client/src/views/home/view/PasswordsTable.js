import React from "react";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { useMainSocket } from "socket/SocketProvider";
import { RiDeleteBin2Line } from "react-icons/ri";
import { BiEditAlt } from "react-icons/bi";
import { FaShareSquare } from "react-icons/fa";
import confirmAlert from "extensions/confirm-alert";
import EditPasswordModal from "../data/EditPasswordModal";
import { emit, recieve } from "socket/secureSocket";
import { useAuth } from "redux/hooks/auth";
import PasswordField from "./PasswordField";
import SharePasswordModal from "../share/SharePasswordModal";

const PasswordsTable = ({ data, setData }) => {
  const socket = useMainSocket();
  const { userID } = useAuth();

  //Edit Modal
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [dataToEdit, setDataToEdit] = React.useState({});

  //Share Password Modal
  const [sharePasswordModal, setSharePasswordModal] = React.useState(false);
  const [dataToShare, setDataToShare] = React.useState({});

  const handleSharePasswordModal = (item) => {
    setDataToShare(item);
    setSharePasswordModal(true);
  };

  const handleOpenModal = (item) => {
    setDataToEdit(item);
    setOpenEditModal(true);
  };

  const handleDelete = React.useCallback(
    (id) => {
      emit(socket, "main:deletePassword", { id }, () => {
        setData((prev) => prev.filter((item) => item.id !== id));
      });
    },
    [socket, setData]
  );

  React.useEffect(() => {
    socket.emit("main:getPasswords", userID);
    socket.on("main:gotPasswords", (encPasswords, hmac) => {
      const passwords = recieve(encPasswords, hmac);
      if (passwords) {
        setData(passwords);
      }
    });
    socket.on("main:passwordStored", ({ isSuccess, password: encPassword }, hmac) => {
      if (isSuccess) {
        toast.success("Password stored successfully!");
        const password = recieve(encPassword, hmac);
        if (password) {
          setData((prev) => [...prev, password]);
        }
      } else {
        toast.error("Failed to store the password!");
      }
    });
    socket.on("main:passwordEdit", ({ isSuccess, password: encPassword }, hmac) => {
      if (isSuccess) {
        toast.success("Password Updated successfully!");
        const password = recieve(encPassword, hmac);
        if (password) {
          setData((prev) => prev.map((item) => (item.id === password.id ? password : item)));
        }
      } else {
        toast.error("Failed to update the password!");
      }
    });
    socket.on("main:passwordDeleted", ({ isSuccess }) => {
      if (isSuccess) {
        toast.success("Password Deleted Successfully!");
      } else {
        toast.error("Failed to Delete the Password!");
      }
    });

    return () => {
      socket.off("main:gotPasswords");
      socket.off("main:passwordStored");
      socket.off("main:passwordEdit");
      socket.off("main:passwordDeleted");
    };
  }, [socket, setData, userID]);

  return (
    <>
      <Table className="mt-3" striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Username</th>
            <th>Value</th>
            <th>Description</th>
            <th style={{ textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.title}</td>
              <td>{item.username}</td>
              <td>
                <PasswordField item={item} value={item.value} />
              </td>
              <td>{item.description}</td>
              <td
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                  padding: "1rem",
                }}
              >
                <FaShareSquare size={22} style={{ cursor: "pointer" }} onClick={() => handleSharePasswordModal(item)} />
                <BiEditAlt size={22} style={{ cursor: "pointer" }} onClick={() => handleOpenModal(item)} />
                <RiDeleteBin2Line style={{ cursor: "pointer" }} size={22} onClick={() => confirmAlert({ onConfirm: () => handleDelete(item.id) })} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <EditPasswordModal isOpen={openEditModal} setIsOpen={setOpenEditModal} dataToEdit={dataToEdit} />
      <SharePasswordModal isOpen={sharePasswordModal} setIsOpen={setSharePasswordModal} dataToShare={dataToShare} />
    </>
  );
};

export default PasswordsTable;
