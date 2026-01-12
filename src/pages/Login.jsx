import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { Triangle } from "react-loader-spinner";
import logo from "../assets/money-logo.svg";
import { Toaster, toast } from "react-hot-toast";

const API_URL = `${import.meta.env.VITE_API_BASE}/auth`;

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Login successful",
      {
        style: {
          border: '3px solid #bb86fc',
          padding: '16px',
          color: '#ffffff',
          background: '#272727'
        },
        iconTheme: {
          primary: '#ffffff',
          secondary: '#272727',
        },
      });
      navigate("/");
    } catch (err) {
      toast.error(err.message,
        {
          style: {
            border: '3px solid #bb86fc',
            padding: '16px',
            color: '#ffffff',
            background: '#272727'
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: '#272727',
          },
        });
    }

    setLoading(false);
  };

  // REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Registration successful. Please login.",
      {
        style: {
          border: '3px solid #bb86fc',
          padding: '16px',
          color: '#ffffff',
          background: '#272727'
        },
        iconTheme: {
          primary: '#ffffff',
          secondary: '#272727',
        },
      });
      setIsRegister(false);
    } catch (err) {
      toast.error(err.message, 
        {
          style: {
            border: '3px solid #bb86fc',
            padding: '16px',
            color: '#ffffff',
            background: '#272727'
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: '#272727',
          },
        });
    }

    setLoading(false);
  };

  return (
    <div className="Login">
      <Toaster />
      <div className="login-container">
        <img src={logo} alt="logo" className="logo-login" />

        <h1>{isRegister ? "Register" : "Login"}</h1>

        {isRegister ? (
          // REGISTER FORM
          <form className="login-form" onSubmit={handleRegister}>
            <div className="fields">
              <div className="horizontal">
                <input
                  className="login-input"
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                />

                <input
                  className="login-input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                />
              </div>

              <input
                className="login-input login-password"
                type="password"
                name="password"
                placeholder="Password"
                required
              />
            </div>

            {loading ? (
              <Triangle height="50" width="50" color="#984bf7" />
            ) : (
              <button type="submit">Register</button>
            )}
          </form>
        ) : (
          // LOGIN FORM
          <form className="login-form" onSubmit={handleLogin}>
            <input
              className="login-input"
              type="email"
              name="email"
              placeholder="Email"
              required
            />

            <input
              className="login-input"
              type="password"
              name="password"
              placeholder="Password"
              required
            />

            {loading ? (
              <Triangle height="50" width="50" color="#984bf7" />
            ) : (
              <button type="submit">Login</button>
            )}
          </form>
        )}

        <div className="options-menu">
          {isRegister ? (
            <span onClick={() => setIsRegister(false)}>
              Already registered? <b className="light-purple">Login</b>
            </span>
          ) : (
            <span onClick={() => setIsRegister(true)}>
              New user? <b className="light-purple">Register</b>
            </span>
          )}

          {!isRegister && (
            <p>
              Forgot your password?{" "}
              <a href="/forgot-password" className="light-purple">
                Reset it here
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
