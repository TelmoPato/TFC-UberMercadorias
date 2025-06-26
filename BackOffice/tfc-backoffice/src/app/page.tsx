'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/company/login', {
        username,
        password,
      });

      const companyId = response.data?.companyId;

      if (companyId) {
        // Salva o ID no localStorage
        localStorage.setItem('companyId', companyId.toString());

        // Redireciona para o dashboard (sem precisar passar o ID na URL)
        router.push('/dashboard');
      } else {
        setError('Credenciais inválidas');
      }
    } catch (err) {
      setError('Erro ao fazer login. Verifique seus dados.');
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #5f2c82, #49a09d)',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'sans-serif'
    }}>
      <form onSubmit={handleLogin} style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 0 20px rgba(0,0,0,0.2)',
        width: '300px',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '20px' }}>User Login</h2>

        <input
          type="text"
          placeholder="User Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        <div style={{ fontSize: '12px', margin: '10px 0' }}>
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <span style={{ float: 'right', cursor: 'pointer', color: '#007bff' }}>
            Forgot Password?
          </span>
        </div>

        {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}

        <button type="submit" style={buttonStyle}>Login</button>

        <p style={{ marginTop: '20px', fontSize: '14px' }}>
          To create a new account. <a href="/registo" style={{ color: '#007bff' }}>Click here</a>
        </p>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  marginBottom: '15px',
  border: '1px solid #ccc',
  borderRadius: '6px',
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#5f2c82',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};
