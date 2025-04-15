// /api/helpers/fetchToken.js
export async function obtenerToken() {
  // Aquí pones la lógica para obtener el token
  const response = await fetch('https://tu-api.com/obtener-token');
  const data = await response.json();

  if (data.token) {
    return data.token;
  } else {
    throw new Error('No se pudo obtener el token');
  }
}
