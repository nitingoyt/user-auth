import { Link } from "react-router-dom";
import { validateString } from "../register/Register";
import "./Login.css";
import { useState } from "react";
export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    let errorMessages = { ...errors };

    try {
      if (name === "email") {
        validateString(value).emailValidation().minLength(8);
      }

      if (name === "password") {
        validateString(value).minLength(8).maxLength(20);
      }

      delete errorMessages[name]; //clear errors
      
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

    console.log("Login successfully:", formData);

    setFormData({
      email: "",
      password: "",
    });
    setErrors({});
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";

    return errors;
  };

  return (
    <>
      <div className="login-form-container">
        <h1>
          <img
            src="src\img\logo.png"
            alt="Login-logo"
            style={{ width: 25, height: 25 }}
          />{" "}
          LOGIN{" "}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
            ></input>
            {errors.email && <span>{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
            ></input>
            {errors.password && <span>{errors.password}</span>}
          </div>

          <button type="submit">Login</button>
          <div className="form-footer">
            <span className="new-user">
              <Link to="/registration">New User?</Link>
            </span>
            <span className="forgot-password">
              <Link to="/forgetpassword">Forget Password?</Link>
            </span>
          </div>
        </form>
      </div>
    </>
  );
}
