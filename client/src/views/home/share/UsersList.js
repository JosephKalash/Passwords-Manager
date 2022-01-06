import React from "react";
import { useMainSocket } from "socket/SocketProvider";
import { useAuth } from "redux/hooks/auth";
import { recieve } from "socket/secureSocket";
import { Table } from "react-bootstrap";
import { FiSend } from "react-icons/fi";
import { sharePassword } from "crypto/password";
import { toast } from "react-toastify";

const UsersList = ({ dataToShare }) => {
  const { userID } = useAuth();
  const socket = useMainSocket();
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    socket.emit("main:getUsersInfo", userID);
    socket.on("main:gotUsersInfo", ({ users: encUsers }, hmac) => {
      const users = recieve(encUsers, hmac);
      if (users) {
        setUsers(users);
      }
    });
    socket.on("main:sharedDone", ({ userId: recID }) => {
      toast.success(`Password has been shared to user ${recID}`);
      setUsers((us) => us.filter((u) => u.id !== recID));
    });

    return () => {
      socket.off("main:gotUsersInfo");
      socket.off("main:sharedDone");
    };
  }, [socket, userID]);

  const handleSharePassword = (user) => {
    sharePassword(socket, dataToShare, user);
  };

  return (
    <div>
      <h5>Select a user</h5>
      <Table className="mt-3" striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th style={{ textAlign: "center" }}>#</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td style={{ textAlign: "center" }}>
                <FiSend onClick={() => handleSharePassword(user)} size={22} style={{ cursor: "pointer" }} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UsersList;
