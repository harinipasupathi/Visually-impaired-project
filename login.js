import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // Hardcoded valid email and password
    const validEmail = "harini@gmail.com";
    const validPassword = "12345";

    if (email === validEmail && password === validPassword) {
      navigate('/home');
    } else {
      setError('Invalid email or password!');
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <header className="navbar">
          <div className="logo-container">
            <img src="/logo192.png" alt="Logo" className="logo-img" />
            <div className="logo-text">Anywhere app.</div>
          </div>
          <nav className="nav-links">
            <a href="/">Home</a>
            <a href="/join">Join</a>
          </nav>
        </header>

        <section className="form-section">
          <p className="small-text">WELCOME BACK</p>
          <h1>
            Log in to your account<span className="blue-dot">.</span>
          </h1>
          <p className="member-text">
            New here? <a href="/signup">Create an account</a>
          </p>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className="buttons">
              <button type="submit" className="btn-primary">Log in</button>
              <button type="button" className="btn-secondary">Forgot Password?</button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Login;
