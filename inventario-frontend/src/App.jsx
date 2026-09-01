import { useEffect, useState } from 'react'
import './App.css'
import {
  obtenerResumen,
  obtenerProductosStockBajo,
} from './services/productosService'
import Productos from './components/Productos'
import Categorias from './components/Categorias'
import Movimientos from './components/Movimientos'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'productos', label: 'Productos', icon: 'package' },
  { id: 'categorias', label: 'Categorías', icon: 'tags' },
  { id: 'movimientos', label: 'Movimientos', icon: 'movement' },
]

const sectionTitles = {
  dashboard: 'Dashboard',
  productos: 'Productos',
  categorias: 'Categorías',
  movimientos: 'Movimientos',
}

function Icon({ name, size = 20, strokeWidth = 1.8 }) {
  const commonProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
  }

  switch (name) {
    case 'dashboard':
      return (
        <svg {...commonProps}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      )

    case 'package':
      return (
        <svg {...commonProps}>
          <path d="m12 3 8.5 4.5v9L12 21l-8.5-4.5v-9L12 3Z" />
          <path d="M3.5 7.5 12 12l8.5-4.5" />
          <path d="M12 12v9" />
          <path d="m8 5 8.5 4.5" />
        </svg>
      )

    case 'tags':
      return (
        <svg {...commonProps}>
          <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3.4 13.4a2 2 0 0 1 0-2.8V5a2 2 0 0 1 2-2h5.6a2 2 0 0 1 1.4.6l8.2 8.2a2 2 0 0 1 0 2.8Z" />
          <circle cx="7.5" cy="7.5" r="1.5" />
          <path d="m15 8 4 4" />
          <path d="M13 10 9 14" />
        </svg>
      )

    case 'movement':
      return (
        <svg {...commonProps}>
          <path d="M7 3v18" />
          <path d="m3.5 6.5 3.5-3.5 3.5 3.5" />
          <path d="M17 21V3" />
          <path d="m13.5 17.5 3.5 3.5 3.5-3.5" />
        </svg>
      )

    case 'boxes':
      return (
        <svg {...commonProps}>
          <path d="m12 2.8 7.5 4.1v8.2L12 19.2l-7.5-4.1V6.9L12 2.8Z" />
          <path d="m4.5 6.9 7.5 4.2 7.5-4.2" />
          <path d="M12 11.1v8.1" />
          <path d="m3.8 15.2 7.5 4.2" />
          <path d="m20.2 15.2-7.5 4.2" />
        </svg>
      )

    case 'layers':
      return (
        <svg {...commonProps}>
          <path d="m12 3 9 5-9 5-9-5 9-5Z" />
          <path d="m3 12 9 5 9-5" />
          <path d="m3 16 9 5 9-5" />
        </svg>
      )

    case 'check':
      return (
        <svg {...commonProps}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      )

    case 'alert':
      return (
        <svg {...commonProps}>
          <path d="M10.3 3.8 2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      )

    case 'wallet':
      return (
        <svg {...commonProps}>
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 18.5v-13Z" />
          <path d="M4 7h15" />
          <path d="M21 11h-5a2 2 0 0 0 0 4h5" />
          <path d="M16 13h.01" />
        </svg>
      )

    case 'arrow-right':
      return (
        <svg {...commonProps}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      )

    case 'refresh':
      return (
        <svg {...commonProps}>
          <path d="M20 11a8.1 8.1 0 0 0-14.8-4L3 10" />
          <path d="M3 5v5h5" />
          <path d="M4 13a8.1 8.1 0 0 0 14.8 4L21 14" />
          <path d="M21 19v-5h-5" />
        </svg>
      )

    default:
      return null
  }
}

function App() {
  const [activeSection, setActiveSection] = useState('dashboard')

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Icon
              name="boxes"
              size={21}
              strokeWidth={2}
            />
          </div>

          <div>
            <h1>Inventario</h1>
            <span>Management System</span>
          </div>
        </div>

        <nav className="navigation">
          <p className="nav-title">MENÚ PRINCIPAL</p>

          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${
                activeSection === item.id ? 'active' : ''
              }`}
              onClick={() => setActiveSection(item.id)}
              aria-current={
                activeSection === item.id ? 'page' : undefined
              }
              title={item.label}
            >
              <span className="nav-icon">
                <Icon
                  name={item.icon}
                  size={19}
                  strokeWidth={1.9}
                />
              </span>

              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="status-dot" aria-hidden="true"></div>

          <div>
            <strong>API Online</strong>
            <span>Backend conectado</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Inventario /</p>
            <h2>{sectionTitles[activeSection]}</h2>
          </div>

          <div className="profile">
            <div className="profile-avatar">JV</div>

            <div>
              <strong>Demo User</strong>
              <span>Administrador</span>
            </div>
          </div>
        </header>

        {activeSection === 'dashboard' && (
          <Dashboard onNavigate={setActiveSection} />
        )}

        {activeSection === 'productos' && <Productos />}

        {activeSection === 'categorias' && <Categorias />}

        {activeSection === 'movimientos' && <Movimientos />}
      </main>
    </div>
  )
}

function Dashboard({ onNavigate }) {
  const [resumen, setResumen] = useState(null)
  const [stockBajo, setStockBajo] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    cargarDashboard()
  }, [])

  async function cargarDashboard() {
    try {
      setLoading(true)
      setError('')

      const [resumenData, stockBajoData] = await Promise.all([
        obtenerResumen(),
        obtenerProductosStockBajo(),
      ])

      setResumen(resumenData)
      setStockBajo(stockBajoData)
    } catch (error) {
      console.error(error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <DashboardLoading />
  }

  if (error) {
    return (
      <section className="dashboard">
        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">ERROR</p>
              <h4>No se pudo cargar el dashboard</h4>
            </div>
          </div>

          <p className="empty-state">{error}</p>

          <div className="panel-header">
            <button
              type="button"
              className="text-button"
              onClick={cargarDashboard}
            >
              <Icon
                name="refresh"
                size={15}
                strokeWidth={2}
              />
              <span>Reintentar</span>
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="dashboard">
      <Welcome />

      <div className="stats-grid">
        <StatCard
          title="Productos"
          value={resumen.totalProductos}
          description="Productos registrados"
          icon="package"
        />

        <StatCard
          title="Stock total"
          value={resumen.unidadesEnStock}
          description="Unidades disponibles"
          icon="boxes"
        />

        <StatCard
          title="Productos activos"
          value={resumen.productosActivos}
          description="Productos activos"
          icon="check"
        />

        <StatCard
          title="Stock bajo"
          value={resumen.productosStockBajo}
          description="Productos requieren atención"
          icon="alert"
        />
      </div>

      <div className="dashboard-grid">
        <LowStockPanel
          products={stockBajo}
          onNavigate={onNavigate}
        />

        <InventorySummary resumen={resumen} />
      </div>
    </section>
  )
}

function DashboardLoading() {
  return (
    <section className="dashboard">
      <div className="welcome">
        <div>
          <p className="eyebrow">RESUMEN GENERAL</p>

          <h3>
            Control de inventario
            <br />
            <span>en un solo lugar.</span>
          </h3>

          <p className="welcome-text">
            Cargando información del inventario...
          </p>
        </div>
      </div>
    </section>
  )
}

function Welcome() {
  return (
    <div className="welcome">
      <div>
        <p className="eyebrow">RESUMEN GENERAL</p>

        <h3>
          Control de inventario
          <br />
          <span>en un solo lugar.</span>
        </h3>

        <p className="welcome-text">
          Administra productos, categorías y movimientos
          desde una interfaz centralizada.
        </p>
      </div>

      <div className="welcome-decoration" aria-hidden="true">
        <div className="decoration-box">
          <Icon
            name="boxes"
            size={38}
            strokeWidth={1.4}
          />

          <span>INVENTARIO</span>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  description,
  icon,
}) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <span className="stat-icon">
          <Icon
            name={icon}
            size={20}
            strokeWidth={1.8}
          />
        </span>
      </div>

      <p>{title}</p>

      <strong>{value}</strong>

      <span className="stat-description">
        {description}
      </span>
    </article>
  )
}

function LowStockPanel({ products, onNavigate }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">INVENTARIO</p>
          <h4>Productos con stock bajo</h4>
        </div>

        <button
          type="button"
          className="text-button"
          onClick={() => onNavigate('productos')}
        >
          <span>Ver productos</span>

          <Icon
            name="arrow-right"
            size={15}
            strokeWidth={2}
          />
        </button>
      </div>

      <div className="table-container">
        {products.length === 0 ? (
          <p className="empty-state">
            No hay productos con stock bajo.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {products.map((producto) => (
                <tr key={producto.id}>
                  <td>
                    <strong>{producto.nombre}</strong>
                  </td>

                  <td>{producto.categoriaNombre}</td>

                  <td>
                    <strong>{producto.stock}</strong>
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        producto.stock === 0
                          ? 'danger'
                          : 'warning'
                      }`}
                    >
                      <Icon
                        name="alert"
                        size={13}
                        strokeWidth={2}
                      />

                      {producto.stock === 0
                        ? 'Crítico'
                        : 'Stock bajo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function InventorySummary({ resumen }) {
  const valorInventario = Number(
    resumen.valorInventario
  ).toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">VALOR INVENTARIO</p>
          <h4>Resumen financiero</h4>
        </div>

        <span className="panel-header-icon">
          <Icon
            name="wallet"
            size={18}
            strokeWidth={1.8}
          />
        </span>
      </div>

      <div className="inventory-value">
        <span>Valor total del inventario</span>

        <strong>${valorInventario}</strong>
      </div>

      <div className="inventory-summary">
        <div>
          <span>Activos</span>
          <strong>{resumen.productosActivos}</strong>
        </div>

        <div>
          <span>Inactivos</span>
          <strong>{resumen.productosInactivos}</strong>
        </div>

        <div>
          <span>Stock bajo</span>
          <strong>{resumen.productosStockBajo}</strong>
        </div>
      </div>
    </div>
  )
}

function SectionPlaceholder({
  title,
  description,
}) {
  return (
    <section className="placeholder">
      <div className="placeholder-icon">
        <Icon
          name={
            title === 'Categorías'
              ? 'tags'
              : 'movement'
          }
          size={25}
          strokeWidth={1.7}
        />
      </div>

      <p className="eyebrow">MÓDULO</p>

      <h3>{title}</h3>

      <p>{description}</p>

      <span>
        Conectaremos este módulo con la API REST.
      </span>
    </section>
  )
}

export default App