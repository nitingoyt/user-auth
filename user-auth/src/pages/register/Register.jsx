import { Link } from "react-router-dom";
import "./Register.css";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function validateString(text) {
  return {
    newText: text,

    capitalize: function () {
      if (this.newText.length === 0) {
        throw new Error("Text cannot be empty");
      }
      if (this.newText[0] !== this.newText[0].toUpperCase()) {
        throw new Error("First letter should be capital");
      }
      return this;
    },

    allowNumbers: function (value) {
      if (!value) {
        this.newText.split("").forEach((element) => {
          if (Number(element)) {
            throw new Error("Number is Not allowed! in " + this.newText);
          }
        });
      }
      return this;
    },

    minLength: function (length) {
      if (this.newText.length < length) {
        throw new Error("Min length must be " + length);
      }
      return this;
    },

    maxLength: function (length) {
      if (this.newText.length > length) {
        throw new Error("Max length must be " + length);
      }
      return this;
    },

    allowSpecialChar: function (value) {
      if (!value) {
        this.newText.split("").forEach((element) => {
          let ch = element.charCodeAt(0);
          if (
            !(ch >= 65 && ch <= 90) &&
            !(ch >= 97 && ch <= 122) &&
            !(ch >= 48 && ch <= 57)
          ) {
            throw new Error(
              "Special cahracters not allowed in " + this.newText
            );
          }
        });
      }
      return this;
    },

    emailValidation: function () {
      if (!this.newText.includes("@") || !this.newText.includes(".")) {
        throw new Error("Invalid email address");
      }

      const [local, domain] = this.newText.split("@");
      console.log(local, domain);
      if (!local || !domain || !domain.includes(".")) {
        throw new Error("Email must contain a valid domain.");
      }
      return this;
    },

    // age allowed is more than 10 year old taking DOB from user
    allowedAge: function () {
      const birthDate = new Date(this.newText);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const month = today.getMonth() - birthDate.getMonth();

      if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        throw new Error("You must be at least 18 years old.");
      }

      return this;
    },

    // alteast one special char , aleast one capital letter , 0-9 number
    passwordValidation: function () {
      const hasCapital = this.newText
        .split("")
        .some((char) => char >= "A" && char <= "Z");
      const hasNumber = this.newText
        .split("")
        .some((char) => char >= "0" && char <= "9");
      const hasSpecial = this.newText
        .split("")
        .some((char) => "!@#$%^&*()_+[]{}|;:',.<>?/`~".includes(char)); //copy pasted bro

      if (!hasCapital) {
        throw new Error("Password must contain at least one capital letter.");
      }
      if (!hasSpecial) {
        throw new Error(
          "Password must contain at least one special character."
        );
      }
      if (!hasNumber) {
        throw new Error("Password must contain at least one number.");
      }
      return this;
    },
  };
}

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    profilePicture: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    let errorMessages = { ...errors };

    try {
      if (name === "firstName" || name === "lastName") {
        validateString(value).capitalize().minLength(3).maxLength(20);
      }

      if (name === "email") {
        validateString(value).emailValidation().minLength(8);
      }

      if (name === "password") {
        validateString(value).passwordValidation().minLength(8).maxLength(20);
      }
      if (name === "dob") {
        validateString(value).allowedAge();  // Validate age when dob changes
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

    toast.success("Form submitted successfully!");

    console.log("Form submitted successfully:", formData);

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      dob: "",
      profilePicture: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName) errors.firstName = "First name is required";
    if (!formData.lastName) errors.lastName = "Last name is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (!formData.profilePicture)
      errors.profilePicture = "Profile picture is required";
    if (!formData.dob) errors.dob = "DOB is required";

    return errors;
  };

  return (
    <>
      <div className="registration-form-container">
        <h1>
          <img
            src="src\img\new.png"
            alt="Login-logo"
            style={{ width: 25, height: 25 }}
          />{" "}
          SignUp{" "}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              id="first-name"
              placeholder="Enter First Name"
              value={formData.firstName}
              onChange={handleChange}
            ></input>
            {errors.firstName && (
              <span className="error">{errors.firstName}</span>
            )}
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              id="last-name"
              placeholder="Enter Last Name"
              value={formData.lastName}
              onChange={handleChange}
            ></input>
            {errors.lastName && (
              <span className="error">{errors.lastName}</span>
            )}
          </div>

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
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>D.O.B.</label>
            <input
              type="Date"
              name="dob"
              id="dob"
              value={formData.dob}
              onChange={handleChange}
            ></input>
            {errors.dob && <span className="error">{errors.dob}</span>}
          </div>

          <div className="form-group">
            <label>Profile</label>
            <input
              type="file"
              name="profilePicture"
              id="profilePicture"
              accept=".jpg, .png"
              value={formData.profilePicture}
              onChange={handleChange}
            ></input>
            {errors.profilePicture && (
              <span className="error">{errors.profilePicture}</span>
            )}
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
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label>Confirm-Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirm-password"
              placeholder="Re-enter Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            ></input>
            {errors.confirmPassword && (
              <span className="error">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit">SignUp</button>

          <div className="form-footer">
            <span className="already-user">
              <Link to="/">Already User?</Link>
            </span>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
\
    </>
  );
}
