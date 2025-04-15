export async function obtenerTarifas(token, datos) {
  try {
    // Realiza la solicitud de tarifas utilizando el token
    const response = await fetch('http://ec2-34-209-178-62.us-west-2.compute.amazonaws.com:4000/api/quote', {
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
      });

    const tarifaData = await response.json();

    if (!response.ok) {
      throw new Error('Error al obtener las tarifas');
    }

    return tarifaData;
  } catch (error) {
    throw new Error('Error al obtener las tarifas: ' + error.message);
  }
}
