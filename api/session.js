export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const response = await fetch('http://ec2-54-188-18-143.us-west-2.compute.amazonaws.com:4000/api/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: "aziel.cuevasf@gmail.com",
        password: "YvSBijB3E8z6P2awF5"
      })
    });

    const data = await response.json();
    res.status(response.status).json(data);

  } catch (error) {
    console.error('Error en el proxy:', error);
    res.status(500).json({ error: 'Error al conectar con la API externa' });
  }
}
