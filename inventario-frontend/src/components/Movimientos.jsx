import { useEffect, useState } from 'react'
import {
    obtenerMovimientos,
    crearMovimiento,
} from '../services/movimientosService'
import { obtenerProductos } from '../services/productosService'

function Movimientos() {
    const [movimientos, setMovimientos] = useState([])
    const [productos, setProductos] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [cargandoProductos, setCargandoProductos] = useState(false)
    const [guardando, setGuardando] = useState(false)
    const [errorFormulario, setErrorFormulario] = useState('')

    const [formulario, setFormulario] = useState({
        productoId: '',
        tipo: 'Entrada',
        cantidad: '',
        motivo: '',
        observaciones: '',
    })

    useEffect(() => {
        cargarMovimientos()
    }, [])

    async function cargarMovimientos() {
        try {
            setLoading(true)
            setError('')

            const movimientosData = await obtenerMovimientos()

            setMovimientos(movimientosData || [])
        } catch (error) {
            console.error(error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    async function cargarProductos() {
        try {
            setCargandoProductos(true)
            setErrorFormulario('')

            const productosData = await obtenerProductos(
                '?page=1&pageSize=100&sortBy=nombre&sortOrder=asc'
            )

            //console.log('Respuesta de productos:', productosData)

            const productosLista = Array.isArray(productosData)
                ? productosData
                : productosData?.items || []

            //console.log('Productos cargados:', productosLista)

            setProductos(productosLista)
        } catch (error) {
            console.error('Error cargando productos:', error)

            setProductos([])

            setErrorFormulario(
                'No se pudieron cargar los productos.'
            )
        } finally {
            setCargandoProductos(false)
        }
    }

    async function abrirFormulario() {
        setFormulario({
            productoId: '',
            tipo: 'Entrada',
            cantidad: '',
            motivo: '',
            observaciones: '',
        })

        setErrorFormulario('')
        setMostrarFormulario(true)

        await cargarProductos()
    }

    function cerrarFormulario() {
        if (guardando) {
            return
        }

        setMostrarFormulario(false)
        setErrorFormulario('')
    }

    function handleChange(event) {
        const { name, value } = event.target

        setFormulario((actual) => ({
            ...actual,
            [name]: value,
        }))
    }

    async function handleSubmit(event) {
        event.preventDefault()

        try {
            setGuardando(true)
            setErrorFormulario('')

            const tiposMovimiento = {
                Entrada: 0,
                Salida: 1,
                Ajuste: 2,
            }

            const movimientoData = {
                productoId: Number(formulario.productoId),
                tipo: tiposMovimiento[formulario.tipo],
                cantidad: Number(formulario.cantidad),
                motivo: formulario.motivo.trim(),
                observaciones:
                    formulario.observaciones.trim() || null,
            }

            await crearMovimiento(movimientoData)

            setMostrarFormulario(false)

            await cargarMovimientos()

            // Actualizamos productos para que el stock mostrado
            // vuelva a reflejar el estado actual.
            await cargarProductos()
        } catch (error) {
            console.error(error)
            setErrorFormulario(error.message)
        } finally {
            setGuardando(false)
        }
    }

    function formatearFecha(fecha) {
        if (!fecha) {
            return '-'
        }

        return new Date(fecha).toLocaleString('es-MX', {
            dateStyle: 'short',
            timeStyle: 'short',
        })
    }

    function obtenerTipoMovimiento(tipo) {
        if (typeof tipo === 'number') {
            if (tipo === 0) {
                return 'Entrada'
            }

            if (tipo === 1) {
                return 'Salida'
            }

            if (tipo === 2) {
                return 'Ajuste'
            }
        }

        return tipo || 'Desconocido'
    }

    function obtenerClaseTipo(tipo) {
        const tipoNombre = obtenerTipoMovimiento(tipo)

        if (tipoNombre === 'Entrada') {
            return 'movimientos-type-entry'
        }

        if (tipoNombre === 'Salida') {
            return 'movimientos-type-exit'
        }

        if (tipoNombre === 'Ajuste') {
            return 'movimientos-type-adjustment'
        }

        return 'movimientos-type-unknown'
    }

    function obtenerSimboloCantidad(tipo) {
        const tipoNombre = obtenerTipoMovimiento(tipo)

        if (tipoNombre === 'Entrada') {
            return '+'
        }

        if (tipoNombre === 'Salida') {
            return '-'
        }

        return ''
    }

    function obtenerProductoSeleccionado() {
        return productos.find(
            (producto) =>
                Number(producto.id) ===
                Number(formulario.productoId)
        )
    }

    if (loading) {
        return (
            <section className="movimientos-section">
                <div className="movimientos-state-panel">
                    <div className="movimientos-state-header">
                        <div>
                            <p className="movimientos-eyebrow">
                                INVENTARIO
                            </p>

                            <h3>
                                Movimientos
                            </h3>
                        </div>
                    </div>

                    <p className="movimientos-empty-text">
                        Cargando movimientos...
                    </p>
                </div>
            </section>
        )
    }

    if (error) {
        return (
            <section className="movimientos-section">
                <div className="movimientos-state-panel">
                    <div className="movimientos-state-header">
                        <div>
                            <p className="movimientos-eyebrow">
                                ERROR
                            </p>

                            <h3>
                                No se pudieron cargar los movimientos
                            </h3>
                        </div>
                    </div>

                    <p className="movimientos-empty-text">
                        {error}
                    </p>

                    <div className="movimientos-state-actions">
                        <button
                            type="button"
                            className="movimientos-secondary-button"
                            onClick={cargarMovimientos}
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="movimientos-section">

            <div className="movimientos-toolbar">

                <div>
                    <h3>
                        Movimientos
                    </h3>

                    <p className="movimientos-description">
                        Registra y consulta las entradas,
                        salidas y ajustes del inventario.
                    </p>
                </div>

                <button
                    type="button"
                    className="movimientos-primary-button"
                    onClick={abrirFormulario}
                >
                    <span className="movimientos-button-icon">
                        +
                    </span>

                    <span>
                        Nuevo movimiento
                    </span>
                </button>

            </div>

            <div className="movimientos-table-panel">

                <div className="movimientos-table-header">

                    <div>
                        <p className="movimientos-eyebrow">
                            HISTORIAL
                        </p>

                        <h4>
                            {movimientos.length}{' '}
                            {movimientos.length === 1
                                ? 'movimiento'
                                : 'movimientos'}
                        </h4>
                    </div>

                    <span className="movimientos-result-info">
                        Ordenados por fecha
                    </span>

                </div>

                <div className="movimientos-table-container">

                    {movimientos.length === 0 ? (

                        <div className="movimientos-empty">

                            <div className="movimientos-empty-icon">
                                <svg
                                    width="28"
                                    height="28"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M12 3v18" />
                                    <path d="M3 12h18" />
                                    <path d="m7 7 5-4 5 4" />
                                    <path d="m7 17 5 4 5-4" />
                                </svg>
                            </div>

                            <strong>
                                No hay movimientos registrados
                            </strong>

                            <p>
                                Los movimientos que registres
                                aparecerán aquí.
                            </p>

                        </div>

                    ) : (

                        <table>

                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Producto</th>
                                    <th>SKU</th>
                                    <th>Tipo</th>
                                    <th>Cantidad</th>
                                    <th>Motivo</th>
                                    <th>Observaciones</th>
                                </tr>
                            </thead>

                            <tbody>

                                {movimientos.map((movimiento) => (

                                    <tr key={movimiento.id}>

                                        <td>
                                            <span className="movimientos-date">
                                                {formatearFecha(
                                                    movimiento.fecha
                                                )}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="movimientos-product-cell">

                                                <div className="movimientos-product-avatar">
                                                    {movimiento.productoNombre
                                                        ?.charAt(0)
                                                        ?.toUpperCase()}
                                                </div>

                                                <div>
                                                    <strong>
                                                        {movimiento.productoNombre}
                                                    </strong>
                                                </div>

                                            </div>
                                        </td>

                                        <td>
                                            <span className="movimientos-sku">
                                                {movimiento.sku}
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                className={`movimientos-type ${obtenerClaseTipo(
                                                    movimiento.tipo
                                                )}`}
                                            >
                                                <span className="movimientos-type-dot"></span>

                                                {obtenerTipoMovimiento(
                                                    movimiento.tipo
                                                )}
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                className={`movimientos-quantity ${obtenerClaseTipo(
                                                    movimiento.tipo
                                                )}`}
                                            >
                                                {obtenerSimboloCantidad(
                                                    movimiento.tipo
                                                )}

                                                {movimiento.cantidad}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="movimientos-reason">
                                                {movimiento.motivo}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="movimientos-observations">
                                                {movimiento.observaciones ||
                                                    '—'}
                                            </span>
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    )}

                </div>

            </div>

            {mostrarFormulario && (
                <div
                    className="movimientos-modal-overlay"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            !guardando
                        ) {
                            cerrarFormulario()
                        }
                    }}
                >

                    <div
                        className="movimientos-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="movimientos-modal-title"
                    >

                        <div className="movimientos-modal-header">

                            <div>
                                <p className="movimientos-eyebrow">
                                    NUEVO REGISTRO
                                </p>

                                <h3 id="movimientos-modal-title">
                                    Nuevo movimiento
                                </h3>

                                <p className="movimientos-modal-description">
                                    Registra una entrada, salida o ajuste
                                    de inventario.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="movimientos-modal-close"
                                onClick={cerrarFormulario}
                                disabled={guardando}
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

                        {errorFormulario && (
                            <div className="movimientos-form-error">
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
                                    {errorFormulario}
                                </span>
                            </div>
                        )}

                        <form
                            className="movimientos-form"
                            onSubmit={handleSubmit}
                        >

                            <div className="movimientos-form-group">

                                <label htmlFor="movimiento-producto">
                                    Producto *
                                </label>

                                <select
                                    id="movimiento-producto"
                                    name="productoId"
                                    value={formulario.productoId}
                                    onChange={handleChange}
                                    required
                                    disabled={
                                        guardando ||
                                        cargandoProductos
                                    }
                                >
                                    <option value="">
                                        {cargandoProductos
                                            ? 'Cargando productos...'
                                            : productos.length === 0
                                                ? 'No hay productos disponibles'
                                                : 'Selecciona un producto'}
                                    </option>

                                    {!cargandoProductos &&
                                        productos
                                            .filter((producto) => producto.activo !== false)
                                            .map((producto) => (
                                                <option
                                                    key={producto.id}
                                                    value={producto.id}
                                                >
                                                    {producto.nombre} — {producto.sku}
                                                </option>
                                            ))}
                                </select>

                            </div>

                            {obtenerProductoSeleccionado() && (
                                <div className="movimientos-stock-info">

                                    <div>
                                        <span>
                                            Stock actual
                                        </span>

                                        <strong>
                                            {
                                                obtenerProductoSeleccionado()
                                                    .stock
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Stock mínimo
                                        </span>

                                        <strong>
                                            {
                                                obtenerProductoSeleccionado()
                                                    .stockMinimo
                                            }
                                        </strong>
                                    </div>

                                </div>
                            )}

                            <div className="movimientos-form-row">

                                <div className="movimientos-form-group">

                                    <label htmlFor="movimiento-tipo">
                                        Tipo *
                                    </label>

                                    <select
                                        id="movimiento-tipo"
                                        name="tipo"
                                        value={formulario.tipo}
                                        onChange={handleChange}
                                        required
                                        disabled={guardando}
                                    >
                                        <option value="Entrada">
                                            Entrada
                                        </option>

                                        <option value="Salida">
                                            Salida
                                        </option>

                                        <option value="Ajuste">
                                            Ajuste
                                        </option>

                                    </select>

                                </div>

                                <div className="movimientos-form-group">

                                    <label htmlFor="movimiento-cantidad">
                                        Cantidad *
                                    </label>

                                    <input
                                        id="movimiento-cantidad"
                                        name="cantidad"
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={formulario.cantidad}
                                        onChange={handleChange}
                                        placeholder="0"
                                        required
                                        disabled={guardando}
                                    />

                                </div>

                            </div>

                            {formulario.tipo === 'Ajuste' && (
                                <span className="movimientos-adjustment-help">
                                    En un ajuste, la cantidad representa
                                    el nuevo stock total del producto.
                                </span>
                            )}

                            <div className="movimientos-form-group">

                                <label htmlFor="movimiento-motivo">
                                    Motivo *
                                </label>

                                <input
                                    id="movimiento-motivo"
                                    name="motivo"
                                    type="text"
                                    value={formulario.motivo}
                                    onChange={handleChange}
                                    placeholder="Ej. Compra de mercancía"
                                    required
                                    disabled={guardando}
                                />

                            </div>

                            <div className="movimientos-form-group">

                                <label htmlFor="movimiento-observaciones">
                                    Observaciones
                                </label>

                                <textarea
                                    id="movimiento-observaciones"
                                    name="observaciones"
                                    value={formulario.observaciones}
                                    onChange={handleChange}
                                    placeholder="Información adicional del movimiento"
                                    rows="3"
                                    disabled={guardando}
                                />

                            </div>

                            <div className="movimientos-form-actions">

                                <button
                                    type="button"
                                    className="movimientos-secondary-button"
                                    onClick={cerrarFormulario}
                                    disabled={guardando}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="movimientos-primary-button"
                                    disabled={
                                        guardando ||
                                        cargandoProductos ||
                                        productos.filter(
                                            (producto) =>
                                                producto.activo !== false
                                        ).length === 0
                                    }
                                >
                                    {guardando ? (
                                        <>
                                            <span className="movimientos-button-spinner"></span>
                                            Registrando...
                                        </>
                                    ) : (
                                        <>
                                            <span className="movimientos-submit-icon">
                                                ✓
                                            </span>

                                            Registrar movimiento
                                        </>
                                    )}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </section>
    )
}

export default Movimientos