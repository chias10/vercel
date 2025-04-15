export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { token, datos } = req.body;

    const response = await fetch('http://ec2-34-209-178-62.us-west-2.compute.amazonaws.com:4000/api/shipment/quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        // Asegúrate que estos datos se pasen desde el frontend correctamente
        length: parseFloat(datos.largo),
        width: parseFloat(datos.ancho),
        height: parseFloat(datos.alto),
        weight: parseFloat(datos.peso),
        from: datos.origen,
        to: datos.destino
      })
    });

    const resultado = await response.json();
    res.status(response.status).json(resultado);

  } catch (error) {
    console.error('Error al cotizar:', error);
    res.status(500).json({ error: 'Error al conectar con la API de cotización' });
  }
}
