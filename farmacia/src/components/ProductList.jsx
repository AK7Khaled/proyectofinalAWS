import React, { useState } from 'react';

export default function ProductList({ products, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.laboratorio.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filterCategory || product.categoria === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Obtener categorías únicas
  const categories = [...new Set(products.map(p => p.categoria))];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(price);
  };

  const getStockStatus = (stock) => {
    if (stock <= 10) return { color: '#e74c3c', text: 'Stock Bajo' };
    if (stock <= 50) return { color: '#f39c12', text: 'Stock Medio' };
    return { color: '#27ae60', text: 'Stock Alto' };
  };

  const isExpiringSoon = (date) => {
    const expiryDate = new Date(date);
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 90; // Expira en 90 días o menos
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>
          📦 Lista de Productos ({filteredProducts.length})
        </h2>
        
        {/* Filtros */}
        <div style={{ 
          display: 'flex', 
          flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
          gap: '15px', 
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          <input
            type="text"
            placeholder="🔍 Buscar por nombre, código o laboratorio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: window.innerWidth <= 768 ? 'none' : 1,
              width: window.innerWidth <= 768 ? '100%' : 'auto',
              minWidth: window.innerWidth <= 768 ? 'auto' : '300px',
              padding: window.innerWidth <= 480 ? '10px' : '12px',
              border: '2px solid #ecf0f1',
              borderRadius: '6px',
              fontSize: window.innerWidth <= 480 ? '12px' : '14px'
            }}
          />
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              padding: window.innerWidth <= 480 ? '10px' : '12px',
              border: '2px solid #ecf0f1',
              borderRadius: '6px',
              fontSize: window.innerWidth <= 480 ? '12px' : '14px',
              width: window.innerWidth <= 768 ? '100%' : 'auto',
              minWidth: window.innerWidth <= 768 ? 'auto' : '150px'
            }}
          >
            <option value="">Todas las categorías</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla de productos */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          backgroundColor: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
              <th style={tableHeaderStyle}>Código</th>
              <th style={tableHeaderStyle}>Nombre</th>
              <th style={tableHeaderStyle}>Categoría</th>
              <th style={tableHeaderStyle}>Precio</th>
              <th style={tableHeaderStyle}>Stock</th>
              <th style={tableHeaderStyle}>Vencimiento</th>
              <th style={tableHeaderStyle}>Laboratorio</th>
              <th style={tableHeaderStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ 
                  textAlign: 'center', 
                  padding: '40px',
                  color: '#7f8c8d',
                  fontSize: '16px'
                }}>
                  {products.length === 0 
                    ? '📭 No hay productos en el inventario' 
                    : '🔍 No se encontraron productos con esos criterios'
                  }
                </td>
              </tr>
            ) : (
              filteredProducts.map((product, index) => {
                const stockStatus = getStockStatus(product.stock);
                const expiringSoon = isExpiringSoon(product.fechaVencimiento);
                
                return (
                  <tr 
                    key={product.id}
                    style={{ 
                      backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                      borderBottom: '1px solid #ecf0f1'
                    }}
                  >
                    <td style={tableCellStyle}>{product.codigo}</td>
                    <td style={{...tableCellStyle, fontWeight: 'bold'}}>
                      {product.nombre}
                    </td>
                    <td style={tableCellStyle}>
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: '#ecf0f1',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#2c3e50'
                      }}>
                        {product.categoria}
                      </span>
                    </td>
                    <td style={{...tableCellStyle, fontWeight: 'bold', color: '#27ae60'}}>
                      {formatPrice(product.precio)}
                    </td>
                    <td style={tableCellStyle}>
                      <span style={{
                        color: stockStatus.color,
                        fontWeight: 'bold'
                      }}>
                        {product.stock}
                      </span>
                    </td>
                    <td style={tableCellStyle}>
                      <span style={{
                        color: expiringSoon ? '#e74c3c' : '#2c3e50',
                        fontWeight: expiringSoon ? 'bold' : 'normal'
                      }}>
                        {new Date(product.fechaVencimiento).toLocaleDateString('es-PE')}
                        {expiringSoon && ' ⚠️'}
                      </span>
                    </td>
                    <td style={tableCellStyle}>{product.laboratorio}</td>
                    <td style={tableCellStyle}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => onEdit(product)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#3498db',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => onDelete(product.id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Resumen */}
      {filteredProducts.length > 0 && (
        <div style={{ 
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#ecf0f1',
          borderRadius: '6px',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <strong>Total de productos:</strong> {filteredProducts.length}
          </div>
          <div>
            <strong>Valor total del inventario:</strong> {' '}
            {formatPrice(filteredProducts.reduce((sum, p) => sum + (p.precio * p.stock), 0))}
          </div>
          <div>
            <strong>Productos con stock bajo:</strong> {' '}
            <span style={{ color: '#e74c3c' }}>
              {filteredProducts.filter(p => p.stock <= 10).length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

const tableHeaderStyle = {
  padding: '15px 12px',
  textAlign: 'left',
  fontWeight: 'bold',
  fontSize: '14px'
};

const tableCellStyle = {
  padding: '12px',
  fontSize: '14px',
  borderBottom: '1px solid #ecf0f1'
};