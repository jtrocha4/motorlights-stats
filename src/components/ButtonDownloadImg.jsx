import React from 'react'
import domToImage from 'dom-to-image'
import { saveAs } from 'file-saver'

const ButtonDownloadImg = ({ title, background = 'primary', containerRef, date }) => {
  const saveBlob = (blob) => {
    saveAs(blob, `Como Vamos ${date} .png`)
  }

  const handleDownload = () => {
    const node = containerRef.current

    const options = {
      quality: 1
      // style: {
      //   background: 'white'
      // }
    }

    domToImage.toBlob(node, options)
      .then(saveBlob)
  }

  return (
    <>
      <button type='button' className={`btn btn-outline-${background}`} onClick={handleDownload}><i className='fa-regular fa-image' /> {title}</button>
    </>
  )
}

export default ButtonDownloadImg
