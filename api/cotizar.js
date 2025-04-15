// Función para manejar la cotización y hacer la consulta a la API externa
export async function cotizar(datos) {
  try {
    // Enviar los datos al archivo PHP para que los procese
    const tokenResponse = await fetch('/cotizar.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: 'tu_token_aqui',  // Aquí se coloca el token que necesitarás (esto puede venir de una variable de sesión o global)
        datos: datos
      })
    });

    // Obtener la respuesta de PHP
    const tokenData = await tokenResponse.json();

    // Verificar si hubo un error en la respuesta
    if (tokenData.error) {
      throw new Error(tokenData.error);
    }

    // Realizar la consulta a la API externa
    const cotizacionResponse = await fetch('http://ec2-54-188-18-143.us-west-2.compute.amazonaws.com:4000/api/rates', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.token}`,  // Usar el token recibido
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        address_from: {
          country_code: "MX",
          zip_code: tokenData.datos.origen  // Usamos 'origen' de los datos de la respuesta
        },
        address_to: {
          country_code: "MX",
          zip_code: tokenData.datos.destino  // Usamos 'destino' de los datos de la respuesta
        },
        parcel: {
          currency: "MXN",
          distance_unit: "CM",
          height: tokenData.datos.largo,  // Usamos 'largo'
          length: tokenData.datos.ancho,  // Usamos 'ancho'
          mass_unit: "KG",
          weight: tokenData.datos.peso,  // Usamos 'peso'
          width: tokenData.datos.alto  // Usamos 'alto'
        }
      })
    });

    // Verificar si la respuesta de la cotización es exitosa
    if (!cotizacionResponse.ok) {
      const errorDetails = await cotizacionResponse.text();
      throw new Error(`Error al obtener la cotización: ${errorDetails}`);
    }

    // Convertir la respuesta en JSON
    const cotizacionData = await cotizacionResponse.json();

    // Verificar si la cotización fue exitosa
    if (cotizacionData.error) {
      throw new Error(cotizacionData.error);
    }

    // Retornar los resultados de la cotización
    return cotizacionData;

  } catch (error) {
    // Manejo de errores
    console.error(`Error en el proceso de cotización: ${error.message}`);
    throw error;
  }
}
