import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ProductList from './ProductListResponsive';
import ProductForm from './ProductFormResponsive';
import SalesList from './SalesListResponsive';
import SaleForm from './SaleFormResponsive';
import axios from 'axios';

export default function Dashboard() {
  const { user, logout, token } = useAuth();
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'edit', 'sales', 'newSale'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Configurar axios con el token
  const api = axios.create({
    baseURL: 'http://ec2-18-191-42-211.us-east-2.compute.amazonaws.com:5000/api',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  // Cargar productos y ventas desde el backend
  useEffect(() => {
    loadProducts();
    loadSales();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/productos');
      setProducts(response.data);
      setMessage('');
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setMessage('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  // Cargar ventas desde el backend
  const loadSales = async () => {
    try {
      const response = await api.get('/ventas');
      setSales(response.data);
    } catch (error) {
      console.error('Error al cargar ventas:', error);
      setMessage('Error al cargar ventas');
    }
  };

  // Crear producto
  const handleCreateProduct = async (productData) => {
    try {
      await api.post('/productos', productData);
      setMessage('Producto creado exitosamente');
      loadProducts();
      setCurrentView('list');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error al crear producto:', error);
      setMessage(error.response?.data?.error || 'Error al crear producto');
    }
  };

  // Actualizar producto
  const handleUpdateProduct = async (productData) => {
    try {
      await api.put(`/productos/${selectedProduct.id}`, productData);
      setMessage('Producto actualizado exitosamente');
      loadProducts();
      setCurrentView('list');
      setSelectedProduct(null);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      setMessage(error.response?.data?.error || 'Error al actualizar producto');
    }
  };

  // Eliminar producto
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await api.delete(`/productos/${productId}`);
        setMessage('Producto eliminado exitosamente');
        loadProducts();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        setMessage(error.response?.data?.error || 'Error al eliminar producto');
      }
    }
  };

  // Manejar edición
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setCurrentView('edit');
  };

  // Crear venta
  const handleCreateSale = async (saleData) => {
    try {
      await api.post('/ventas', saleData);
      setMessage('Venta registrada exitosamente');
      loadSales();
      loadProducts(); // Recargar productos para actualizar stock
      setCurrentView('sales');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error al registrar venta:', error);
      setMessage(error.response?.data?.error || 'Error al registrar venta');
    }
  };

  if (loading && products.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ 
          width: '50px', 
          height: '50px', 
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#7f8c8d' }}>Cargando inventario...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f6fa' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '15px 10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: window.innerWidth <= 768 ? 'center' : 'center',
          gap: window.innerWidth <= 768 ? '15px' : '0'
        }}>
          <div style={{ textAlign: window.innerWidth <= 768 ? 'center' : 'left' }}>
            <h1 style={{ 
              margin: 0, 
              fontSize: window.innerWidth <= 480 ? '20px' : window.innerWidth <= 768 ? '24px' : '28px', 
              fontWeight: 'bold' 
            }}>
              🏥 Farmacia Dashboard
            </h1>
            <p style={{ 
              margin: '5px 0 0 0', 
              opacity: 0.9,
              fontSize: window.innerWidth <= 480 ? '12px' : '14px'
            }}>
              Bienvenido, {user?.email}
            </p>
          </div>
          <div style={{ 
            display: 'flex', 
            flexDirection: window.innerWidth <= 480 ? 'column' : 'row',
            gap: '10px', 
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: '8px 12px', 
              borderRadius: '20px',
              fontSize: window.innerWidth <= 480 ? '12px' : '14px',
              whiteSpace: 'nowrap'
            }}>
              📦 {products.length} productos
            </div>
            <div style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: '8px 12px', 
              borderRadius: '20px',
              fontSize: window.innerWidth <= 480 ? '12px' : '14px',
              whiteSpace: 'nowrap'
            }}>
              💰 {sales.length} ventas
            </div>
            <button 
              onClick={logout}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: window.innerWidth <= 480 ? '12px' : '14px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap'
              }}
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{
        background: 'white',
        padding: '10px 15px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #e1e8ed'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          gap: window.innerWidth <= 768 ? '10px' : '20px',
          flexWrap: 'wrap',
          justifyContent: window.innerWidth <= 480 ? 'center' : 'flex-start'
        }}>
          <button
            onClick={() => setCurrentView('list')}
            style={{
              background: currentView === 'list' ? '#3498db' : '#ecf0f1',
              color: currentView === 'list' ? 'white' : '#2c3e50',
              border: 'none',
              padding: window.innerWidth <= 480 ? '8px 12px' : '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: window.innerWidth <= 480 ? '12px' : '14px',
              whiteSpace: 'nowrap'
            }}
          >
            📋 Inventario
          </button>
          <button
            onClick={() => setCurrentView('create')}
            style={{
              background: currentView === 'create' ? '#27ae60' : '#ecf0f1',
              color: currentView === 'create' ? 'white' : '#2c3e50',
              border: 'none',
              padding: window.innerWidth <= 480 ? '8px 12px' : '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: window.innerWidth <= 480 ? '12px' : '14px',
              whiteSpace: 'nowrap'
            }}
          >
            ➕ {window.innerWidth <= 480 ? 'Nuevo' : 'Nuevo Producto'}
          </button>
          <button
            onClick={() => setCurrentView('sales')}
            style={{
              background: currentView === 'sales' ? '#e67e22' : '#ecf0f1',
              color: currentView === 'sales' ? 'white' : '#2c3e50',
              border: 'none',
              padding: window.innerWidth <= 480 ? '8px 12px' : '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: window.innerWidth <= 480 ? '12px' : '14px',
              whiteSpace: 'nowrap'
            }}
          >
            💰 Ventas
          </button>
          <button
            onClick={() => setCurrentView('newSale')}
            style={{
              background: currentView === 'newSale' ? '#9b59b6' : '#ecf0f1',
              color: currentView === 'newSale' ? 'white' : '#2c3e50',
              border: 'none',
              padding: window.innerWidth <= 480 ? '8px 12px' : '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: window.innerWidth <= 480 ? '12px' : '14px',
              whiteSpace: 'nowrap'
            }}
          >
            🛒 {window.innerWidth <= 480 ? 'Venta' : 'Nueva Venta'}
          </button>
        </div>
      </nav>

      {/* Message Display */}
      {message && (
        <div style={{
          maxWidth: '1200px',
          margin: '15px auto',
          padding: window.innerWidth <= 480 ? '12px 15px' : '15px 20px',
          backgroundColor: message.includes('Error') ? '#e74c3c' : '#27ae60',
          color: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginLeft: window.innerWidth <= 768 ? '10px' : 'auto',
          marginRight: window.innerWidth <= 768 ? '10px' : 'auto',
          fontSize: window.innerWidth <= 480 ? '14px' : '16px'
        }}>
          {message}
        </div>
      )}

      {/* Main Content */}
      <main style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: window.innerWidth <= 768 ? '15px 10px' : '20px'
      }}>
        {currentView === 'list' && (
          <ProductList
            products={products}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            loading={loading}
          />
        )}

        {currentView === 'create' && (
          <ProductForm
            onSubmit={handleCreateProduct}
            onCancel={() => setCurrentView('list')}
            isEdit={false}
          />
        )}

        {currentView === 'edit' && selectedProduct && (
          <ProductForm
            product={selectedProduct}
            onSubmit={handleUpdateProduct}
            onCancel={() => {
              setCurrentView('list');
              setSelectedProduct(null);
            }}
            isEdit={true}
          />
        )}

        {currentView === 'sales' && (
          <SalesList
            sales={sales}
            loading={loading}
          />
        )}

        {currentView === 'newSale' && (
          <SaleForm
            products={products}
            onSubmit={handleCreateSale}
            onCancel={() => setCurrentView('sales')}
          />
        )}
      </main>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}