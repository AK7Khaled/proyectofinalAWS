// src/components/Login.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { login } = useAuth();

  // Detectar cambios de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      const res = await axios.post('http://ec2-18-191-42-211.us-east-2.compute.amazonaws.com:5000/api/login', { 
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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '20px 15px' : '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: isMobile ? '30px 20px' : '40px 30px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        width: '100%',
        maxWidth: isMobile ? '350px' : '420px',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h2 style={{
            fontSize: isMobile ? '24px' : '28px',
            fontWeight: 'bold',
            color: '#2c3e50',
            margin: '0 0 10px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}>
            🏥 Farmacia Login
          </h2>
          <p style={{
            color: '#7f8c8d',
            fontSize: isMobile ? '14px' : '16px',
            margin: 0
          }}>
            Ingresa tus credenciales para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{
            marginBottom: '20px'
          }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#34495e',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              📧 Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@farmacia.com"
              required
              disabled={isLoading}
              style={{
                width: '100%',
                padding: isMobile ? '12px 14px' : '14px 16px',
                border: '2px solid #ecf0f1',
                borderRadius: '8px',
                fontSize: isMobile ? '16px' : '14px', // 16px en móvil evita zoom en iOS
                outline: 'none',
                transition: 'all 0.3s ease',
                backgroundColor: isLoading ? '#f8f9fa' : 'white',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3498db'}
              onBlur={(e) => e.target.style.borderColor = '#ecf0f1'}
            />
          </div>
          
          <div style={{
            marginBottom: '25px'
          }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#34495e',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              🔐 Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
              style={{
                width: '100%',
                padding: isMobile ? '12px 14px' : '14px 16px',
                border: '2px solid #ecf0f1',
                borderRadius: '8px',
                fontSize: isMobile ? '16px' : '14px',
                outline: 'none',
                transition: 'all 0.3s ease',
                backgroundColor: isLoading ? '#f8f9fa' : 'white',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3498db'}
              onBlur={(e) => e.target.style.borderColor = '#ecf0f1'}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            style={{
              width: '100%',
              padding: isMobile ? '14px' : '16px',
              backgroundColor: isLoading ? '#bdc3c7' : '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: isMobile ? '16px' : '18px',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = '#2980b9';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = '#3498db';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            {isLoading ? (
              <>
                <span style={{ 
                  display: 'inline-block',
                  width: '16px',
                  height: '16px',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></span>
                Iniciando sesión...
              </>
            ) : (
              <>
                ✅ Iniciar Sesión
              </>
            )}
          </button>
        </form>
        
        {mensaje && (
          <div style={{
            marginTop: '20px',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            textAlign: 'center',
            backgroundColor: mensaje.includes('exitoso') ? '#d5f2d5' : '#f8d7da',
            color: mensaje.includes('exitoso') ? '#155724' : '#721c24',
            border: `1px solid ${mensaje.includes('exitoso') ? '#c3e6c3' : '#f5c6cb'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <span>
              {mensaje.includes('exitoso') ? '✅' : '⚠️'}
            </span>
            {mensaje}
          </div>
        )}
        
        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #ecf0f1'
        }}>
          <h4 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#2c3e50',
            margin: '0 0 15px 0',
            textAlign: 'center'
          }}>
            📋 Credenciales de prueba
          </h4>
          <div style={{
            fontSize: '14px',
            color: '#34495e'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
              padding: '8px',
              backgroundColor: 'white',
              borderRadius: '6px'
            }}>
              <span><strong>📧 Email:</strong></span>
              <span style={{ color: '#3498db', fontFamily: 'monospace' }}>
                admin@farmacia.com
              </span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px',
              backgroundColor: 'white',
              borderRadius: '6px'
            }}>
              <span><strong>🔐 Contraseña:</strong></span>
              <span style={{ color: '#3498db', fontFamily: 'monospace' }}>
                123456
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '20px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#95a5a6'
        }}>
          Sistema de Gestión Farmacéutica v1.0
        </div>
      </div>

      {/* Agregar estilos de animación */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @media (max-width: 480px) {
            .login-container {
              padding: 15px 10px;
            }
          }
        `}
      </style>
    </div>
  );
}