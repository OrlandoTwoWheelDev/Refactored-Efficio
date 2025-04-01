import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = ({ onRegister }) => {
  const [userName, setUsername] = useState("");
  const [passWord, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!userName || !passWord || !confirmPassword || !firstName || !lastName || !email) {
      setError("All fields are required.");
      return;
    }

    if (passWord !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch('/api/users/register', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          password: passWord,
          username: userName,
          email: email
        })
      });

      const responseObject = await response.json();
      console.log(responseObject);
      if (!response.ok ) {
        setError(responseObject.error || "Registration failed.");
      } else {
        onRegister?.(); // ✅ Notify App of login state change
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="First Name"
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Last Name"
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={passWord}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
};

export default Register;
