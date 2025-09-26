import React, { useState, useEffect } from 'react';

export default function ProductList({ products, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Detectar cambios de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <div style={{ 
      padding: isMobile ? '10px' : '0'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ 
          color: '#2c3e50', 
          marginBottom: '20px',
          fontSize: window.innerWidth <= 480 ? '18px' : window.innerWidth <= 768 ? '20px' : '24px',
          textAlign: isMobile ? 'center' : 'left'
        }}>
          📦 Lista de Productos ({filteredProducts.length})
        </h2>
        
        {/* Filtros */}
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
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
              flex: isMobile ? 'none' : 1,
              width: isMobile ? '100%' : 'auto',
              minWidth: isMobile ? 'auto' : '300px',
              padding: window.innerWidth <= 480 ? '10px' : '12px',
              border: '2px solid #ecf0f1',
              borderRadius: '8px',
              fontSize: window.innerWidth <= 480 ? '14px' : '16px',
              outline: 'none',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3498db'}
            onBlur={(e) => e.target.style.borderColor = '#ecf0f1'}
          />
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              padding: window.innerWidth <= 480 ? '10px' : '12px',
              border: '2px solid #ecf0f1',
              borderRadius: '8px',
              fontSize: window.innerWidth <= 480 ? '14px' : '16px',
              width: isMobile ? '100%' : 'auto',
              minWidth: isMobile ? 'auto' : '200px',
              backgroundColor: 'white',
              cursor: 'pointer'
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

      {/* Lista de productos - Responsive */}
      {isMobile ? (
        // Vista de Cards para móviles
        <div style={{ 
          display: 'grid', 
          gap: '15px',
          gridTemplateColumns: window.innerWidth <= 480 ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))'
        }}>
          {filteredProducts.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px',
              color: '#7f8c8d',
              fontSize: '16px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              {products.length === 0 
                ? '📭 No hay productos en el inventario' 
                : '🔍 No se encontraron productos con esos criterios'
              }
            </div>
          ) : (
            filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              const expiringSoon = isExpiringSoon(product.fechaVencimiento);
              
              return (
                <div 
                  key={product.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    border: expiringSoon ? '2px solid #e74c3c' : '1px solid #ecf0f1',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 15px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                  }}
                >
                  {/* Header del Card */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '15px'
                  }}>
                    <h3 style={{ 
                      margin: 0, 
                      color: '#2c3e50',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      lineHeight: '1.3'
                    }}>
                      {product.nombre}
                    </h3>
                    <span style={{
                      padding: '6px 10px',
                      backgroundColor: '#3498db',
                      color: 'white',
                      borderRadius: '15px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                      marginLeft: '10px'
                    }}>
                      {product.codigo}
                    </span>
                  </div>
                  
                  {/* Info Grid */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '15px'
                  }}>
                    <div style={{ 
                      padding: '10px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px'
                    }}>
                      <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '4px' }}>
                        Categoría
                      </div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#2c3e50'
                      }}>
                        {product.categoria}
                      </div>
                    </div>
                    
                    <div style={{ 
                      padding: '10px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px'
                    }}>
                      <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '4px' }}>
                        Precio
                      </div>
                      <div style={{ 
                        fontSize: '16px',
                        fontWeight: 'bold', 
                        color: '#27ae60' 
                      }}>
                        {formatPrice(product.precio)}
                      </div>
                    </div>
                    
                    <div style={{ 
                      padding: '10px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px'
                    }}>
                      <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '4px' }}>
                        Stock
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          padding: '4px 8px',
                          backgroundColor: stockStatus.color,
                          color: 'white',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {product.stock}
                        </span>
                        <span style={{ fontSize: '10px', color: stockStatus.color }}>
                          {stockStatus.text}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ 
                      padding: '10px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px'
                    }}>
                      <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '4px' }}>
                        Laboratorio
                      </div>
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: 'bold',
                        color: '#2c3e50'
                      }}>
                        {product.laboratorio}
                      </div>
                    </div>
                  </div>
                  
                  {/* Fecha de Vencimiento */}
                  <div style={{ 
                    padding: '10px',
                    backgroundColor: expiringSoon ? '#fee' : '#f8f9fa',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '4px' }}>
                      Fecha de Vencimiento
                    </div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: expiringSoon ? '#e74c3c' : '#2c3e50'
                    }}>
                      {new Date(product.fechaVencimiento).toLocaleDateString('es-PE')}
                      {expiringSoon && (
                        <div style={{ fontSize: '12px', marginTop: '4px' }}>
                          ⚠️ Próximo a vencer
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Botones de Acción */}
                  <div style={{ 
                    display: 'flex', 
                    gap: '10px'
                  }}>
                    <button
                      onClick={() => onEdit(product)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        // Vista de Tabla para escritorio
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white' 
                }}>
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
                          borderBottom: '1px solid #ecf0f1',
                          transition: 'background-color 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#e8f4f8'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = index % 2 === 0 ? '#f8f9fa' : 'white'}
                      >
                        <td style={tableCellStyle}>
                          <span style={{
                            padding: '4px 8px',
                            backgroundColor: '#3498db',
                            color: 'white',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {product.codigo}
                          </span>
                        </td>
                        <td style={{...tableCellStyle, fontWeight: 'bold'}}>
                          {product.nombre}
                        </td>
                        <td style={tableCellStyle}>
                          <span style={{
                            padding: '4px 8px',
                            backgroundColor: '#ecf0f1',
                            borderRadius: '12px',
                            fontSize: '12px'
                          }}>
                            {product.categoria}
                          </span>
                        </td>
                        <td style={{...tableCellStyle, fontWeight: 'bold', color: '#27ae60'}}>
                          {formatPrice(product.precio)}
                        </td>
                        <td style={tableCellStyle}>
                          <span style={{
                            padding: '4px 8px',
                            backgroundColor: stockStatus.color,
                            color: 'white',
                            borderRadius: '12px',
                            fontSize: '12px',
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
                          </span>
                          {expiringSoon && (
                            <div style={{ fontSize: '10px', color: '#e74c3c' }}>
                              ⚠️ Próximo a vencer
                            </div>
                          )}
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
                                fontSize: '12px',
                                transition: 'background-color 0.3s ease'
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
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
                                fontSize: '12px',
                                transition: 'background-color 0.3s ease'
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
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
        </div>
      )}

      {/* Resumen */}
      {filteredProducts.length > 0 && (
        <div style={{ 
          marginTop: '20px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          textAlign: 'center'
        }}>
          <div style={{
            padding: '15px',
            backgroundColor: '#3498db',
            color: 'white',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {filteredProducts.length}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              Total productos
            </div>
          </div>
          <div style={{
            padding: '15px',
            backgroundColor: '#27ae60',
            color: 'white',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
              {formatPrice(filteredProducts.reduce((sum, p) => sum + (p.precio * p.stock), 0))}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              Valor inventario
            </div>
          </div>
          <div style={{
            padding: '15px',
            backgroundColor: '#e74c3c',
            color: 'white',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {filteredProducts.filter(p => p.stock <= 10).length}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              Stock bajo
            </div>
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