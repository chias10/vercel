export async function obtenerToken() {
  const maxIntentos = 3;
  let intento = 0;

  while (intento < maxIntentos) {
    try {
      const response = await fetch('http://ec2-34-209-178-62.us-west-2.compute.amazonaws.com:4000/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: process.env.EMAIL, password: process.env.PASSWORD })
      });

      if (response.ok) {
        const loginData = await response.json();
        return loginData.token;
      } else {
        const errorDetails = await response.text();
        throw new Error(`Error al obtener el token: ${errorDetails}`);
      }
    } catch (error) {
      if (intento === maxIntentos - 1) throw error;
      intento++;
      await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo antes de reintentar
    }
  }
}

export async function cotizar(datos) {
  try {
    // Obtener el token de forma asíncrona
    const token = await obtenerToken();
    
    // Validar los datos
    if (!isValidData(datos)) {
      throw new Error('Datos inválidos. Asegúrate de que peso, alto, largo y ancho sean números.');
    }

    // Realizar la solicitud de cotización
    const cotizacionResponse = await fetch('https://cotizador-murex.vercel.app/api/cotizar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1',
        'Referer': 'https://actrips.com.mx/generar/'
      },
      body: JSON.stringify({
        token: token,
        datos: datos
      })
    });

    if (!cotizacionResponse.ok) {
      const errorDetails = await cotizacionResponse.text();
      throw new Error(`Error al obtener la cotización: ${errorDetails}`);
    }

    const cotizacionData = await cotizacionResponse.json();

    // Verificar si la cotización fue exitosa
    if (!cotizacionData || cotizacionData.error) {
      throw new Error(cotizacionData.error || 'Error al obtener la cotización');
    }

    return cotizacionData;
  } catch (error) {
    // Manejo de errores
    throw new Error(`Error en el proceso de cotización: ${error.message}`);
  }
}

// Función para validar los datos
function isValidData(datos) {
  return !isNaN(datos.peso) && !isNaN(datos.alto) && !isNaN(datos.largo) && !isNaN(datos.ancho);
}
