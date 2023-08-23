import React from 'react'

const InputFile = ({ label, handleChange }) => {
  return (
    <>
      <label className='form-label'>{label}</label>
      <input className='form-control' type='file' accept='.xls , .xlsx' onChange={handleChange} />
    </>
  )
}

export default InputFile
