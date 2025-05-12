import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const loginData = {
      email,
      password,
      username,
    };

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        setError(errorMessage.message || 'Login failed. Please try again.');
        return;
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('username', data.username);
      window.dispatchEvent(new Event('storage'));
      navigate('/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="form">
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form className="inner-form" onSubmit={handleLogin}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          className="form-control"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          className="form-control"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <button className="btn btn-primary" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
