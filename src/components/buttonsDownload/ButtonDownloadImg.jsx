import React from 'react'
import html2canvas from 'html2canvas'
import { saveAs } from 'file-saver'

const ButtonDownloadImg = ({ title, background = 'primary', containerRef, date, screenSize }) => {
  const saveBlob = (blob) => {
    saveAs(blob, `Como Vamos ${date} .png`)
  }

  const handleDownload = () => {
    const node = containerRef.current
    const originalStyles = {
      width: node.style.width,
      height: node.style.height,
      position: node.style.position,
      top: node.style.top,
      left: node.style.left
    }

    node.style.width = `${screenSize}px`
    // node.style.height = '100%'
    node.style.position = 'absolute'
    node.style.top = '0'
    node.style.left = '0'

    const options = {
      scale: 3,
      backgroundColor: 'white'
    }

    html2canvas(node, options).then((canvas) => {
      const blob = canvas.toDataURL('image/png')
      saveBlob(blob)

      node.style.width = originalStyles.width
      node.style.height = originalStyles.height
      node.style.position = originalStyles.position
      node.style.top = originalStyles.top
      node.style.left = originalStyles.left
    }).catch((error) => {
      console.error('Error al capturar la imagen:', error)
    })
  }

  return (
    <>
      <button type='button' className={`btn btn-outline-${background}`} onClick={handleDownload}><i className='fa-regular fa-image' /> {title}</button>
    </>
  )
}

export default ButtonDownloadImg
