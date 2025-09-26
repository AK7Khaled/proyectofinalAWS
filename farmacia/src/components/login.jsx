// src/components/Login.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Limpiar mensaje anterior
    setMensaje('');
    
    // Validación básica
    if (!email.trim() || !password.trim()) {
      setMensaje('Por favor, completa todos los campos');
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/login', { 
        email: email.trim(), 
        password 
      });
      
      const token = res.data.token;

      if (token) {
        // Usar el contexto para manejar el login
        login({ email: email.trim() }, token);
        setMensaje('Login exitoso. Redirigiendo...');
        
        // Limpiar formulario
        setEmail('');
        setPassword('');
      } else {
        setMensaje('Error: No se recibió el token del servidor');
      }
    } catch (error) {
      console.error('Error en login:', error);
      
      if (error.response?.status === 401) {
        setMensaje('Credenciales incorrectas');
      } else if (error.response?.status === 400) {
        setMensaje('Datos inválidos');
      } else if (error.response?.data?.error) {
        setMensaje(`Error: ${error.response.data.error}`);
      } else if (error.code === 'ECONNREFUSED') {
        setMensaje('Error: No se puede conectar al servidor');
      } else {
        setMensaje('Error de conexión. Intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            style={{ 
              width: '100%', 
              padding: '10px', 
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            style={{ 
              width: '100%', 
              padding: '10px', 
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
        <button 
          type="submit" 
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            backgroundColor: isLoading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
      {mensaje && (
        <p style={{ 
          marginTop: '15px', 
          padding: '10px',
          backgroundColor: mensaje.includes('exitoso') ? '#d4edda' : '#f8d7da',
          color: mensaje.includes('exitoso') ? '#155724' : '#721c24',
          border: `1px solid ${mensaje.includes('exitoso') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px'
        }}>
          {mensaje}
        </p>
      )}
    </div>
  );
}
