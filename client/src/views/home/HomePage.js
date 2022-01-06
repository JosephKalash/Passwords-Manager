import React from "react";
import { Button, Badge } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { useAuth } from "redux/hooks/auth";
import AddPasswordModal from "./data/AddPasswordModal";
import PassReqModal from "./requests/PassReqModal";
import PasswordsTable from "./view/PasswordsTable";
import "./styles/home.css";

const HomePage = () => {
  const { isAuthenticated, name, email, logout } = useAuth();
  const [addFormOpen, setAddFormOpen] = React.useState(false);
  const [passwordRequestsModal, setPasswordRequestsModal] = React.useState(false);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    if (isAuthenticated && name) {
      document.title = `Password Manager - ${name}`;
    }
  }, [isAuthenticated, name]);

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  }

  return (
    <div>
      <header className="home-header">
        <h5>{email}</h5>
        <h5>{name}</h5>
        <Button onClick={() => logout()}>Logout</Button>
      </header>

      <div className="home-content">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex">
            <Badge bg="secondary">
              <h5 className="mb-0 p-1">{data.length}</h5>
            </Badge>
            <Button style={{ marginLeft: "1rem" }} onClick={() => setAddFormOpen(true)}>
              Add New Password
            </Button>
          </div>
          <Button variant="secondary" onClick={() => setPasswordRequestsModal(true)}>
            Password Requests
          </Button>
        </div>
        <PasswordsTable data={data} setData={setData} />
      </div>
      <AddPasswordModal isOpen={addFormOpen} setIsOpen={setAddFormOpen} />
      <PassReqModal isOpen={passwordRequestsModal} setIsOpen={setPasswordRequestsModal} />
    </div>
  );
};

export default HomePage;
