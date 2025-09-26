import React, { useState, useEffect } from 'react';

export default function SalesList({ sales }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Detectar cambios de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filtrar ventas
  const filteredSales = sales.filter(sale => 
    sale.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.clienteDni.includes(searchTerm)
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Estilos responsivos
  const containerStyle = {
    padding: isMobile ? '10px' : '0'
  };

  const titleStyle = {
    color: '#2c3e50',
    marginBottom: '20px',
    fontSize: isMobile ? '18px' : '24px',
    textAlign: isMobile ? 'center' : 'left',
    display: 'flex',
    alignItems: 'center',
    justifyContent: isMobile ? 'center' : 'flex-start',
    gap: '10px'
  };

  const searchContainerStyle = {
    marginBottom: '20px'
  };

  const searchInputStyle = {
    width: '100%',
    padding: isMobile ? '12px' : '14px',
    border: '2px solid #ecf0f1',
    borderRadius: '8px',
    fontSize: isMobile ? '16px' : '14px',
    outline: 'none',
    transition: 'border-color 0.3s ease'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: isMobile ? '15px' : '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    marginBottom: '15px',
    border: '1px solid #ecf0f1'
  };

  const noDataStyle = {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#7f8c8d',
    fontSize: '16px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  };

  const tableStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    border: '1px solid #ecf0f1'
  };

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

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>
        💰 Historial de Ventas ({filteredSales.length})
      </h2>

      {/* Búsqueda */}
      <div style={searchContainerStyle}>
        <input
          type="text"
          placeholder="🔍 Buscar por nombre del cliente o DNI..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
          onFocus={(e) => e.target.style.borderColor = '#3498db'}
          onBlur={(e) => e.target.style.borderColor = '#ecf0f1'}
        />
      </div>

      {/* Lista de Ventas */}
      {filteredSales.length === 0 ? (
        <div style={noDataStyle}>
          {sales.length === 0 
            ? '📭 No hay ventas registradas' 
            : '🔍 No se encontraron ventas con esos criterios'
          }
        </div>
      ) : isMobile ? (
        // Vista de Cards para móviles
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filteredSales.map((sale) => (
            <div key={sale.id} style={cardStyle}>
              {/* Header del Card */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '15px',
                paddingBottom: '10px',
                borderBottom: '1px solid #ecf0f1'
              }}>
                <div>
                  <h3 style={{
                    margin: 0,
                    fontSize: '16px',
                    color: '#2c3e50',
                    fontWeight: 'bold'
                  }}>
                    👤 {sale.clienteNombre}
                  </h3>
                  <p style={{
                    margin: '4px 0 0 0',
                    fontSize: '14px',
                    color: '#7f8c8d'
                  }}>
                    DNI: {sale.clienteDni}
                  </p>
                </div>
                <div style={{
                  textAlign: 'right'
                }}>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#27ae60'
                  }}>
                    {formatPrice(sale.total)}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#7f8c8d',
                    marginTop: '2px'
                  }}>
                    {formatDate(sale.fechaVenta)}
                  </div>
                </div>
              </div>

              {/* Detalles de la Venta */}
              <div>
                <h4 style={{
                  margin: '0 0 10px 0',
                  fontSize: '14px',
                  color: '#34495e',
                  fontWeight: 'bold'
                }}>
                  📦 Productos ({sale.detalles?.length || 0}):
                </h4>
                
                {sale.detalles && sale.detalles.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {sale.detalles.map((detalle, index) => (
                      <div key={index} style={{
                        padding: '10px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '6px',
                        border: '1px solid #ecf0f1'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontSize: '14px',
                              fontWeight: 'bold',
                              color: '#2c3e50',
                              marginBottom: '2px'
                            }}>
                              {detalle.nombreProducto}
                            </div>
                            <div style={{
                              fontSize: '12px',
                              color: '#7f8c8d'
                            }}>
                              {formatPrice(detalle.precioUnitario)} × {detalle.cantidad}
                            </div>
                          </div>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: '#27ae60'
                          }}>
                            {formatPrice(detalle.subtotal)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{
                    margin: 0,
                    fontSize: '12px',
                    color: '#95a5a6',
                    fontStyle: 'italic'
                  }}>
                    Sin detalles disponibles
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Vista de Tabla para escritorio
        <div style={tableStyle}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white'
                }}>
                  <th style={tableHeaderStyle}>Fecha</th>
                  <th style={tableHeaderStyle}>Cliente</th>
                  <th style={tableHeaderStyle}>DNI</th>
                  <th style={tableHeaderStyle}>Productos</th>
                  <th style={tableHeaderStyle}>Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale, index) => (
                  <tr
                    key={sale.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                      borderBottom: '1px solid #ecf0f1',
                      transition: 'background-color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#e8f4f8'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = index % 2 === 0 ? '#f8f9fa' : 'white'}
                  >
                    <td style={tableCellStyle}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                        {formatDate(sale.fechaVenta)}
                      </div>
                    </td>
                    <td style={{...tableCellStyle, fontWeight: 'bold'}}>
                      {sale.clienteNombre}
                    </td>
                    <td style={tableCellStyle}>
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: '#3498db',
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {sale.clienteDni}
                      </span>
                    </td>
                    <td style={tableCellStyle}>
                      {sale.detalles && sale.detalles.length > 0 ? (
                        <div>
                          <div style={{ 
                            fontSize: '12px', 
                            color: '#7f8c8d',
                            marginBottom: '4px'
                          }}>
                            {sale.detalles.length} producto{sale.detalles.length !== 1 ? 's' : ''}
                          </div>
                          <div style={{ 
                            maxHeight: '100px', 
                            overflowY: 'auto',
                            fontSize: '11px'
                          }}>
                            {sale.detalles.map((detalle, idx) => (
                              <div key={idx} style={{
                                marginBottom: '2px',
                                padding: '2px 0'
                              }}>
                                • {detalle.nombreProducto} ({detalle.cantidad}x)
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <span style={{ 
                          fontSize: '12px', 
                          color: '#95a5a6',
                          fontStyle: 'italic'
                        }}>
                          Sin detalles
                        </span>
                      )}
                    </td>
                    <td style={{
                      ...tableCellStyle, 
                      fontWeight: 'bold', 
                      color: '#27ae60',
                      fontSize: '16px'
                    }}>
                      {formatPrice(sale.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Resumen de Ventas */}
      {filteredSales.length > 0 && (
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
              {filteredSales.length}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              Total Ventas
            </div>
          </div>
          
          <div style={{
            padding: '15px',
            backgroundColor: '#27ae60',
            color: 'white',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: 'bold' }}>
              {formatPrice(filteredSales.reduce((sum, sale) => sum + sale.total, 0))}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              Ingresos Totales
            </div>
          </div>
          
          <div style={{
            padding: '15px',
            backgroundColor: '#f39c12',
            color: 'white',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: 'bold' }}>
              {formatPrice(filteredSales.reduce((sum, sale) => sum + sale.total, 0) / filteredSales.length)}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              Promedio por Venta
            </div>
          </div>
        </div>
      )}
    </div>
  );
}