// /api/helpers/fetchToken.js
export async function obtenerToken() {
  try {
    // Usar variables de entorno para el email y la contraseña
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;

    // Verificar que las variables de entorno estén definidas
    if (!email || !password) {
      throw new Error('Las credenciales de acceso no están configuradas correctamente.');
    }

    // Realiza la solicitud para obtener el token
    const loginResponse = await fetch('http://ec2-34-209-178-62.us-west-2.compute.amazonaws.com:4000/api/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,  // Utiliza las variables de entorno
        password
      })
    });

    // Verifica si la respuesta fue exitosa
    if (!loginResponse.ok) {
      const errorDetails = await loginResponse.text(); // O puedes usar .json() si la respuesta es JSON
      throw new Error(`Error al obtener el token: ${errorDetails}`);
    }

    const loginData = await loginResponse.json();

    // Verifica que el token esté presente en la respuesta
    if (!loginData || !loginData.token) {
      throw new Error('No se pudo obtener el token');
    }

    // Devuelve el token
    return loginData.token;
  } catch (error) {
    // Proporciona un mensaje de error detallado
    throw new Error('Error al obtener el token: ' + error.message);
  }
}
