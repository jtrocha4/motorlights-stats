import React from 'react'

const ButtonUploadDb = ({ title, background = 'primary', data, dateData, postDataToApi }) => {
  const { fechaFinal } = dateData

  const dateOfData = (fechaFinal) => {
    const splitDate = fechaFinal.split('/')
    const day = splitDate[0]
    const month = splitDate[1]
    const year = splitDate[2]

    return new Date(year, month - 1, day)
  }

  const leakedData = data.map(el => (
    {
      cantidadFacturas: el.cantidadFacturas,
      comisionTotal: el.comisionTotal,
      comisionVenta: el.comisionVenta,
      margen: el.margen,
      metaRecaudoSinIva: el.metaRecaudoSinIva,
      metaVentas: el.metaVentas,
      porcentajeMargen: el.porcentajeMargen,
      porcentajeRecaudo: el.porcentajeRecaudo,
      porcentajeVentas: el.porcentajeVentas,
      promedioVentas: el.promedioVentas,
      recaudoPendiente: el.recaudoPendiente,
      totalVentaConFlete: el.totalVentaConFlete,
      totalCosto: el.totalCosto,
      totalRecaudo: el.totalRecaudo,
      totalVenta: el.totalVenta,
      vendedor: el.vendedor,
      ventasPendiente: el.ventasPendiente,
      bonoResultado: el.bonoResultado,
      comisionRecaudo: el.comisionRecaudo,
      fecha: dateOfData(fechaFinal)
    }
  ))

  const handleUploadDb = () => {
    try {
      if (data.length === 0) {
        throw new Error('Empty data')
      }
      for (const key in data) {
        postDataToApi(leakedData[key])
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <button type='button' className={`btn btn-outline-${background}`} onClick={handleUploadDb}><i className='fa-solid fa-cloud-arrow-up' /> {title}</button>
    </div>
  )
}

export default ButtonUploadDb
