// /api/helpers/formatResponse.js
export function formatearRespuesta(tarifas) {
  const opciones = tarifas.data?.map(op => ({
    carrier: op.carrier,
    service: op.service,
    total_price: op.total_price,
    days: op.days
  })) || [];

  return { options: opciones };
}
