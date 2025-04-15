// /api/helpers/formatResponse.js
export function formatearRespuesta(tarifas) {
  // Aquí puedes modificar la respuesta si lo necesitas
  // Por ejemplo, agregar $50 al total de cada tarifa
  return tarifas.data.map(tarifa => ({
    ...tarifa,
    total_amount: tarifa.total_amount + 50 // Sumar 50 a cada tarifa
  }));
}
