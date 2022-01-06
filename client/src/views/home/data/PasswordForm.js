import React from "react";
import { Form, Button } from "react-bootstrap";

const PasswordForm = ({ form, setForm, handleSubmit, submitLabel }) => {
  const handleChange = React.useCallback(
    (e) => {
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    [setForm]
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="title">Title</Form.Label>
        <Form.Control placeholder="Enter Title" value={form.title} onChange={handleChange} name="title" type="text" required />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="username">Username</Form.Label>
        <Form.Control placeholder="Enter Username" value={form.username} onChange={handleChange} name="username" type="text" required />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="value">Password</Form.Label>
        <Form.Control placeholder="Enter Your Password" value={form.value} onChange={handleChange} name="value" type="password" required />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="description">Description</Form.Label>
        <Form.Control placeholder="Enter The Description" value={form.description} onChange={handleChange} name="description" type="text" as="textarea" />
      </Form.Group>
      <Button type="submit" className="d-flex w-100 justify-content-center align-items-center mb-3">
        {submitLabel}
      </Button>
    </Form>
  );
};

export default PasswordForm;
