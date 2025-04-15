export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    console.log('Cuerpo de la solicitud (req.body):', req.body);
  const { token, datos } = req.body;
     console.log('Token:', token);
    console.log('Datos:', datos);

  const response = await fetch('http://ec2-34-209-178-62.us-west-2.compute.amazonaws.com:4000/api/rates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJtYW51YWJsZV9hcGkiLCJleHAiOjE3NDQ4Mzk5MzIsImlhdCI6MTc0NDc1MzUzMiwiaXNzIjoibWFudWFibGVfYXBpIiwianRpIjoiMDMwNjI5MTQtZGZiMi00MTBmLWJhNGUtZDJjNWU3OGEyODc2IiwibmJmIjoxNzQ0NzUzNTMxLCJzdWIiOiI3IiwidHlwIjoiYWNjZXNzIn0.1Pqn_9XMkLKRNMjTZ2DthNingEEU0ARiz1N9g45JfTz0_Zb3denPJxFvJjes2eRHNOAZYbmt_atUaahibK_Hiw"
    },
    body: JSON.stringify({
      address_from: {
        country_code: "MX",
        zip_code: "37700" // Por ejemplo: "54040"
      },
      address_to: {
        country_code: "MX",
        zip_code: "01010" // Por ejemplo: "54040"
      },
      parcel: {
        currency: "MXN",
        distance_unit: "CM",
        height: 10,
        length: 10,
        mass_unit: "KG",
        weight: 5,
        width: 10
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
