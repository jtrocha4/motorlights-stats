import React from 'react'
import ButtonDownloadPortfolio from '../components/buttonsDownload/ButtonDownloadPortfolio'

const CreditAndPortfolio = () => {
  return (
    <div className='flex'>
      <div className='container-fluid'>
        <h2>Informe de Credito y Cartera</h2>
        <section className='button-group mt-4'>
          <ButtonDownloadPortfolio title='Descargar Inf. Comportamiento de Pago' />
        </section>
      </div>
    </div>
  )
}

export default CreditAndPortfolio
