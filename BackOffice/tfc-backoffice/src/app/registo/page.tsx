'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    birthdate: '',
    phoneNumber: '',
    taxPayerNumber: '',
    street: '',
    city: '',
    postalCode: ''
  });

  const [logo, setLogo] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (logo) data.append('logo', logo);

    try {
      await axios.post('http://localhost:8080/company/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess('Conta criada com sucesso!');
      setTimeout(() => router.push('/'), 1500);
    } catch (err: any) {
      setError(err.response?.data || 'Erro ao registrar empresa.');
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleRegister} style={formStyle}>
        <h2 style={{ marginBottom: '20px' }}>Criar Conta</h2>

        <input name="name" placeholder="Nome da Empresa" required onChange={handleChange} style={inputStyle} />
        <input name="email" placeholder="Email" type="email" required onChange={handleChange} style={inputStyle} />
        <input name="password" placeholder="Senha" type="password" required onChange={handleChange} style={inputStyle} />
        <input name="birthdate" placeholder="Data de Nascimento" type="date" required onChange={handleChange} style={inputStyle} />
        <input name="phoneNumber" placeholder="Telefone" required onChange={handleChange} style={inputStyle} />
        <input name="taxPayerNumber" placeholder="NIF" type="number" required onChange={handleChange} style={inputStyle} />
        <input name="street" placeholder="Rua" required onChange={handleChange} style={inputStyle} />
        <input name="city" placeholder="Cidade" required onChange={handleChange} style={inputStyle} />
        <input name="postalCode" placeholder="Código Postal" required onChange={handleChange} style={inputStyle} />
        <input type="file" accept="image/*" onChange={handleLogoChange} style={inputStyle} />

        {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
        {success && <p style={{ color: 'green', fontSize: '12px' }}>{success}</p>}

        <button type="submit" style={buttonStyle}>Registrar</button>

        <p style={{ marginTop: '20px', fontSize: '14px' }}>
          Já tem conta? <a href="/" style={{ color: '#007bff' }}>Login</a>
        </p>
      </form>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #5f2c82, #49a09d)',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: 'sans-serif'
};

const formStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  padding: '40px',
  boxShadow: '0 0 20px rgba(0,0,0,0.2)',
  width: '300px',
  textAlign: 'center'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  marginBottom: '12px',
  border: '1px solid #ccc',
  borderRadius: '6px'
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
