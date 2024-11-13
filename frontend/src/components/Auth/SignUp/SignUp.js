import React, { useState } from 'react';
import { Button, Form, Container, Alert, Row, Col } from 'react-bootstrap';
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth'; // Adjust the import as needed
import { handleEmailSignUp } from '../../../utils/authFunctions';
import { useNavigate } from 'react-router-dom';
import styles from './SignUp.module.css';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');  // Added state for name
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');  // Added state for phone
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const navigate = useNavigate();

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhone(value);

    // Validate phone number for at least 8 digits
    const isValid = /^\d{8,}$/.test(value) || value === ""; // Allow empty value too
    setPhoneError(isValid ? '' : 'Phone number must be at least 8 digits.');
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    setError(''); // Reset error state before new attempt
    setSuccess(false); // Reset success state
    setAddress('placeholder');

    try {
      const userCredential = await doCreateUserWithEmailAndPassword(email, password, name);
      const user = userCredential.user;

      // Call function to create user in MongoDB after successful sign-up
      await handleEmailSignUp(user, name, address, phone, setSuccess); // Pass name and phone

      // Clear input fields
      setEmail('');
      setPassword('');
      setName('');  // Clear name input
      setPhone('');  // Clear phone input

      navigate('/home');
      window.location.reload();

    } catch (error) {
      // Handle errors
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already in use. Please use another email.');
      } else {
        setError('Error signing up: ' + error.message);
      }
      console.error('Error signing up:', error); // Log the error for debugging
    }
  };

  return (
    <Container className={`mt-5 ${styles.signupContainer}`}>
      <h2 className="text-center mb-4">Sign Up</h2>
      <Form onSubmit={handleSignUp}>
        <Row className="mb-3  m-auto">
          <Col xs={12} lg={3}>
            <Form.Label>Name</Form.Label> {/* Right-aligned label for name */}
          </Col>
          <Col xs={12} lg={9}>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </Col>
        </Row>
        <Row className="mb-3 m-auto">
          <Col xs={12} lg={3}>
            <Form.Label>Phone Number</Form.Label>
          </Col>
          <Col xs={12} lg={9}>
            <Form.Control
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="Enter your phone number"
            required
            isInvalid={!!phoneError} // Mark as invalid if there's an error
          />
          </Col>
        </Row>
        <Row className="mb-3  m-auto">
          <Col xs={12} lg={3}>
            <Form.Label>Email</Form.Label> {/* Right-aligned label for email */}
          </Col>
          <Col xs={12} lg={9}>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </Col>
        </Row>
        <Row className="mb-3  m-auto">
          <Col xs={12} lg={3}>
            <Form.Label>Password</Form.Label> {/* Right-aligned label for password */}
          </Col>
          <Col xs={12} lg={9}>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </Col>
        </Row>
        <Button variant="primary" type="submit" className="w-100">
          Sign Up
        </Button>
      </Form>

      {/* Show success message */}
      {success && (
        <Alert variant="success" className="mt-3">
          Registration successful! Please check your email for verification.
        </Alert>
      )}

      {/* Show error message */}
      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default SignUp;
