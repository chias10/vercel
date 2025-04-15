export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { datos } = req.body;

  if (!datos) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    // Obtener el token
    const loginResponse = await fetch('http://ec2-34-209-178-62.us-west-2.compute.amazonaws.com:4000/api/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: "aziel.cuevasf@gmail.com",
        password: "IZMXs6c1Usb8fQ886J"
      })
    });

    const loginData = await loginResponse.json();

    // Si no se obtiene el token correctamente, retornar un error
    if (!loginResponse.ok || !loginData.token) {
      return res.status(401).json({ error: 'No se pudo obtener el token' });
    }

    const token = loginData.token;

    // Realizar la cotización con el token
    const quoteResponse = await fetch('http://ec2-34-209-178-62.us-west-2.compute.amazonaws.com:4000/api/quote', {
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

    const quoteData = await quoteResponse.json();

    // Verificar el status de la respuesta
    if (!quoteResponse.ok) {
      // Agregar la respuesta de error para diagnóstico
      return res.status(quoteResponse.status).json({
        error: 'Error en la API externa al hacer la cotización',
        details: quoteData || 'No se recibió respuesta válida de la API'
      });
    }

    // Extraemos las opciones y las devolvemos al cliente
    const opciones = quoteData.data?.map(op => ({
      carrier: op.carrier,
      service: op.service,
      total_price: op.total_price,
      days: op.days
    })) || [];

    res.status(200).json({ options: opciones });

  } catch (error) {
    console.error('Error al obtener el token o al cotizar:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
