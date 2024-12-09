import React, { useState } from 'react'
import './ForgotPassword.css';
import { Link } from 'react-router-dom';
import { validateString } from "../register/Register";

export default function ForgotPassword() {

  const [formData, setFormData] = useState({ email: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    let errorMessages = { ...errors };

    try {
      if (name === "email") {
        validateString(value).emailValidation().minLength(8);
        delete errorMessages[name]; 
      }
    } catch (error) {
      errorMessages[name] = error.message; 
    }

    setErrors(errorMessages);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; 
    }

    console.log("Reset code sent to:", formData.email);
    setFormData({ email: "" });
    setErrors({});
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (errors.email) {
      errors.email = "Please provide a valid email address.";
    }

    return errors;
  };

  return (
    <>
      <div className="container">
        <div className="form-container">
          <h2 className="header">
            <img
              src="src/img/forgot-password.png"
              alt="Forgot Password Logo"
              style={{ width: 20, height: 20 }}
            />{" "}
            Forgot Password
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email" className="label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <button type="submit" className="button">Send Reset Code</button>
            <div className="form-footer">
              <span className="already-user">
                <Link to="/">Back to login!</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
