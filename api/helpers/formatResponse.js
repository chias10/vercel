export function formatearRespuesta(tarifas) {
  // Aquí puedes ajustar el formato de la respuesta si es necesario
  return tarifas.data?.map(op => ({
    carrier: op.carrier,
    service: op.service,
    total_price: op.total_price,
    days: op.days
  })) || [];
}
