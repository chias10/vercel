// /api/helpers/fetchRates.js
export async function obtenerTarifas(token, datos) {
  const response = await fetch('http://ec2-34-209-178-62.us-west-2.compute.amazonaws.com:4000/api/rates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      address_from: {
        country_code: "MX",
        zip_code: datos.origen
      },
      address_to: {
        country_code: "MX",
        zip_code: datos.destino
      },
      parcel: {
        currency: "MXN",
        distance_unit: "CM",
        height: parseFloat(datos.alto),
        length: parseFloat(datos.largo),
        mass_unit: "KG",
        weight: parseFloat(datos.peso),
        width: parseFloat(datos.ancho)
      }
    })
  });

  if (!response.ok) {
    throw new Error('Error al obtener las tarifas');
  }

  return await response.json();
}
