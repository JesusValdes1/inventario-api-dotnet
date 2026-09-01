import { apiRequest } from './api'

export const obtenerCategorias = () =>
  apiRequest('/Categorias')

export const obtenerCategoriaPorId = (id) =>
  apiRequest(`/Categorias/${id}`)

export const crearCategoria = (categoria) =>
  apiRequest('/Categorias', {
    method: 'POST',
    body: JSON.stringify(categoria),
  })

export const actualizarCategoria = (id, categoria) =>
  apiRequest(`/Categorias/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoria),
  })

export const eliminarCategoria = (id) =>
  apiRequest(`/Categorias/${id}`, {
    method: 'DELETE',
  })