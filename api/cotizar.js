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
const cotizacionResponse = await fetch('http://ec2-54-188-18-143.us-west-2.compute.amazonaws.com:4000/api/rates', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,  // Aquí agregamos 'Bearer' seguido del token
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    address_from: {
      country_code: "MX",
      zip_code: datos.origen  // Aquí puedes sustituir 'datos.zip_code_from' por la variable correspondiente
    },
    address_to: {
      country_code: "MX",
      zip_code: datos.destino  // Aquí puedes sustituir 'datos.zip_code_to' por la variable correspondiente
    },
    parcel: {
      currency: "MXN",
      distance_unit: "CM",
      height: datos.largo,  // Sustituir por la variable de altura
      length: datos.ancho,  // Sustituir por la variable de longitud
      mass_unit: "KG",
      weight: datos.peso,  // Sustituir por la variable de peso
      width: datos.alto  // Sustituir por la variable de ancho
    }
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
