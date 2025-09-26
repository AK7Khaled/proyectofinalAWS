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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const productData = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock)
      };

      if (isEdit) {
        productData.id = product.id;
      }

      onSubmit(productData);
    }
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

  return (
    <div>
      <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>
        {isEdit ? '✏️ Editar Producto' : '➕ Agregar Nuevo Producto'}
      </h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: '800px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {/* Código */}
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>
              Código/SKU *
            </label>
            <input
              type="text"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              style={{
                ...inputStyle,
                borderColor: errors.codigo ? '#e74c3c' : '#ddd'
              }}
              placeholder="Ej: MED001"
            />
            {errors.codigo && <span style={errorStyle}>{errors.codigo}</span>}
          </div>

          {/* Nombre */}
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>
              Nombre del Producto *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              style={{
                ...inputStyle,
                borderColor: errors.nombre ? '#e74c3c' : '#ddd'
              }}
              placeholder="Ej: Paracetamol 500mg"
            />
            {errors.nombre && <span style={errorStyle}>{errors.nombre}</span>}
          </div>

          {/* Categoría */}
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>
              Categoría *
            </label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              style={{
                ...inputStyle,
                borderColor: errors.categoria ? '#e74c3c' : '#ddd'
              }}
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.categoria && <span style={errorStyle}>{errors.categoria}</span>}
          </div>

          {/* Precio */}
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>
              Precio (S/.) *
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
                borderColor: errors.precio ? '#e74c3c' : '#ddd'
              }}
              placeholder="Ej: 15.50"
            />
            {errors.precio && <span style={errorStyle}>{errors.precio}</span>}
          </div>

          {/* Stock */}
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>
              Stock Inicial *
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              style={{
                ...inputStyle,
                borderColor: errors.stock ? '#e74c3c' : '#ddd'
              }}
              placeholder="Ej: 100"
            />
            {errors.stock && <span style={errorStyle}>{errors.stock}</span>}
          </div>

          {/* Fecha de Vencimiento */}
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>
              Fecha de Vencimiento *
            </label>
            <input
              type="date"
              name="fechaVencimiento"
              value={formData.fechaVencimiento}
              onChange={handleChange}
              style={{
                ...inputStyle,
                borderColor: errors.fechaVencimiento ? '#e74c3c' : '#ddd'
              }}
            />
            {errors.fechaVencimiento && <span style={errorStyle}>{errors.fechaVencimiento}</span>}
          </div>

          {/* Laboratorio */}
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>
              Laboratorio *
            </label>
            <input
              type="text"
              name="laboratorio"
              value={formData.laboratorio}
              onChange={handleChange}
              style={{
                ...inputStyle,
                borderColor: errors.laboratorio ? '#e74c3c' : '#ddd'
              }}
              placeholder="Ej: Laboratorios ABC"
            />
            {errors.laboratorio && <span style={errorStyle}>{errors.laboratorio}</span>}
          </div>

          {/* Presentación */}
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>
              Presentación *
            </label>
            <select
              name="presentacion"
              value={formData.presentacion}
              onChange={handleChange}
              style={{
                ...inputStyle,
                borderColor: errors.presentacion ? '#e74c3c' : '#ddd'
              }}
            >
              <option value="">Selecciona una presentación</option>
              {presentaciones.map(pres => (
                <option key={pres} value={pres}>{pres}</option>
              ))}
            </select>
            {errors.presentacion && <span style={errorStyle}>{errors.presentacion}</span>}
          </div>
        </div>

        {/* Descripción */}
        <div style={{ ...fieldContainerStyle, marginTop: '20px' }}>
          <label style={labelStyle}>
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="3"
            style={{
              ...inputStyle,
              resize: 'vertical',
              fontFamily: 'Arial, sans-serif'
            }}
            placeholder="Descripción detallada del producto..."
          />
        </div>

        {/* Botones */}
        <div style={{ 
          marginTop: '30px',
          display: 'flex',
          gap: '15px',
          justifyContent: 'flex-end'
        }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '12px 24px',
              backgroundColor: '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              backgroundColor: isEdit ? '#3498db' : '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {isEdit ? 'Actualizar Producto' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}

const fieldContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px'
};

const labelStyle = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#2c3e50'
};

const inputStyle = {
  padding: '12px',
  border: '2px solid #ddd',
  borderRadius: '6px',
  fontSize: '14px',
  fontFamily: 'Arial, sans-serif'
};

const errorStyle = {
  color: '#e74c3c',
  fontSize: '12px',
  marginTop: '2px'
};