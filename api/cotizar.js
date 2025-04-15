// Función para validar los datos antes de la cotización
function isValidData(datos) {
  return !isNaN(datos.peso) && !isNaN(datos.alto) && !isNaN(datos.largo) && !isNaN(datos.ancho);
}

// Función principal para realizar la cotización
export async function cotizar(datos, token) {
  try {
    // Validar los datos antes de la cotización
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

    // Retornar los resultados de la cotización
    return cotizacionData;
  } catch (error) {
    // Manejo de errores
    throw new Error(`Error en el proceso de cotización: ${error.message}`);
  }
}
