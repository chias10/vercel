// /api/cotizar.js
import { obtenerToken } from './helpers/fetchToken';
import { obtenerTarifas } from './helpers/fetchRates';
import { formatearRespuesta } from './helpers/formatResponse';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { token, datos } = req.body;

    if (!token || !datos) {
      return res.status(400).json({ error: 'Faltan datos o token' });
    }

    // 1. Verifica si ya tenemos el token o lo obtenemos
    const authToken = token || await obtenerToken();

    // 2. Solicita las tarifas usando el token y los datos
    const tarifas = await obtenerTarifas(authToken, datos);

    // 3. Formatea la respuesta antes de enviarla al cliente
    const resultado = formatearRespuesta(tarifas);

    return res.status(200).json(resultado);
  } catch (error) {
    console.error('Error al cotizar:', error);
    return res.status(500).json({ error: 'Error al conectar con la API de cotización' });
  }
}
