export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    console.log('Cuerpo de la solicitud (req.body):', req.body);
  const { token, datos } = req.body;
     console.log('Token:', token);
    console.log('Datos:', datos);

  const response = await fetch('http://ec2-54-188-18-143.us-west-2.compute.amazonaws.com:4000/api/rates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      address_from: {
        country_code: "MX",
        zip_code: datos.origen // Por ejemplo: "54040"
      },
      address_to: {
        country_code: "MX",
        zip_code: datos.destino // Por ejemplo: "54040"
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

    const resultado = await response.json();
    res.status(response.status).json(resultado);

  } catch (error) {
    console.error('Error al cotizar:', error);
    res.status(500).json({ error: 'Error al conectar con la API de cotización' });
  }
}
