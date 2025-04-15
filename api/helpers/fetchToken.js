export async function obtenerToken() {
  try {
    // Realiza la solicitud para obtener el token
    const loginResponse = await fetch('http://ec2-34-209-178-62.us-west-2.compute.amazonaws.com:4000/api/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: "aziel.cuevasf@gmail.com", // Cambia esto por tu email
        password: "IZMXs6c1Usb8fQ886J"   // Cambia esto por tu contraseña
      })
    });

    const loginData = await loginResponse.json();

    // Verifica que se haya obtenido el token
    if (!loginResponse.ok || !loginData.token) {
      throw new Error('No se pudo obtener el token');
    }

    return loginData.token;
  } catch (error) {
    throw new Error('Error al obtener el token: ' + error.message);
  }
}
