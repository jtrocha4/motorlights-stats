import React from 'react'

const InputFile = ({ label, handleChange }) => {
  return (
    <>
      <label className='form-label' htmlFor=''>{label}</label>
      <input className='form-control' type='file' name='' id='' accept='.xls , .xlsx' onChange={handleChange} />
    </>
  )
}

export default InputFile
