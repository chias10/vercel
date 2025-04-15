// /api/helpers/fetchRates.js
export async function obtenerTarifas(token, datos) {
  try {
    const quoteResponse = await fetch('http://ec2-34-209-178-62.us-west-2.compute.amazonaws.com:4000/api/rates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        type: "quote",
        data: {
          shipment: {
            carrier: "estafeta,paquetexpress,fedex,redpack,dhl",
            type: "standard"
          },
          parcel: {
            weight: parseFloat(datos.peso),
            height: parseFloat(datos.alto),
            width: parseFloat(datos.ancho),
            length: parseFloat(datos.largo)
          },
          origin: {
            zip: datos.origen
          },
          destination: {
            zip: datos.destino
          }
        }
      })
    });

    // Verifica si la respuesta fue exitosa
    if (!quoteResponse.ok) {
      const errorDetails = await quoteResponse.text(); // O puedes usar .json() si la respuesta es JSON
      throw new Error(`Error al obtener las tarifas: ${errorDetails}`);
    }

    const quoteData = await quoteResponse.json();

    return quoteData;
  } catch (error) {
    throw new Error('Error al obtener las tarifas: ' + error.message);
  }
}
