import { useEffect, useState } from 'react'
import {
  obtenerProductos,
  eliminarProducto,
} from '../services/productosService'
import { obtenerCategorias } from '../services/categoriasService'
import ProductoForm from './ProductoForm'

function Productos() {
    const [productos, setProductos] = useState([])

    const [nombre, setNombre] = useState('')
    const [sku, setSku] = useState('')
    const [activo, setActivo] = useState('')
    const [categoriaId, setCategoriaId] = useState('')
    const [categorias, setCategorias] = useState([])

    const [page, setPage] = useState(1)
    const [pageSize] = useState(10)

    const [totalItems, setTotalItems] = useState(0)
    const [totalPages, setTotalPages] = useState(1)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [productoEditar, setProductoEditar] = useState(null)
    const [productoEliminar, setProductoEliminar] = useState(null)
    const [eliminando, setEliminando] = useState(false)
    const [errorEliminar, setErrorEliminar] = useState('')

    useEffect(() => {
        cargarCategorias()
    }, [])

    useEffect(() => {
        cargarProductos()
    }, [page])

    async function cargarCategorias() {
        try {
            const data = await obtenerCategorias()

            setCategorias(data || [])
        } catch (error) {
            console.error(error)
        }
    }

    async function cargarProductos() {
        try {
        setLoading(true)
        setError('')

        const params = new URLSearchParams()

        if (nombre.trim()) {
            params.append('nombre', nombre.trim())
        }

        if (sku.trim()) {
            params.append('sku', sku.trim())
        }

        if (activo !== '') {
            params.append('activo', activo)
        }

        if (categoriaId !== '') {
            params.append('categoriaId', categoriaId)
        }

        params.append('page', page)
        params.append('pageSize', pageSize)
        params.append('sortBy', 'nombre')
        params.append('sortOrder', 'asc')

        const data = await obtenerProductos(
            `?${params.toString()}`
        )

        setProductos(data.items || [])
        setTotalItems(data.totalItems || 0)
        setTotalPages(data.totalPages || 1)
        } catch (error) {
        console.error(error)
        setError(error.message)
        } finally {
        setLoading(false)
        }
    }

    function buscarProductos(event) {
        event.preventDefault()

        if (page === 1) {
        cargarProductos()
        } else {
        setPage(1)
        }
    }

    function limpiarFiltros() {
        setNombre('')
        setSku('')
        setActivo('')
        setCategoriaId('')

        if (page === 1) {
        cargarProductos()
        } else {
        setPage(1)
        }
    }

    function cambiarPagina(nuevaPagina) {
        if (
        nuevaPagina < 1 ||
        nuevaPagina > totalPages
        ) {
        return
        }

        setPage(nuevaPagina)
    }

    function formatearPrecio(precio) {
        return Number(precio).toLocaleString('es-MX', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        })
    }

    function nuevoProducto() {
        setProductoEditar(null)
        setMostrarFormulario(true)
    }

    function editarProducto(producto) {
        setProductoEditar(producto)
        setMostrarFormulario(true)
    }

    function cerrarFormulario() {
        if (loading) {
        return
        }

        setProductoEditar(null)
        setMostrarFormulario(false)
    }

    async function productoGuardado() {
        setProductoEditar(null)
        setMostrarFormulario(false)

        await cargarProductos()
    }

    function confirmarEliminarProducto(producto) {
        setProductoEliminar(producto)
        setErrorEliminar('')
    }

    function cancelarEliminarProducto() {
        if (eliminando) {
            return
        }

        setProductoEliminar(null)
        setErrorEliminar('')
    }

    async function ejecutarEliminarProducto() {
        if (!productoEliminar) {
            return
        }

        try {
            setEliminando(true)
            setErrorEliminar('')

            await eliminarProducto(productoEliminar.id)

            setProductoEliminar(null)

            await cargarProductos()
        } catch (error) {
            console.error(error)
            setErrorEliminar(error.message)
        } finally {
            setEliminando(false)
        }
    }

    if (loading) {
        return (
        <section className="productos-section">
            <div className="panel">
            <div className="panel-header">
                <div>
                <p className="eyebrow">
                    INVENTARIO
                </p>

                <h4>
                    Productos
                </h4>
                </div>
            </div>

            <p className="empty-state">
                Cargando productos...
            </p>
            </div>
        </section>
        )
    }

    if (error) {
        return (
        <section className="productos-section">
            <div className="panel">
            <div className="panel-header">
                <div>
                <p className="eyebrow">
                    ERROR
                </p>

                <h4>
                    No se pudieron cargar los productos
                </h4>
                </div>
            </div>

            <p className="empty-state">
                {error}
            </p>

            <div className="panel-header">
                <button
                type="button"
                className="text-button"
                onClick={cargarProductos}
                >
                Reintentar
                </button>
            </div>
            </div>
        </section>
        )
    }

    return (
        <section className="productos-section">

        <div className="section-toolbar">

            <div>
            <h3>
                Productos
            </h3>

            <p className="section-description">
                Administra los productos registrados
                en el inventario.
            </p>
            </div>

            <button
            type="button"
            className="primary-button"
            onClick={nuevoProducto}
            >
            <span className="button-icon">
                +
            </span>

            <span>
                Nuevo producto
            </span>
            </button>

        </div>

        <div className="panel products-filters-panel">

            <div className="products-filters-header">
            <div>
                <p className="eyebrow">
                BÚSQUEDA
                </p>

                <h4>
                Filtrar productos
                </h4>
            </div>
            </div>

            <form
            className="products-filters"
            onSubmit={buscarProductos}
            >

            <div className="filter-group">

                <label htmlFor="nombre">
                Producto
                </label>

                <input
                id="nombre"
                type="text"
                placeholder="Buscar por nombre..."
                value={nombre}
                onChange={(event) =>
                    setNombre(event.target.value)
                }
                />

            </div>

            <div className="filter-group">

                <label htmlFor="sku">
                SKU
                </label>

                <input
                id="sku"
                type="text"
                placeholder="Buscar por SKU..."
                value={sku}
                onChange={(event) =>
                    setSku(event.target.value)
                }
                />

            </div>

            <div className="filter-group">

                <label htmlFor="activo">
                Estado
                </label>

                <select
                id="activo"
                value={activo}
                onChange={(event) =>
                    setActivo(event.target.value)
                }
                >
                <option value="">
                    Todos
                </option>

                <option value="true">
                    Activos
                </option>

                <option value="false">
                    Inactivos
                </option>
                </select>

            </div>

            <div className="filter-group">

                <label htmlFor="categoriaId">
                    Categoría
                </label>

                <select
                    id="categoriaId"
                    value={categoriaId}
                    onChange={(event) =>
                        setCategoriaId(event.target.value)
                    }
                >
                    <option value="">
                        Todas
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

            </div>

            <div className="filter-actions">

                <button
                type="submit"
                className="primary-button"
                >
                Buscar
                </button>

                <button
                type="button"
                className="secondary-button"
                onClick={limpiarFiltros}
                >
                Limpiar
                </button>

            </div>

            </form>

        </div>

        <div className="panel products-table-panel">

            <div className="products-table-header">

            <div>
                <p className="eyebrow">
                RESULTADOS
                </p>

                <h4>
                {totalItems}{' '}
                {totalItems === 1
                    ? 'producto'
                    : 'productos'}
                </h4>
            </div>

            <span className="products-result-info">
                Página {page} de {totalPages}
            </span>

            </div>

            <div className="table-container">

            {productos.length === 0 ? (

                <div className="products-empty">

                <div className="products-empty-icon">
                    <span>
                    📦
                    </span>
                </div>

                <strong>
                    No se encontraron productos
                </strong>

                <p>
                    No hay productos que coincidan
                    con los filtros seleccionados.
                </p>

                </div>

            ) : (

                <table>

                <thead>
                    <tr>
                    <th>Producto</th>
                    <th>SKU</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>

                    {productos.map((producto) => (

                    <tr key={producto.id}>

                        {/* Producto */}

                        <td>

                        <div className="product-name-cell">

                            <div className="product-avatar">
                            {producto.nombre
                                ?.charAt(0)
                                ?.toUpperCase()}
                            </div>

                            <div>
                            <strong>
                                {producto.nombre}
                            </strong>

                            {producto.descripcion && (
                                <span className="table-secondary">
                                {producto.descripcion}
                                </span>
                            )}
                            </div>

                        </div>

                        </td>

                        {/* SKU */}

                        <td>
                        <span className="sku-value">
                            {producto.sku}
                        </span>
                        </td>

                        {/* Categoría */}

                        <td>
                        {producto.categoriaNombre ||
                            'Sin categoría'}
                        </td>

                        {/* Precio */}

                        <td>
                        <span className="price-value">
                            ${formatearPrecio(
                            producto.precio
                            )}
                        </span>
                        </td>

                        {/* Stock */}

                        <td>
                        <div className="stock-cell">

                            <strong>
                            {producto.stock}
                            </strong>

                            <span>
                            mín. {producto.stockMinimo}
                            </span>

                        </div>
                        </td>

                        {/* Estado */}

                        <td>

                        <span
                            className={`badge ${
                            !producto.activo
                                ? 'danger'
                                : producto.stock <=
                                    producto.stockMinimo
                                ? 'warning'
                                : 'success'
                            }`}
                        >

                            <span className="badge-dot"></span>

                            {!producto.activo
                            ? 'Inactivo'
                            : producto.stock <=
                                producto.stockMinimo
                                ? 'Stock bajo'
                                : 'Activo'}

                        </span>

                        </td>

                        {/* Acciones */}

                        <td>
                            <div className="table-actions">

                                <button
                                    type="button"
                                    className="table-action"
                                    onClick={() => editarProducto(producto)}
                                    title="Editar producto"
                                    aria-label={`Editar ${producto.nombre}`}>
                                <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.9"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true">
                                    <path d="M12 20h9" />
                                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                                </svg>

                                <span>Editar</span>
                                </button>

                                <button
                                    type="button"
                                    className="table-delete-action"
                                    onClick={() => confirmarEliminarProducto(producto)}
                                    title="Eliminar producto"
                                    aria-label={`Eliminar ${producto.nombre}`}>
                                <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.9"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true">
                                    <path d="M4 7h16" />
                                    <path d="M10 11v6" />
                                    <path d="M14 11v6" />
                                    <path d="M6 7l1 13h10l1-13" />
                                    <path d="M9 7V4h6v3" />
                                </svg>

                                <span>Eliminar</span>
                                </button>

                            </div>
                        </td>

                    </tr>

                    ))}

                </tbody>

                </table>

            )}

            </div>

            {totalPages > 1 && (
            <div className="pagination">

                <button
                    type="button"
                    className="pagination-button"
                    onClick={() =>
                        cambiarPagina(page - 1)
                    }
                    disabled={page === 1}>
                    ← Anterior
                </button>

                <div className="pagination-info">
                    Página <strong>{page}</strong> de{' '}
                <strong>{totalPages}</strong>
                </div>

                <button
                    type="button"
                    className="pagination-button"
                    onClick={() =>
                        cambiarPagina(page + 1)
                    }
                    disabled={
                        page === totalPages
                    }>
                    Siguiente →
                </button>

            </div>
            )}

        </div>

        {mostrarFormulario && (
            <ProductoForm
                producto={productoEditar}
                onSuccess={productoGuardado}
                onCancel={cerrarFormulario}/>
        )}

        {productoEliminar && (
            <div
                className="delete-modal-overlay"
                onMouseDown={(event) => {
                if (
                    event.target === event.currentTarget &&
                    !eliminando
                ) {
                    cancelarEliminarProducto()
                }
                }}>
                <div
                    className="delete-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="delete-modal-title">

                    <div className="delete-modal-icon">
                        <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true">
                        <path d="M12 9v4" />
                        <path d="M12 17h.01" />
                        <path d="M10.3 3.8 2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
                        </svg>
                    </div>

                    <div className="delete-modal-content">

                        <p className="eyebrow">
                        ELIMINAR PRODUCTO
                        </p>

                        <h3 id="delete-modal-title">
                        ¿Eliminar producto?
                        </h3>

                        <p>
                        Estás a punto de eliminar{' '}
                        <strong>
                            {productoEliminar.nombre}
                        </strong>.
                        </p>

                        <span className="delete-modal-warning">
                        Esta acción no se puede deshacer.
                        </span>

                        {errorEliminar && (
                        <div className="form-error delete-modal-error">
                            <svg
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.9"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true">
                            <path d="M10.3 3.8 2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
                            <path d="M12 9v4" />
                            <path d="M12 17h.01" />
                            </svg>

                            <span>{errorEliminar}</span>
                        </div>
                        )}

                    </div>

                    <div className="delete-modal-actions">

                        <button
                        type="button"
                        className="secondary-button"
                        onClick={cancelarEliminarProducto}
                        disabled={eliminando}>
                        Cancelar
                        </button>

                        <button
                        type="button"
                        className="delete-confirm-button"
                        onClick={ejecutarEliminarProducto}
                        disabled={eliminando}>
                        {eliminando ? (
                            <>
                            <span className="button-spinner"></span>
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
                                aria-hidden="true">
                                <path d="M4 7h16" />
                                <path d="M10 11v6" />
                                <path d="M14 11v6" />
                                <path d="M6 7l1 13h10l1-13" />
                                <path d="M9 7V4h6v3" />
                            </svg>

                            <span>Eliminar producto</span>
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

export default Productos