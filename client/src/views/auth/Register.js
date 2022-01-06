import React from "react";
import { Card, Form, Button } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "redux/hooks/auth";
import "assets/styles/auth.css";

const Register = () => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { register, isAuthenticated } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();

    register({
      name,
      email,
      password,
    });
  };

  if (isAuthenticated) {
    return <Navigate replace to="/" />;
  }
  return (
    <div className="auth-page">
      <Card className="auth-card">
        <Card.Header>
          <Card.Title>
            <h3>Register</h3>
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="name">Name</Form.Label>
              <Form.Control placeholder="Enter Your Name" value={name} onChange={(e) => setName(e.target.value)} name="name" type="text" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="email">Email</Form.Label>
              <Form.Control placeholder="Enter Your Email" value={email} onChange={(e) => setEmail(e.target.value)} name="email" type="email" required />
            </Form.Group>
            <Form.Group className="mb-5">
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Control placeholder="Enter Your Password" value={password} onChange={(e) => setPassword(e.target.value)} name="password" type="password" required />
            </Form.Group>
            <Button type="submit" className="d-flex w-100 justify-content-center align-items-center mb-3">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
        <Card.Footer className="mx-1">
          <h6 className="m-1">
            <Link to="/login">Login</Link>
          </h6>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default Register;
