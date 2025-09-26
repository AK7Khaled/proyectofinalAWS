import React, { useState, useEffect } from 'react';

export default function ProductForm({ product, onSubmit, onCancel, isEdit = false }) {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria: '',
    precio: '',
    stock: '',
    fechaVencimiento: '',
    laboratorio: '',
    presentacion: ''
  });

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

  const categorias = [
    'Analgésicos',
    'Antibióticos',
    'Antiinflamatorios',
    'Antialérgicos',
    'Vitaminas',
    'Suplementos',
    'Dermatológicos',
    'Oftalmológicos',
    'Respiratorios',
    'Digestivos',
    'Cardiovasculares',
    'Otros'
  ];

  const presentaciones = [
    'Tabletas',
    'Cápsulas',
    'Jarabe',
    'Suspensión',
    'Crema',
    'Pomada',
    'Gel',
    'Gotas',
    'Inyectable',
    'Supositorio',
    'Parche',
    'Aerosol'
  ];

  useEffect(() => {
    if (product && isEdit) {
      setFormData({
        codigo: product.codigo || '',
        nombre: product.nombre || '',
        descripcion: product.descripcion || '',
        categoria: product.categoria || '',
        precio: product.precio?.toString() || '',
        stock: product.stock?.toString() || '',
        fechaVencimiento: product.fechaVencimiento || '',
        laboratorio: product.laboratorio || '',
        presentacion: product.presentacion || ''
      });
    }
  }, [product, isEdit]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.codigo.trim()) {
      newErrors.codigo = 'El código es requerido';
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.categoria) {
      newErrors.categoria = 'La categoría es requerida';
    }

    if (!formData.precio.trim()) {
      newErrors.precio = 'El precio es requerido';
    } else if (isNaN(formData.precio) || parseFloat(formData.precio) <= 0) {
      newErrors.precio = 'El precio debe ser un número mayor a 0';
    }

    if (!formData.stock.trim()) {
      newErrors.stock = 'El stock es requerido';
    } else if (isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'El stock debe ser un número mayor o igual a 0';
    }

    if (!formData.fechaVencimiento) {
      newErrors.fechaVencimiento = 'La fecha de vencimiento es requerida';
    } else {
      const today = new Date();
      const expiryDate = new Date(formData.fechaVencimiento);
      if (expiryDate <= today) {
        newErrors.fechaVencimiento = 'La fecha de vencimiento debe ser posterior a hoy';
      }
    }

    if (!formData.laboratorio.trim()) {
      newErrors.laboratorio = 'El laboratorio es requerido';
    }

    if (!formData.presentacion) {
      newErrors.presentacion = 'La presentación es requerida';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const productData = {
      codigo: formData.codigo.trim(),
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      categoria: formData.categoria,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock),
      fechaVencimiento: formData.fechaVencimiento,
      laboratorio: formData.laboratorio.trim(),
      presentacion: formData.presentacion
    };

    onSubmit(productData);
  };

  // Estilos responsivos
  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: isMobile ? '15px' : '20px'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: isMobile ? '20px' : '30px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    border: '1px solid #ecf0f1'
  };

  const titleStyle = {
    fontSize: isMobile ? '20px' : '24px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '20px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  };

  const formGridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
    gap: '20px',
    marginBottom: '25px'
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
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
    fontSize: isMobile ? '16px' : '14px', // 16px en móvil evita zoom en iOS
    outline: 'none',
    transition: 'all 0.3s ease',
    backgroundColor: 'white'
  };

  const inputFocusStyle = {
    borderColor: '#3498db',
    boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.1)'
  };

  const errorStyle = {
    color: '#e74c3c',
    fontSize: '12px',
    marginTop: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  };

  const buttonContainerStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: '15px',
    justifyContent: 'center',
    marginTop: '30px'
  };

  const buttonStyle = {
    padding: isMobile ? '14px 20px' : '12px 30px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: 'none',
    minWidth: isMobile ? '100%' : '150px'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: isEdit ? '#f39c12' : '#27ae60',
    color: 'white'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#95a5a6',
    color: 'white'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>
          {isEdit ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={formGridStyle}>
            {/* Código */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                🏷️ Código del Producto
              </label>
              <input
                type="text"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  borderColor: errors.codigo ? '#e74c3c' : '#ecf0f1'
                }}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => e.target.style.borderColor = errors.codigo ? '#e74c3c' : '#ecf0f1'}
                placeholder="Ej: MED001"
              />
              {errors.codigo && (
                <span style={errorStyle}>
                  ⚠️ {errors.codigo}
                </span>
              )}
            </div>

            {/* Nombre */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                💊 Nombre del Producto
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  borderColor: errors.nombre ? '#e74c3c' : '#ecf0f1'
                }}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => e.target.style.borderColor = errors.nombre ? '#e74c3c' : '#ecf0f1'}
                placeholder="Ej: Paracetamol 500mg"
              />
              {errors.nombre && (
                <span style={errorStyle}>
                  ⚠️ {errors.nombre}
                </span>
              )}
            </div>

            {/* Categoría */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                📂 Categoría
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  borderColor: errors.categoria ? '#e74c3c' : '#ecf0f1',
                  cursor: 'pointer'
                }}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => e.target.style.borderColor = errors.categoria ? '#e74c3c' : '#ecf0f1'}
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.categoria && (
                <span style={errorStyle}>
                  ⚠️ {errors.categoria}
                </span>
              )}
            </div>

            {/* Presentación */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                📦 Presentación
              </label>
              <select
                name="presentacion"
                value={formData.presentacion}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  borderColor: errors.presentacion ? '#e74c3c' : '#ecf0f1',
                  cursor: 'pointer'
                }}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => e.target.style.borderColor = errors.presentacion ? '#e74c3c' : '#ecf0f1'}
              >
                <option value="">Seleccionar presentación</option>
                {presentaciones.map(pres => (
                  <option key={pres} value={pres}>{pres}</option>
                ))}
              </select>
              {errors.presentacion && (
                <span style={errorStyle}>
                  ⚠️ {errors.presentacion}
                </span>
              )}
            </div>

            {/* Precio */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                💰 Precio (S/.)
              </label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                step="0.01"
                min="0"
                style={{
                  ...inputStyle,
                  borderColor: errors.precio ? '#e74c3c' : '#ecf0f1'
                }}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => e.target.style.borderColor = errors.precio ? '#e74c3c' : '#ecf0f1'}
                placeholder="0.00"
              />
              {errors.precio && (
                <span style={errorStyle}>
                  ⚠️ {errors.precio}
                </span>
              )}
            </div>

            {/* Stock */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                📊 Stock
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                style={{
                  ...inputStyle,
                  borderColor: errors.stock ? '#e74c3c' : '#ecf0f1'
                }}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => e.target.style.borderColor = errors.stock ? '#e74c3c' : '#ecf0f1'}
                placeholder="0"
              />
              {errors.stock && (
                <span style={errorStyle}>
                  ⚠️ {errors.stock}
                </span>
              )}
            </div>

            {/* Fecha de Vencimiento */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                📅 Fecha de Vencimiento
              </label>
              <input
                type="date"
                name="fechaVencimiento"
                value={formData.fechaVencimiento}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  borderColor: errors.fechaVencimiento ? '#e74c3c' : '#ecf0f1'
                }}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => e.target.style.borderColor = errors.fechaVencimiento ? '#e74c3c' : '#ecf0f1'}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.fechaVencimiento && (
                <span style={errorStyle}>
                  ⚠️ {errors.fechaVencimiento}
                </span>
              )}
            </div>

            {/* Laboratorio */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                🏭 Laboratorio
              </label>
              <input
                type="text"
                name="laboratorio"
                value={formData.laboratorio}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  borderColor: errors.laboratorio ? '#e74c3c' : '#ecf0f1'
                }}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => e.target.style.borderColor = errors.laboratorio ? '#e74c3c' : '#ecf0f1'}
                placeholder="Ej: Bayer, Pfizer, etc."
              />
              {errors.laboratorio && (
                <span style={errorStyle}>
                  ⚠️ {errors.laboratorio}
                </span>
              )}
            </div>
          </div>

          {/* Descripción - Campo completo */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              📝 Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={isMobile ? 3 : 4}
              style={{
                ...inputStyle,
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => e.target.style.borderColor = '#ecf0f1'}
              placeholder="Descripción detallada del producto, indicaciones, contraindicaciones, etc."
            />
          </div>

          {/* Botones */}
          <div style={buttonContainerStyle}>
            <button
              type="submit"
              style={primaryButtonStyle}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isEdit ? '#e67e22' : '#229954';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = isEdit ? '#f39c12' : '#27ae60';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {isEdit ? '💾 Actualizar Producto' : '➕ Crear Producto'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              style={secondaryButtonStyle}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#7f8c8d';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#95a5a6';
                e.target.style.transform = 'translateY(0)';
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