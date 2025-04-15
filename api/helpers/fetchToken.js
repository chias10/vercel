// /api/helpers/fetchToken.js
export async function obtenerToken() {
  try {
    // Hacer una solicitud para obtener el token
    const loginResponse = await fetch('http://ec2-34-209-178-62.us-west-2.compute.amazonaws.com:4000/api/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: "aziel.cuevasf@gmail.com", // Ajusta esto con tus credenciales
        password: "IZMXs6c1Usb8fQ886J"   // Ajusta esto con tus credenciales
      })
    });

    const loginData = await loginResponse.json();

    // Verificar si se obtuvo el token
    if (!loginResponse.ok || !loginData.token) {
      throw new Error('No se pudo obtener el token');
    }

    return loginData.token;
  } catch (error) {
    throw new Error('Error al obtener el token: ' + error.message);
  }
}
