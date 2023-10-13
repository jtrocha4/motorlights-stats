import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from './context/data'
import { ThirdPartiesContext } from './context/thirdParties'

const TableAnalytics = ({ data, convertExcelDateToReadable, currencyFormat, toFixed, department }) => {
  const { excelDataCost } = useContext(DataContext)
  const { excelDataThirdParties, thirdPartiesData } = useContext(ThirdPartiesContext)
  const [salesData, setSalesData] = useState([])
  const [uniqueCustomers, setUniqueCustomers] = useState([])

  const extractIdNumber = (string) => {
    const regex = /\d+/
    const id = string.match(regex)
    if (id !== null) {
      return id[0]
    } else {
      console.error('the string must contain numbers')
    }
  }

  const extractProductText = (string) => {
    const regex = /^\d+\s*(.+)/
    const product = string.match(regex)
    return product[1]
  }

  const extractUniqueThirdParties = (dataThirdParties = [], dataDepartment = []) => {
    const uniqueCustomers = []
    const uniqueCustomerNames = new Set()

    dataThirdParties.forEach(customer => {
      if (!uniqueCustomerNames.has(customer.nombre)) {
        uniqueCustomerNames.add(customer.nombre)
        uniqueCustomers.push(customer)
      }
    })

    const uniqueCustomersWithDepartment = uniqueCustomers.map(cliente => {
      const municipality = dataDepartment.find(depart => (
        depart.municipios.some(munic => munic.nombre === cliente.ciudad)
      ))
      const department = municipality ? municipality.nombre : undefined
      return {
        ...cliente,
        departamento: department
      }
    })
    setUniqueCustomers(uniqueCustomersWithDepartment)
  }

  const extractSalesFromData = (dataArray = [], dataThirdParties = []) => {
    const sales = dataThirdParties.flatMap(customer =>
      dataArray.filter(element => element.venta !== undefined)
        .map(element =>
          element.venta.filter(el => el.cliente === customer.nombre)
            .map(el => ({
              ...el,
              idTercero: extractIdNumber(customer.id),
              ciudadTercero: customer.ciudad,
              departamentoTercero: customer.departamento,
              vendedor: element.vendedor,
              producto: extractProductText(el.codigoInventario),
              idProducto: extractIdNumber(el.codigoInventario),
              unitarioVentas: toFixed(el.unitarioVentas),
              ventas: toFixed(el.ventas)
            }))
        )
        .flat()
    )
    setSalesData(sales)
  }

  useEffect(() => {
    extractUniqueThirdParties(thirdPartiesData, department)
  }, [excelDataCost, excelDataThirdParties])

  useEffect(() => {
    extractSalesFromData(data, uniqueCustomers)
  }, [uniqueCustomers])

  return (
    <div>
      <table className='table table-hover table-sm'>
        <thead>
          <tr>
            <th>Vendedor</th>
            <th>Documento</th>
            <th>Fecha</th>
            <th>Tercero</th>
            <th>ID Tercero</th>
            <th>Municipio</th>
            <th>Departamento</th>
            <th>Producto</th>
            <th>ID Producto</th>
            <th>Unidades</th>
            <th>Valor unitario</th>
            <th>Venta bruta</th>
          </tr>
        </thead>
        <tbody className='table-group-divider'>
          {
            (data.length === 0)
              ? (<tr><td colSpan={11} className='text-center'>No hay datos para mostrar, por favor cargue todos los informes</td></tr>)
              : (
                  salesData.map((el, index) => (
                    <tr key={index}>
                      <td> {el.vendedor}</td>
                      <td>{el.doc}</td>
                      <td>{convertExcelDateToReadable(el.fecha)}</td>
                      <td>{el.cliente}</td>
                      <td>{el.idTercero}</td>
                      <td>{el.ciudadTercero}</td>
                      <td>{el.departamentoTercero}</td>
                      <td>{el.producto}</td>
                      <td>{el.idProducto}</td>
                      <td>{el.unidades}</td>
                      <td>{currencyFormat(el.unitarioVentas)}</td>
                      <td>{currencyFormat(el.ventas)}</td>
                    </tr>
                  ))
                )
          }
        </tbody>
      </table>
    </div>
  )
}

export default TableAnalytics
