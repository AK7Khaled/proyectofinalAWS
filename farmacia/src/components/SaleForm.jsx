import React, { useState, useEffect } from 'react';

export default function SaleForm({ products, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    cliente_nombre: '',
    cliente_dni: '',
    items: []
  });
  
  const [currentItem, setCurrentItem] = useState({
    producto_id: '',
    cantidad: 1
  });

  const [errors, setErrors] = useState({});
  const [total, setTotal] = useState(0);

  // Calcular total cuando cambien los items
  useEffect(() => {
    const newTotal = formData.items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.producto_id);
      return sum + (product ? product.precio * item.cantidad : 0);
    }, 0);
    setTotal(newTotal);
  }, [formData.items, products]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.cliente_nombre.trim()) {
      newErrors.cliente_nombre = 'El nombre del cliente es requerido';
    }

    if (!formData.cliente_dni.trim()) {
      newErrors.cliente_dni = 'El DNI del cliente es requerido';
    } else if (!/^\d{8}$/.test(formData.cliente_dni)) {
      newErrors.cliente_dni = 'El DNI debe tener 8 dígitos';
    }

    if (formData.items.length === 0) {
      newErrors.items = 'Debe agregar al menos un producto';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddItem = () => {
    if (!currentItem.producto_id) {
      alert('Selecciona un producto');
      return;
    }

    const product = products.find(p => p.id === parseInt(currentItem.producto_id));
    if (!product) {
      alert('Producto no encontrado');
      return;
    }

    if (currentItem.cantidad > product.stock) {
      alert(`Stock insuficiente. Disponible: ${product.stock}`);
      return;
    }

    // Verificar si el producto ya está en la lista
    const existingItemIndex = formData.items.findIndex(item => item.producto_id === parseInt(currentItem.producto_id));
    
    if (existingItemIndex !== -1) {
      // Actualizar cantidad
      const newItems = [...formData.items];
      const newCantidad = newItems[existingItemIndex].cantidad + currentItem.cantidad;
      
      if (newCantidad > product.stock) {
        alert(`Stock insuficiente. Disponible: ${product.stock}`);
        return;
      }
      
      newItems[existingItemIndex].cantidad = newCantidad;
      setFormData(prev => ({ ...prev, items: newItems }));
    } else {
      // Agregar nuevo item
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, {
          producto_id: parseInt(currentItem.producto_id),
          cantidad: currentItem.cantidad,
          precio_unitario: product.precio
        }]
      }));
    }

    // Resetear item actual
    setCurrentItem({
      producto_id: '',
      cantidad: 1
    });

    // Limpiar error de items
    if (errors.items) {
      setErrors(prev => ({ ...prev, items: '' }));
    }
  };

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        total: total
      });
    }
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.nombre : 'Producto no encontrado';
  };

  const getProductPrice = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.precio : 0;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  return (
    <div style={{ 
      background: 'white', 
      padding: '30px', 
      borderRadius: '12px', 
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        borderBottom: '2px solid #e1e8ed',
        paddingBottom: '20px'
      }}>
        <h2 style={{ margin: 0, color: '#2c3e50' }}>🛒 Nueva Venta</h2>
        <button 
          onClick={onCancel}
          style={{
            background: '#95a5a6',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ✕ Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          {/* Datos del Cliente */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold', 
              color: '#2c3e50' 
            }}>
              👤 Nombre del Cliente *
            </label>
            <input
              type="text"
              name="cliente_nombre"
              value={formData.cliente_nombre}
              onChange={handleInputChange}
              placeholder="Ingresa el nombre completo"
              style={{
                width: '100%',
                padding: '12px',
                border: errors.cliente_nombre ? '2px solid #e74c3c' : '2px solid #e1e8ed',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
            />
            {errors.cliente_nombre && (
              <p style={{ color: '#e74c3c', fontSize: '14px', margin: '5px 0 0 0' }}>
                {errors.cliente_nombre}
              </p>
            )}
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold', 
              color: '#2c3e50' 
            }}>
              🆔 DNI del Cliente *
            </label>
            <input
              type="text"
              name="cliente_dni"
              value={formData.cliente_dni}
              onChange={handleInputChange}
              placeholder="12345678"
              maxLength="8"
              style={{
                width: '100%',
                padding: '12px',
                border: errors.cliente_dni ? '2px solid #e74c3c' : '2px solid #e1e8ed',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                fontFamily: 'monospace'
              }}
            />
            {errors.cliente_dni && (
              <p style={{ color: '#e74c3c', fontSize: '14px', margin: '5px 0 0 0' }}>
                {errors.cliente_dni}
              </p>
            )}
          </div>
        </div>

        {/* Agregar Productos */}
        <div style={{ 
          background: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '2px solid #e1e8ed'
        }}>
          <h3 style={{ marginTop: 0, color: '#2c3e50' }}>📦 Agregar Productos</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '15px', alignItems: 'end' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: 'bold', 
                color: '#2c3e50' 
              }}>
                Producto
              </label>
              <select
                value={currentItem.producto_id}
                onChange={(e) => setCurrentItem(prev => ({ ...prev, producto_id: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e1e8ed',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
              >
                <option value="">Seleccionar producto...</option>
                {products.filter(p => p.stock > 0).map(product => (
                  <option key={product.id} value={product.id}>
                    {product.nombre} - {formatCurrency(product.precio)} (Stock: {product.stock})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: 'bold', 
                color: '#2c3e50' 
              }}>
                Cantidad
              </label>
              <input
                type="number"
                min="1"
                value={currentItem.cantidad}
                onChange={(e) => setCurrentItem(prev => ({ ...prev, cantidad: parseInt(e.target.value) || 1 }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e1e8ed',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>

            <button
              type="button"
              onClick={handleAddItem}
              style={{
                background: '#3498db',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              ➕ Agregar
            </button>
          </div>

          {errors.items && (
            <p style={{ color: '#e74c3c', fontSize: '14px', margin: '10px 0 0 0' }}>
              {errors.items}
            </p>
          )}
        </div>

        {/* Lista de Productos Agregados */}
        {formData.items.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#2c3e50' }}>🛍️ Productos en la Venta</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Producto</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>Cantidad</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>Precio Unit.</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>Subtotal</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #e1e8ed' }}>
                      <td style={{ padding: '12px' }}>{getProductName(item.producto_id)}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>{item.cantidad}</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        {formatCurrency(getProductPrice(item.producto_id))}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                        {formatCurrency(getProductPrice(item.producto_id) * item.cantidad)}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          style={{
                            background: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ 
              textAlign: 'right', 
              marginTop: '15px', 
              padding: '15px',
              background: '#e8f5e8',
              borderRadius: '8px'
            }}>
              <h2 style={{ margin: 0, color: '#27ae60' }}>
                Total: {formatCurrency(total)}
              </h2>
            </div>
          </div>
        )}

        {/* Botones */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: '#95a5a6',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            style={{
              background: '#27ae60',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            💰 Registrar Venta
          </button>
        </div>
      </form>
    </div>
  );
}