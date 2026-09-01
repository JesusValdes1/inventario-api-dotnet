import { apiRequest } from './api'

export const obtenerMovimientos = () =>
  apiRequest('/Movimientos')

export const obtenerMovimientoPorId = (id) =>
  apiRequest(`/Movimientos/${id}`)

export const crearMovimiento = (movimiento) =>
  apiRequest('/Movimientos', {
    method: 'POST',
    body: JSON.stringify(movimiento),
  })