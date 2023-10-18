import React from 'react'

const ButtonDownloadAnalytics = ({ title, background = 'primary' }) => {
  const handleDownload = (event) => {
    console.log('Descargando...')
  }

  return (
    <>
      <button type='button' className={`btn btn-outline-${background}`} onClick={handleDownload}><i className='fa-regular fa-file-excel' /> {title}</button>
    </>
  )
}

export default ButtonDownloadAnalytics
