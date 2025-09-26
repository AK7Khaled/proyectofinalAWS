import React, { useState } from 'react';

export default function SalesList({ sales, loading }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar ventas por búsqueda
  const filteredSales = sales.filter(sale =>
    sale.cliente_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.cliente_dni?.includes(searchTerm) ||
    sale.id?.toString().includes(searchTerm)
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }}></div>
        <p>Cargando ventas...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px' 
        }}>
          <h2 style={{ margin: 0, color: '#2c3e50' }}>💰 Historial de Ventas</h2>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="🔍 Buscar por cliente, DNI o ID de venta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '10px 15px',
                border: '2px solid #e1e8ed',
                borderRadius: '25px',
                fontSize: '14px',
                width: '300px',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
            />
          </div>
        </div>

        {filteredSales.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#7f8c8d'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🛒</div>
            <h3>No hay ventas registradas</h3>
            <p>Las ventas aparecerán aquí una vez que registres la primera</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold', color: '#2c3e50' }}>
                    ID Venta
                  </th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold', color: '#2c3e50' }}>
                    Cliente
                  </th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold', color: '#2c3e50' }}>
                    DNI
                  </th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold', color: '#2c3e50' }}>
                    Productos
                  </th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold', color: '#2c3e50' }}>
                    Total
                  </th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold', color: '#2c3e50' }}>
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale, index) => (
                  <tr 
                    key={sale.id} 
                    style={{ 
                      borderBottom: '1px solid #e1e8ed',
                      backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa',
                      transition: 'background-color 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e3f2fd'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#f8f9fa'}
                  >
                    <td style={{ padding: '15px', fontWeight: 'bold', color: '#3498db' }}>
                      #{sale.id}
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>
                        {sale.cliente_nombre}
                      </div>
                    </td>
                    <td style={{ padding: '15px', fontFamily: 'monospace' }}>
                      {sale.cliente_dni}
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                        {sale.items ? `${sale.items.length} productos` : 'N/A'}
                      </div>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <span style={{ 
                        fontWeight: 'bold', 
                        color: '#27ae60',
                        fontSize: '16px'
                      }}>
                        {formatCurrency(sale.total)}
                      </span>
                    </td>
                    <td style={{ padding: '15px', color: '#7f8c8d' }}>
                      {formatDate(sale.fecha_venta)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}