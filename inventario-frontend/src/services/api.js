const API_BASE_URL = 'http://localhost:5029/api'

export async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    let message = 'Ocurrió un error al comunicarse con la API.'

    try {
      const data = await response.json()
      message = data.mensaje || data.message || message
    } catch {
      // La respuesta no contiene JSON
    }

    throw new Error(message)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}