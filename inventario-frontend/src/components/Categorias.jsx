import { useEffect, useState } from 'react'
import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from '../services/categoriasService'

function Categorias() {
  const [categorias, setCategorias] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [categoriaEditar, setCategoriaEditar] = useState(null)

  const [categoriaEliminar, setCategoriaEliminar] = useState(null)
  const [eliminando, setEliminando] = useState(false)
  const [errorEliminar, setErrorEliminar] = useState('')

  useEffect(() => {
    cargarCategorias()
  }, [])

  async function cargarCategorias() {
    try {
      setLoading(true)
      setError('')

      const data = await obtenerCategorias()

      setCategorias(data || [])
    } catch (error) {
      console.error(error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  function nuevaCategoria() {
    setCategoriaEditar(null)
    setMostrarFormulario(true)
  }

  function editarCategoria(categoria) {
    setCategoriaEditar(categoria)
    setMostrarFormulario(true)
  }

  function cerrarFormulario() {
    setCategoriaEditar(null)
    setMostrarFormulario(false)
  }

  async function categoriaGuardada() {
    setCategoriaEditar(null)
    setMostrarFormulario(false)

    await cargarCategorias()
  }

  function confirmarEliminarCategoria(categoria) {
    setCategoriaEliminar(categoria)
    setErrorEliminar('')
  }

  function cancelarEliminarCategoria() {
    if (eliminando) {
      return
    }

    setCategoriaEliminar(null)
    setErrorEliminar('')
  }

  async function ejecutarEliminarCategoria() {
    if (!categoriaEliminar) {
      return
    }

    try {
      setEliminando(true)
      setErrorEliminar('')

      await eliminarCategoria(categoriaEliminar.id)

      setCategoriaEliminar(null)

      await cargarCategorias()
    } catch (error) {
      console.error(error)
      setErrorEliminar(error.message)
    } finally {
      setEliminando(false)
    }
  }

  if (loading) {
    return (
      <section className="categorias-section">
        <div className="categorias-state-panel">
          <p className="eyebrow">CATEGORÍAS</p>

          <h4>Cargando categorías...</h4>

          <p>
            Obteniendo información de la API.
          </p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="categorias-section">
        <div className="categorias-state-panel">
          <p className="eyebrow">ERROR</p>

          <h4>
            No se pudieron cargar las categorías
          </h4>

          <p>{error}</p>

          <button
            type="button"
            className="categorias-primary-button"
            onClick={cargarCategorias}
          >
            Reintentar
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="categorias-section">

      <div className="categorias-toolbar">

        <div>
          <h3>
            Gestión de categorías
          </h3>

          <p className="categorias-description">
            Administra las categorías utilizadas para
            organizar tus productos.
          </p>
        </div>

        <button
          type="button"
          className="categorias-primary-button"
          onClick={nuevaCategoria}
        >
          <span className="categorias-button-icon">
            +
          </span>

          <span>
            Nueva categoría
          </span>
        </button>

      </div>

      <div className="categorias-table-panel">

        <div className="categorias-table-header">

          <div>
            <p className="eyebrow">
              REGISTROS
            </p>

            <h4>
              Categorías registradas
            </h4>
          </div>

          <span className="categorias-result-info">
            {categorias.length}{' '}
            {categorias.length === 1
              ? 'categoría'
              : 'categorías'}
          </span>

        </div>


        <div className="categorias-table-container">

          {categorias.length === 0 ? (
            <div className="categorias-empty">

              <div className="categorias-empty-icon">

                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3.4 13.4a2 2 0 0 1 0-2.8V5a2 2 0 0 1 2-2h5.6a2 2 0 0 1 1.4.6l8.2 8.2a2 2 0 0 1 0 2.8Z" />
                  <circle
                    cx="7.5"
                    cy="7.5"
                    r="1.5"
                  />
                </svg>

              </div>

              <strong>
                No hay categorías registradas
              </strong>

              <span>
                Crea tu primera categoría para comenzar
                a organizar los productos.
              </span>

              <button
                type="button"
                className="categorias-primary-button"
                onClick={nuevaCategoria}
              >
                <span className="categorias-button-icon">
                  +
                </span>

                <span>
                  Nueva categoría
                </span>
              </button>

            </div>
          ) : (
            <table>

              <thead>
                <tr>
                  <th>
                    Categoría
                  </th>

                  <th>
                    Descripción
                  </th>

                  <th>
                    Estado
                  </th>

                  <th>
                    Fecha de creación
                  </th>

                  <th>
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>

                {categorias.map((categoria) => (
                  <tr key={categoria.id}>

                    <td>
                      <div className="categoria-name-cell">

                        <div className="categoria-avatar">
                          {categoria.nombre
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="categoria-name-content">

                          <strong>
                            {categoria.nombre}
                          </strong>

                          <span className="categoria-id">
                            ID #{categoria.id}
                          </span>

                        </div>

                      </div>
                    </td>

                    <td>
                      <span className="categoria-description">
                        {categoria.descripcion ||
                          'Sin descripción'}
                      </span>
                    </td>

                    <td>

                      {categoria.activa ? (
                        <span className="categoria-status-active">

                          <span className="categoria-status-dot"></span>

                          Activa

                        </span>
                      ) : (
                        <span className="categoria-status-inactive">

                          <span className="categoria-status-dot"></span>

                          Inactiva

                        </span>
                      )}

                    </td>

                    <td>
                      <span className="categoria-date">
                        {new Date(
                          categoria.fechaCreacion
                        ).toLocaleDateString('es-MX')}
                      </span>
                    </td>


                    {/* =====================================
                        ACCIONES
                        ===================================== */}

                    <td>

                      <div className="categoria-actions">

                        {/* EDITAR */}

                        <button
                          type="button"
                          className="categoria-edit-button"
                          onClick={() =>
                            editarCategoria(categoria)
                          }
                          title="Editar categoría"
                          aria-label={`Editar ${categoria.nombre}`}
                        >
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.9"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                          </svg>

                          <span>
                            Editar
                          </span>
                        </button>


                        {/* ELIMINAR */}

                        <button
                          type="button"
                          className="categoria-delete-button"
                          onClick={() =>
                            confirmarEliminarCategoria(
                              categoria
                            )
                          }
                          title="Eliminar categoría"
                          aria-label={`Eliminar ${categoria.nombre}`}
                        >
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.9"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M4 7h16" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                            <path d="M6 7l1 13h10l1-13" />
                            <path d="M9 7V4h6v3" />
                          </svg>

                          <span>
                            Eliminar
                          </span>
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>
          )}

        </div>

      </div>

      {mostrarFormulario && (
        <CategoriaForm
          categoria={categoriaEditar}
          onSuccess={categoriaGuardada}
          onCancel={cerrarFormulario}
        />
      )}

      {categoriaEliminar && (
        <div
          className="categorias-delete-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !eliminando
            ) {
              cancelarEliminarCategoria()
            }
          }}
        >

          <div
            className="categorias-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-category-modal-title"
          >

            <div className="categorias-delete-modal-icon">

              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
                <path d="M10.3 3.8 2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
              </svg>

            </div>


            <div className="categorias-delete-modal-content">

              <p className="eyebrow">
                ELIMINAR CATEGORÍA
              </p>

              <h3 id="delete-category-modal-title">
                ¿Eliminar categoría?
              </h3>

              <p>
                Estás a punto de eliminar{' '}
                <strong>
                  {categoriaEliminar.nombre}
                </strong>
                .
              </p>

              <span className="categorias-delete-modal-warning">
                Si la categoría tiene productos asociados,
                la API impedirá su eliminación.
              </span>


              {errorEliminar && (
                <div className="categorias-form-error">

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

                  <span>
                    {errorEliminar}
                  </span>

                </div>
              )}

            </div>


            <div className="categorias-delete-modal-actions">

              <button
                type="button"
                className="categorias-secondary-button"
                onClick={cancelarEliminarCategoria}
                disabled={eliminando}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="categorias-delete-confirm-button"
                onClick={ejecutarEliminarCategoria}
                disabled={eliminando}
              >

                {eliminando ? (
                  <>
                    <span className="categorias-button-spinner"></span>

                    Eliminando...
                  </>
                ) : (
                  <>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M4 7h16" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M6 7l1 13h10l-1-13" />
                      <path d="M9 7V4h6v3" />
                    </svg>

                    <span>
                      Eliminar categoría
                    </span>
                  </>
                )}

              </button>

            </div>

          </div>

        </div>
      )}

    </section>
  )
}

function CategoriaForm({
  categoria,
  onSuccess,
  onCancel,
}) {
  const [formulario, setFormulario] = useState({
    nombre: '',
    descripcion: '',
    activa: true,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const modoEdicion = Boolean(categoria)

  useEffect(() => {
    if (categoria) {
      setFormulario({
        nombre: categoria.nombre || '',
        descripcion: categoria.descripcion || '',
        activa: categoria.activa ?? true,
      })
    } else {
      setFormulario({
        nombre: '',
        descripcion: '',
        activa: true,
      })
    }

    setError('')
  }, [categoria])

  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target

    setFormulario((actual) => ({
      ...actual,
      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!formulario.nombre.trim()) {
      setError(
        'El nombre de la categoría es obligatorio.'
      )

      return
    }

    try {
      setLoading(true)
      setError('')

      const categoriaData = {
        nombre: formulario.nombre.trim(),

        descripcion:
          formulario.descripcion.trim() || null,

        activa: formulario.activa,
      }

      if (modoEdicion) {
        await actualizarCategoria(
          categoria.id,
          categoriaData
        )
      } else {
        await crearCategoria(categoriaData)
      }

      await onSuccess()
    } catch (error) {
      console.error(error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  function handleOverlayClick(event) {
    if (
      event.target === event.currentTarget &&
      !loading
    ) {
      onCancel()
    }
  }

  return (
    <div
      className="categorias-modal-overlay"
      onMouseDown={handleOverlayClick}
    >

      <div
        className="categorias-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-modal-title"
      >

        <div className="categorias-modal-header">

          <div>

            <p className="eyebrow">
              {modoEdicion
                ? 'EDICIÓN'
                : 'NUEVO REGISTRO'}
            </p>

            <h3 id="category-modal-title">
              {modoEdicion
                ? 'Editar categoría'
                : 'Nueva categoría'}
            </h3>

            <p className="categorias-modal-description">
              {modoEdicion
                ? 'Actualiza la información de la categoría.'
                : 'Registra una nueva categoría para organizar el inventario.'}
            </p>

          </div>


          <button
            type="button"
            className="categorias-modal-close"
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

        {error && (
          <div className="categorias-form-error">

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

            <span>
              {error}
            </span>

          </div>
        )}

        <form
          className="categorias-form"
          onSubmit={handleSubmit}
        >

          <div className="categorias-form-group">

            <label htmlFor="categoria-nombre">
              Nombre *
            </label>

            <input
              id="categoria-nombre"
              name="nombre"
              type="text"
              value={formulario.nombre}
              onChange={handleChange}
              placeholder="Nombre de la categoría"
              required
              autoFocus
              disabled={loading}
            />

          </div>


          <div className="categorias-form-group">

            <label htmlFor="categoria-descripcion">
              Descripción
            </label>

            <textarea
              id="categoria-descripcion"
              name="descripcion"
              value={formulario.descripcion}
              onChange={handleChange}
              placeholder="Descripción de la categoría"
              rows="4"
              disabled={loading}
            />

          </div>


          <label className="categorias-checkbox">

            <input
              name="activa"
              type="checkbox"
              checked={formulario.activa}
              onChange={handleChange}
              disabled={loading}
            />

            <span>
              Categoría activa
            </span>

          </label>

          <div className="categorias-form-actions">

            <button
              type="button"
              className="categorias-secondary-button"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="categorias-primary-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="categorias-button-spinner"></span>

                  Guardando...
                </>
              ) : (
                modoEdicion
                  ? 'Guardar cambios'
                  : 'Crear categoría'
              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

export default Categorias