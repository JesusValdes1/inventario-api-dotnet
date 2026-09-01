import { useEffect, useState } from 'react'
import {
  crearProducto,
  actualizarProducto,
} from '../services/productosService'
import { obtenerCategorias } from '../services/categoriasService'

function ProductoForm({ producto, onSuccess, onCancel }) {
  const [formulario, setFormulario] = useState({
    nombre: '',
    descripcion: '',
    sku: '',
    precio: '',
    stock: '',
    stockMinimo: '',
    activo: true,
    categoriaId: '',
  })

  const [categorias, setCategorias] = useState([])
  const [cargandoCategorias, setCargandoCategorias] = useState(true)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const modoEdicion = Boolean(producto)

  useEffect(() => {
    cargarCategorias()
  }, [])

  useEffect(() => {
    if (producto) {
      setFormulario({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        sku: producto.sku || '',
        precio: producto.precio ?? '',
        stock: producto.stock ?? '',
        stockMinimo: producto.stockMinimo ?? '',
        activo: producto.activo ?? true,
        categoriaId: producto.categoriaId ?? '',
      })
    } else {
      setFormulario({
        nombre: '',
        descripcion: '',
        sku: '',
        precio: '',
        stock: '',
        stockMinimo: '',
        activo: true,
        categoriaId: '',
      })
    }

    setError('')
  }, [producto])

  async function cargarCategorias() {
    try {
      setCargandoCategorias(true)

      const data = await obtenerCategorias()

      setCategorias(data || [])
    } catch (error) {
      console.error(error)
      setError(
        error.message || 'No se pudieron cargar las categorías.'
      )
    } finally {
      setCargandoCategorias(false)
    }
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    setFormulario((actual) => ({
      ...actual,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setLoading(true)
      setError('')

      const productoData = {
        nombre: formulario.nombre.trim(),
        descripcion: formulario.descripcion.trim(),
        sku: formulario.sku.trim(),
        precio: Number(formulario.precio),
        stock: Number(formulario.stock),
        stockMinimo: Number(formulario.stockMinimo),
        activo: formulario.activo,
        categoriaId: Number(formulario.categoriaId),
      }

      if (modoEdicion) {
        await actualizarProducto(producto.id, productoData)
      } else {
        await crearProducto(productoData)
      }

      onSuccess()
    } catch (error) {
      console.error(error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  function handleOverlayClick(event) {
    if (event.target === event.currentTarget && !loading) {
      onCancel()
    }
  }

  return (
    <div
      className="product-modal-overlay"
      onMouseDown={handleOverlayClick}
    >
      <div
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
      >
        {/* =================================================
            MODAL HEADER
        ================================================= */}

        <div className="product-modal-header">
          <div>
            <p className="eyebrow">
              {modoEdicion
                ? 'EDICIÓN'
                : 'NUEVO REGISTRO'}
            </p>

            <h3 id="product-modal-title">
              {modoEdicion
                ? 'Editar producto'
                : 'Nuevo producto'}
            </h3>

            <p className="product-modal-description">
              {modoEdicion
                ? 'Actualiza la información del producto.'
                : 'Registra un nuevo producto en el inventario.'}
            </p>
          </div>

          <button
            type="button"
            className="modal-close-button"
            onClick={onCancel}
            disabled={loading}
            aria-label="Cerrar"
            title="Cerrar"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12" />
              <path d="M18 6 6 18" />
            </svg>
          </button>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="form-error">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M10.3 3.8 2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>

            <span>{error}</span>
          </div>
        )}

        {/* =================================================
            FORM
        ================================================= */}

        <form
          className="product-form"
          onSubmit={handleSubmit}
        >
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">
                Nombre *
              </label>

              <input
                id="nombre"
                name="nombre"
                type="text"
                value={formulario.nombre}
                onChange={handleChange}
                placeholder="Nombre del producto"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="sku">
                SKU *
              </label>

              <input
                id="sku"
                name="sku"
                type="text"
                value={formulario.sku}
                onChange={handleChange}
                placeholder="Ej. LAP-001"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">
              Descripción
            </label>

            <textarea
              id="descripcion"
              name="descripcion"
              value={formulario.descripcion}
              onChange={handleChange}
              placeholder="Descripción del producto"
              rows="3"
            />
          </div>

          <div className="form-row form-row-three">
            <div className="form-group">
              <label htmlFor="precio">
                Precio *
              </label>

              <input
                id="precio"
                name="precio"
                type="number"
                min="0"
                step="0.01"
                value={formulario.precio}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock">
                Stock *
              </label>

              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formulario.stock}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="stockMinimo">
                Stock mínimo *
              </label>

              <input
                id="stockMinimo"
                name="stockMinimo"
                type="number"
                min="0"
                value={formulario.stockMinimo}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>
          </div>

          {/* =================================================
              CATEGORÍA
          ================================================= */}

          <div className="form-group">
            <label htmlFor="categoriaId">
              Categoría *
            </label>

            <select
              id="categoriaId"
              name="categoriaId"
              value={formulario.categoriaId}
              onChange={handleChange}
              required
              disabled={cargandoCategorias || loading}
            >
              <option value="">
                {cargandoCategorias
                  ? 'Cargando categorías...'
                  : 'Selecciona una categoría'}
              </option>

              {categorias
                .filter((categoria) => categoria.activa)
                .map((categoria) => (
                  <option
                    key={categoria.id}
                    value={categoria.id}
                  >
                    {categoria.nombre}
                  </option>
                ))}
            </select>

            {!cargandoCategorias &&
              categorias.filter(
                (categoria) => categoria.activa
              ).length === 0 && (
                <span className="form-help">
                  No hay categorías activas disponibles.
                </span>
              )}
          </div>

          {/* =================================================
              ESTADO
          ================================================= */}

          <label className="checkbox-group">
            <input
              name="activo"
              type="checkbox"
              checked={formulario.activo}
              onChange={handleChange}
            />

            <span>
              Producto activo
            </span>
          </label>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={
                loading ||
                cargandoCategorias ||
                categorias.filter(
                  (categoria) => categoria.activa
                ).length === 0
              }
            >
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Guardando...
                </>
              ) : (
                modoEdicion
                  ? 'Guardar cambios'
                  : 'Crear producto'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductoForm