import { apiRequest } from './api'

export const obtenerProductos = (params = '') =>
  apiRequest(`/Productos${params}`)

export const obtenerProductoPorId = (id) =>
  apiRequest(`/Productos/${id}`)

export const obtenerProductosStockBajo = () =>
  apiRequest('/Productos/stock-bajo')

export const obtenerResumen = () =>
  apiRequest('/Productos/resumen')

export const crearProducto = (producto) =>
  apiRequest('/Productos', {
    method: 'POST',
    body: JSON.stringify(producto),
  })

export const actualizarProducto = (id, producto) =>
  apiRequest(`/Productos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(producto),
  })

export const eliminarProducto = (id) =>
  apiRequest(`/Productos/${id}`, {
    method: 'DELETE',
  })