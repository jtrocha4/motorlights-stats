import React from 'react'
import XLSX from 'xlsx-js-style'
import excelStyles from '../styles/excelStyles'

const ButtonDownloadIncentivePayout = ({ title, data, currencyFormat, toFixed }) => {
  const handleDownload = () => {
    const values = ['Vendedor', 'Facturas', 'Meta de Venta', 'Venta (Sin flete)', '% Venta', 'Meta de Recaudo', 'Recaudo', '% Recaudo']
    const wsData = []

    values.forEach(value => {
      let row = [value]
      const cellValue = { v: '' }
      if (value === 'Vendedor') {
        cellValue.v = value
      }
      row = [cellValue]
      data.forEach(element => {
        const cellElement = { v: '' }
        if (value === 'Vendedor') {
          cellElement.v = element.vendedor
        }
        row.push(cellElement)
      })
      wsData.push(row)
    })

    const sellerData = {}
    const sellerWsData = {}
    const sellerName = wsData[0].map(el => el.v)

    sellerName.forEach(seller => {
      if (seller !== 'Vendedor') {
        sellerData[seller] = []
        sellerWsData[seller] = []
      }
    })

    for (const key in data) {
      const seller = data[key].vendedor
      if (sellerData[seller]) {
        sellerData[seller].push(data[key])
      }
    }

    for (const key in data) {
      const seller = data[key].vendedor
      if (sellerWsData[seller]) {
        values.forEach(value => {
          let row = [value]
          const cellValue = { v: '', s: {} }
          if (value === 'Vendedor') {
            cellValue.v = value
            cellValue.s = excelStyles.headerYellowStyle
          }
          if (value === 'Facturas') {
            cellValue.v = value
            cellValue.s = excelStyles.headerYellowStyle
          }
          if (value === 'Meta de Venta') {
            cellValue.v = value
            cellValue.s = excelStyles.headerYellowStyle
          }
          if (value === 'Venta (Sin flete)') {
            cellValue.v = value
            cellValue.s = excelStyles.headerYellowStyle
          }
          if (value === '% Venta') {
            cellValue.v = value
            cellValue.s = excelStyles.headerYellowStyle
          }
          if (value === 'Meta de Recaudo') {
            cellValue.v = value
            cellValue.s = excelStyles.headerYellowStyle
          }
          if (value === 'Recaudo') {
            cellValue.v = value
            cellValue.s = excelStyles.headerYellowStyle
          }
          if (value === '% Recaudo') {
            cellValue.v = value
            cellValue.s = excelStyles.headerYellowStyle
          }
          row = [cellValue]
          sellerData[seller].forEach(element => {
            const cellElement = { v: '', s: {} }
            if (value === 'Vendedor') {
              cellElement.v = element.vendedor
              cellElement.s = excelStyles.whiteStyle
            }
            if (value === 'Facturas') {
              cellElement.v = element.cantidadFacturas
              cellElement.s = excelStyles.whiteStyle
            }
            if (value === 'Meta de Venta') {
              cellElement.v = currencyFormat(element.metaVentas)
              cellElement.s = excelStyles.whiteStyle
            }
            if (value === 'Venta (Sin flete)') {
              cellElement.v = currencyFormat(element.totalVenta)
              cellElement.s = excelStyles.whiteStyle
            }
            if (value === '% Venta') {
              cellElement.v = element.porcentajeVentas
              cellElement.s = excelStyles.grayStyle
            }
            if (value === 'Meta de Recaudo') {
              cellElement.v = currencyFormat(element.metaRecaudoSinIva)
              cellElement.s = excelStyles.whiteStyle
            }
            if (value === 'Recaudo') {
              cellElement.v = currencyFormat(element.totalRecaudo)
              cellElement.s = excelStyles.whiteStyle
            }
            if (value === '% Recaudo') {
              cellElement.v = element.porcentajeRecaudo
              cellElement.s = excelStyles.grayStyle
            }
            row.push(cellElement)
          })
          sellerWsData[seller].push(row)
        })
      }
    }

    const wsIncentiveData = []
    const salesBonus = ['Venta']
    const collectionBonus = ['Recaudo']
    const resultBonus = ['Bono resultados']
    const commission = ['Total comision']

    sellerName.forEach(seller => {
      if (seller !== 'Vendedor') {
        sellerData[seller] = []
        wsIncentiveData[seller] = []
      }
    })

    for (const key in data) {
      const seller = data[key].vendedor
      if (sellerData[seller]) {
        sellerData[seller].push(data[key])
      }
    }

    for (const key in data) {
      const seller = data[key].vendedor
      if (wsIncentiveData[seller]) {
        salesBonus.forEach(bonus => {
          let row = [bonus]
          const cellValue = { v: '', s: {} }
          if (bonus === 'Venta') {
            cellValue.v = bonus
            cellValue.s = excelStyles.headerYellowStyle
          }
          row = [cellValue]
          sellerData[seller].forEach(element => {
            const cellElement = { v: '', s: {} }
            if (bonus === 'Venta') {
              cellElement.v = currencyFormat(element.comisionVenta)
              cellElement.s = excelStyles.whiteStyle
            }
            row.push({ v: '>=100%', s: excelStyles.whiteStyle }, { v: '1% Venta', s: excelStyles.whiteStyle })
            row.push(cellElement)
          })
          wsIncentiveData[seller].push(row)
        })
      }
    }
    for (const key in data) {
      const seller = data[key].vendedor
      if (wsIncentiveData[seller]) {
        collectionBonus.forEach(bonus => {
          let row = [bonus]
          const cellValue = { v: '', s: {} }
          if (bonus === 'Recaudo') {
            cellValue.v = bonus
            cellValue.s = excelStyles.headerYellowStyle
          }
          row = [cellValue]
          sellerData[seller].forEach(element => {
            const cellElement = { v: '', s: {} }
            if (bonus === 'Recaudo') {
              cellElement.v = currencyFormat(element.comisionRecaudo)
              cellElement.s = excelStyles.whiteStyle
            }
            row.push({ v: '>=100%', s: excelStyles.whiteStyle }, { v: '1% Recaudo', s: excelStyles.whiteStyle })
            row.push(cellElement)
          })
          wsIncentiveData[seller].push(row)
          wsIncentiveData[seller].push([{ v: '', s: {} }])
        })
      }
    }
    for (const key in data) {
      const seller = data[key].vendedor
      if (wsIncentiveData[seller]) {
        commission.forEach(bonus => {
          let row = [bonus]
          const cellValue = { v: '', s: {} }
          if (bonus === 'Total comision') {
            cellValue.v = bonus
            cellValue.s = excelStyles.headerGreenStyle
          }
          row = [cellValue]
          sellerData[seller].forEach(element => {
            const cellElement = { v: '', s: {} }
            if (bonus === 'Total comision') {
              cellElement.v = currencyFormat(element.comisionTotal)
              cellElement.s = excelStyles.whiteStyle
            }
            row.push({ v: '', s: excelStyles.whiteStyle }, { v: '', s: excelStyles.whiteStyle })
            row.push(cellElement)
          })
          wsIncentiveData[seller].push(row)
          wsIncentiveData[seller].push([{ v: '', s: {} }])
        })
      }
    }
    for (const key in data) {
      const seller = data[key].vendedor

      // Bonos
      const firstBonus = sellerData[seller].map(el => el.totalRecaudo * 0.02)

      let secondBonus = 0
      sellerData[seller].forEach(el => {
        if (el.porcentajeVentas > 100 && el.porcentajeRecaudo > 100) {
          secondBonus = el.totalRecaudo * 0.012
        } else {
          secondBonus = 0
        }
      })

      // TODO: Trabajar las funcionalidades de los siguientes bonos
      const thirdBonus = 0
      sellerData[seller].forEach(el => {
        // el.totalRecaudo * 0.06
      })
      const fourthBonus = 0
      sellerData[seller].forEach(el => {
        // el => el.totalRecaudo * 0.07
      })
      const fifthBonus = 0

      if (wsIncentiveData[seller]) {
        resultBonus.forEach(bonus => {
          let row = [bonus]
          const cellValue = { v: '', s: {} }
          if (bonus === 'Bono resultados') {
            cellValue.v = bonus
            cellValue.s = excelStyles.headerYellowStyle
          }
          row = [cellValue]
          sellerData[seller].forEach(element => {
            const cellElement = { v: '', s: {} }
            if (bonus === 'Bono resultados') {
              cellElement.v = currencyFormat(element.bonoResultado)
              cellElement.s = excelStyles.whiteStyle
            }
            row.push({ v: '', s: excelStyles.whiteStyle }, { v: '', s: excelStyles.whiteStyle })
            row.push(cellElement)
          })
          wsIncentiveData[seller].push(row)
          wsIncentiveData[seller].push(
            [
              { v: '', s: {} }
            ],
            [
              { v: 'Bono Resultados', s: excelStyles.headerYellowStyle },
              { v: '2% Recaudo', s: excelStyles.whiteStyle },
              { v: 'Sin condiciones', s: excelStyles.whiteStyle },
              { v: `${currencyFormat(firstBonus)}`, s: excelStyles.whiteStyle }
            ],
            [
              { v: '', s: {} },
              { v: '1,2% Recaudo', s: excelStyles.whiteStyle },
              { v: 'Recaudo > 100% + Venta >100%', s: excelStyles.whiteStyle },
              { v: `${currencyFormat(secondBonus)}`, s: excelStyles.whiteStyle }
            ],
            [
              { v: '', s: {} },
              { v: '0,6% Recaudo', s: excelStyles.whiteStyle },
              { v: 'Util ml del mes >10% al 20% *para los que cumplen recaudo*', s: excelStyles.whiteStyle },
              { v: `${currencyFormat(thirdBonus)}`, s: excelStyles.whiteStyle }
            ],
            [
              { v: '', s: {} },
              { v: '0,7% Recaudo', s: excelStyles.whiteStyle },
              { v: 'Util ml del mes >20%', s: excelStyles.whiteStyle },
              { v: `${currencyFormat(fourthBonus)}`, s: excelStyles.whiteStyle }
            ],
            [{ v: '', s: {} },
              { v: '0,1% Recaudo', s: excelStyles.whiteStyle },
              { v: 'Por cada cliente nuevo', s: excelStyles.whiteStyle },
              { v: `${currencyFormat(fifthBonus)}`, s: excelStyles.whiteStyle }
            ]
          )
          wsIncentiveData[seller].push([{ v: '', s: {} }])
        })
      }
    }

    const workbook = XLSX.utils.book_new()

    data.map(element => {
      const sellerName = []
      const splitChain = element.vendedor.split(' ')
      sellerName.push(`${splitChain[0]} ${splitChain[1]} ${splitChain[2]} ${splitChain[3]}`)
      return sellerName
    })

    const columnWidths = wsData.reduce((acc, row) => {
      row.forEach((cell, colIndex) => {
        const cellValue = cell.v ? cell.toString() : ''
        acc[colIndex] = Math.max(acc[colIndex] || 0, cellValue.length)
      })
      return acc
    }, [])

    sellerName.forEach(seller => {
      if (sellerWsData[seller]) {
        const sheetName = seller.split(' ')
        const ws = XLSX.utils.aoa_to_sheet(sellerWsData[seller])
        XLSX.utils.sheet_add_aoa(ws, wsIncentiveData[seller], { origin: 'D2' })

        ws['!cols'] = columnWidths.map(width => ({ wch: width + 1 }))
        XLSX.utils.book_append_sheet(workbook, ws, `INCENTIVO ${sheetName[0]} ${sheetName[1]}`)
      }
    })

    const excelFileName = 'Liq Incentivos.xlsx'
    XLSX.writeFile(workbook, excelFileName)
  }
  return (
    <div>
      <button type='button' className='btn btn-outline-success' onClick={handleDownload}><i className='fa-regular fa-file-excel' /> {title}</button>
    </div>
  )
}

export default ButtonDownloadIncentivePayout
