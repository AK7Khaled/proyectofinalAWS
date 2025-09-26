import React, { useState, useEffect } from 'react';

export default function SaleForm({ products, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    clienteDni: '',
    clienteNombre: '',
    productos: []
  });
  
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [errors, setErrors] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Detectar cambios de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const validateDNI = (dni) => {
    return /^\d{8}$/.test(dni);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.clienteDni.trim()) {
      newErrors.clienteDni = 'El DNI del cliente es requerido';
    } else if (!validateDNI(formData.clienteDni)) {
      newErrors.clienteDni = 'El DNI debe tener exactamente 8 dígitos';
    }

    if (!formData.clienteNombre.trim()) {
      newErrors.clienteNombre = 'El nombre del cliente es requerido';
    }

    if (formData.productos.length === 0) {
      newErrors.productos = 'Debe agregar al menos un producto';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const addProduct = () => {
    if (!selectedProduct) return;

    const product = products.find(p => p.id == selectedProduct);
    if (!product) return;

    if (selectedQuantity > product.stock) {
      alert(`Stock insuficiente. Solo hay ${product.stock} unidades disponibles.`);
      return;
    }

    const existingProductIndex = formData.productos.findIndex(p => p.id == selectedProduct);
    
    if (existingProductIndex >= 0) {
      const newQuantity = formData.productos[existingProductIndex].cantidad + selectedQuantity;
      if (newQuantity > product.stock) {
        alert(`Stock insuficiente. Solo hay ${product.stock} unidades disponibles.`);
        return;
      }

      const updatedProducts = [...formData.productos];
      updatedProducts[existingProductIndex].cantidad = newQuantity;
      updatedProducts[existingProductIndex].subtotal = newQuantity * product.precio;
      
      setFormData(prev => ({
        ...prev,
        productos: updatedProducts
      }));
    } else {
      const newProduct = {
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        cantidad: selectedQuantity,
        subtotal: selectedQuantity * product.precio
      };

      setFormData(prev => ({
        ...prev,
        productos: [...prev.productos, newProduct]
      }));
    }

    setSelectedProduct('');
    setSelectedQuantity(1);
  };

  const removeProduct = (productId) => {
    setFormData(prev => ({
      ...prev,
      productos: prev.productos.filter(p => p.id !== productId)
    }));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeProduct(productId);
      return;
    }

    const product = products.find(p => p.id == productId);
    if (newQuantity > product.stock) {
      alert(`Stock insuficiente. Solo hay ${product.stock} unidades disponibles.`);
      return;
    }

    const updatedProducts = formData.productos.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          cantidad: newQuantity,
          subtotal: newQuantity * p.precio
        };
      }
      return p;
    });

    setFormData(prev => ({
      ...prev,
      productos: updatedProducts
    }));
  };

  const getTotalAmount = () => {
    return formData.productos.reduce((total, product) => total + product.subtotal, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const saleData = {
      cliente_dni: formData.clienteDni.trim(),
      cliente_nombre: formData.clienteNombre.trim(),
      items: formData.productos.map(producto => ({
        producto_id: producto.id,
        cantidad: producto.cantidad,
        precio_unitario: producto.precio
      })),
      total: getTotalAmount()
    };

    onSubmit(saleData);
  };

  // Estilos responsivos
  const containerStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: isMobile ? '15px' : '20px'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: isMobile ? '20px' : '30px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  };

  const titleStyle = {
    fontSize: isMobile ? '20px' : '24px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '25px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  };

  const sectionTitleStyle = {
    fontSize: isMobile ? '16px' : '18px',
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px'
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#34495e',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  };

  const inputStyle = {
    padding: isMobile ? '12px' : '14px',
    border: '2px solid #ecf0f1',
    borderRadius: '8px',
    fontSize: isMobile ? '16px' : '14px',
    outline: 'none',
    transition: 'all 0.3s ease'
  };

  const buttonStyle = {
    padding: isMobile ? '12px 16px' : '10px 20px',
    borderRadius: '8px',
    fontSize: isMobile ? '14px' : '13px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: 'none'
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(price);
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>
          🛒 Nueva Venta
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Información del Cliente */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={sectionTitleStyle}>
              👤 Información del Cliente
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr',
              gap: '20px'
            }}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>
                  🆔 DNI del Cliente
                </label>
                <input
                  type="text"
                  name="clienteDni"
                  value={formData.clienteDni}
                  onChange={handleChange}
                  maxLength="8"
                  style={{
                    ...inputStyle,
                    borderColor: errors.clienteDni ? '#e74c3c' : '#ecf0f1'
                  }}
                  placeholder="12345678"
                />
                {errors.clienteDni && (
                  <span style={{ color: '#e74c3c', fontSize: '12px' }}>
                    ⚠️ {errors.clienteDni}
                  </span>
                )}
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>
                  📝 Nombre del Cliente
                </label>
                <input
                  type="text"
                  name="clienteNombre"
                  value={formData.clienteNombre}
                  onChange={handleChange}
                  style={{
                    ...inputStyle,
                    borderColor: errors.clienteNombre ? '#e74c3c' : '#ecf0f1'
                  }}
                  placeholder="Nombre completo del cliente"
                />
                {errors.clienteNombre && (
                  <span style={{ color: '#e74c3c', fontSize: '12px' }}>
                    ⚠️ {errors.clienteNombre}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Agregar Productos */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={sectionTitleStyle}>
              📦 Agregar Productos
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr auto',
              gap: '15px',
              alignItems: 'end',
              marginBottom: '20px'
            }}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>
                  Producto
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">Seleccionar producto</option>
                  {products.filter(p => p.stock > 0).map(product => (
                    <option key={product.id} value={product.id}>
                      {product.nombre} - {formatPrice(product.precio)} (Stock: {product.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>
                  Cantidad
                </label>
                <input
                  type="number"
                  min="1"
                  value={selectedQuantity}
                  onChange={(e) => setSelectedQuantity(parseInt(e.target.value) || 1)}
                  style={inputStyle}
                />
              </div>

              <button
                type="button"
                onClick={addProduct}
                disabled={!selectedProduct}
                style={{
                  ...buttonStyle,
                  backgroundColor: selectedProduct ? '#3498db' : '#bdc3c7',
                  color: 'white',
                  width: isMobile ? '100%' : 'auto',
                  marginTop: isMobile ? '10px' : '0'
                }}
              >
                ➕ {isMobile ? 'Agregar' : 'Agregar Producto'}
              </button>
            </div>
          </div>

          {/* Lista de Productos Agregados */}
          {formData.productos.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <h3 style={sectionTitleStyle}>
                🛍️ Productos en la Venta ({formData.productos.length})
              </h3>
              
              {isMobile ? (
                // Vista de cards para móvil
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {formData.productos.map((product, index) => (
                    <div key={product.id} style={{
                      padding: '15px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                      border: '1px solid #ecf0f1'
                    }}>
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '10px'
                      }}>
                        <h4 style={{ 
                          margin: 0,
                          fontSize: '16px',
                          color: '#2c3e50'
                        }}>
                          {product.nombre}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeProduct(product.id)}
                          style={{
                            ...buttonStyle,
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            padding: '6px 10px',
                            fontSize: '12px'
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                      
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '10px',
                        fontSize: '14px'
                      }}>
                        <div>
                          <strong>Precio:</strong><br/>
                          {formatPrice(product.precio)}
                        </div>
                        <div>
                          <strong>Cantidad:</strong><br/>
                          <input
                            type="number"
                            min="1"
                            value={product.cantidad}
                            onChange={(e) => updateQuantity(product.id, parseInt(e.target.value) || 1)}
                            style={{
                              width: '60px',
                              padding: '4px',
                              border: '1px solid #ddd',
                              borderRadius: '4px',
                              textAlign: 'center'
                            }}
                          />
                        </div>
                        <div>
                          <strong>Subtotal:</strong><br/>
                          <span style={{ color: '#27ae60', fontWeight: 'bold' }}>
                            {formatPrice(product.subtotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Vista de tabla para escritorio
                <div style={{ 
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid #ecf0f1'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Producto</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Precio</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>Cantidad</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Subtotal</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.productos.map((product, index) => (
                        <tr key={product.id} style={{
                          backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white'
                        }}>
                          <td style={{ padding: '12px' }}>{product.nombre}</td>
                          <td style={{ padding: '12px', textAlign: 'right' }}>
                            {formatPrice(product.precio)}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <input
                              type="number"
                              min="1"
                              value={product.cantidad}
                              onChange={(e) => updateQuantity(product.id, parseInt(e.target.value) || 1)}
                              style={{
                                width: '70px',
                                padding: '6px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                textAlign: 'center'
                              }}
                            />
                          </td>
                          <td style={{ 
                            padding: '12px', 
                            textAlign: 'right',
                            fontWeight: 'bold',
                            color: '#27ae60'
                          }}>
                            {formatPrice(product.subtotal)}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => removeProduct(product.id)}
                              style={{
                                ...buttonStyle,
                                backgroundColor: '#e74c3c',
                                color: 'white',
                                padding: '6px 12px',
                                fontSize: '12px'
                              }}
                            >
                              🗑️ Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Total */}
              <div style={{
                marginTop: '20px',
                padding: '20px',
                backgroundColor: '#27ae60',
                color: 'white',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <h3 style={{ 
                  margin: 0,
                  fontSize: isMobile ? '20px' : '24px'
                }}>
                  💰 Total: {formatPrice(getTotalAmount())}
                </h3>
              </div>
            </div>
          )}

          {errors.productos && (
            <div style={{ 
              color: '#e74c3c', 
              fontSize: '14px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              ⚠️ {errors.productos}
            </div>
          )}

          {/* Botones */}
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '15px',
            justifyContent: 'center'
          }}>
            <button
              type="submit"
              style={{
                ...buttonStyle,
                backgroundColor: '#27ae60',
                color: 'white',
                padding: isMobile ? '14px 20px' : '12px 30px',
                fontSize: '16px',
                minWidth: isMobile ? '100%' : '180px'
              }}
            >
              💾 Registrar Venta
            </button>
            <button
              type="button"
              onClick={onCancel}
              style={{
                ...buttonStyle,
                backgroundColor: '#95a5a6',
                color: 'white',
                padding: isMobile ? '14px 20px' : '12px 30px',
                fontSize: '16px',
                minWidth: isMobile ? '100%' : '120px'
              }}
            >
              ❌ Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}