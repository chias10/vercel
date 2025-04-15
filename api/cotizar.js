export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Validación de datos de entrada
  const { token, datos } = req.body;

  if (!token || !datos || !datos.origen || !datos.destino || !datos.alto || !datos.largo || !datos.peso || !datos.ancho) {
    return res.status(400).json({ error: 'Faltan datos en la solicitud' });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de timeout

  try {
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
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData.message || 'Error desconocido al obtener cotización' });
    }

    const resultado = await response.json();

    // Verificar formato de la respuesta
    if (!resultado || typeof resultado !== 'object') {
      return res.status(500).json({ error: 'Respuesta inesperada de la API de cotización' });
    }

    res.status(200).json(resultado);

  } catch (error) {
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'Tiempo de espera agotado al conectar con la API externa' });
    }

    console.error('Error al cotizar:', error);
    res.status(500).json({ error: 'Error al conectar con la API de cotización' });
  } finally {
    clearTimeout(timeoutId); // Limpiar el timeout cuando termine
  }
}
