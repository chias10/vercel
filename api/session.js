export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const response = await fetch('http://ec2-34-209-178-62.us-west-2.compute.amazonaws.com:4000/api/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: "aziel.cuevasf@gmail.com",
        password: "IZMXs6c1Usb8fQ886J"
      })
    });

    const data = await response.json();
    res.status(response.status).json(data);

  } catch (error) {
    console.error('Error en el proxy:', error);
    res.status(500).json({ error: 'Error al conectar con la API externa' });
  }
}
