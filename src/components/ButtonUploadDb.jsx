import React from 'react'

const ButtonUploadDb = ({ title, background = 'primary', data, postDataToApi }) => {
  const handleUploadDb = () => {
    try {
      if (data.length === 0) {
        throw new Error('Empty data')
      }
      postDataToApi(data)
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
