import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from './context/data'
import { ThirdPartiesContext } from './context/thirdParties'

const TableAnalytics = ({ dataSaleItem, convertExcelDateToReadable, currencyFormat, department }) => {
  const { excelDataCost } = useContext(DataContext)
  const { excelDataThirdParties, thirdPartiesData } = useContext(ThirdPartiesContext)
  const [salesData, setSalesData] = useState([])
  const [uniqueCustomers, setUniqueCustomers] = useState([])

  const productCategory = (product) => {
    if (product.includes('Alarma')) return 'Alarmas'
    if (product.includes('Bombillo Farola')) return 'Bombillos de Faro'
    if (product.includes('Bombillo Stop') || product.includes('Bombilllo Stop')) return 'Bombillos de Stop'
    if (product.includes('Bombillo Direccional') || product.includes('Direccionales') || product.includes('Bombillo Piloto') || product.includes('Direccional')) return 'Bombillos de Direccional'

    if (product.includes('Bombillo Techo')) return 'Bombillos de Techo'
    if (product.includes('Lagrima')) return 'Lagrimas'
    if (product.includes('Exploradora') || product.includes('Explorador')) return 'Exploradoras'

    if (product.includes('Switche') || product.includes('Terminal') || product.includes('Socket') || product.includes('Fusible') || product.includes('Flasher')) { return 'Electricos' }

    if (product.includes('Protector') || product.includes('Maniguetas')) return 'Protectores'
    if (product.includes('Tornillo')) return 'Tornillos'
    if (product.includes('Modulo Led') || product.includes('Modulo')) return 'Modulos LED'
    if (product.includes('Cinta Led') || product.includes('Modulo') || product.includes('Amarra') || product.includes('Luz Maletero') || product.includes('Ojo')) return 'Otros'
    if (product.includes('Guardabarros')) return 'Guardabarros'
    if (product.includes('Lubricante')) return 'Linea de Mtto'
    if (product.includes('Guardapolvo')) return 'Guardapolvos'

    return 'Sin Categoria'
  }

  const extractIdNumber = (string) => {
    const regex = /\d+/
    const id = string.match(regex)
    if (id !== null) {
      return id[0]
    } else {
      console.error('the string must contain numbers')
    }
  }

  const extractText = (string) => {
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
      const department = municipality ? municipality.nombre : 'n/a'
      return {
        ...cliente,
        departamento: department
      }
    })
    setUniqueCustomers(uniqueCustomersWithDepartment)
  }

  const addCategory = (salesData = []) => {
    const categorizedSalesData = salesData.map(el => {
      const category = productCategory(el.producto)
      return {
        ...el,
        categoriaProducto: category
      }
    })
    return categorizedSalesData
  }

  const extractSalesFromData = (dataArray = [], dataThirdParties = []) => {
    const sales = dataThirdParties.flatMap(customer =>
      dataArray.filter(element => element.itemsVendidos !== undefined)
        .map(element =>
          element.itemsVendidos.filter(el => {
            const idCustomer = extractIdNumber(el.cliente)
            return idCustomer === extractIdNumber(customer.id)
          }).map(({ fecha, cliente, descripcion, cantidad, ...restOfData }) => ({
            ...restOfData,
            fecha: convertExcelDateToReadable(fecha),
            cliente: extractText(cliente),
            idCliente: extractIdNumber(cliente),
            ciudadCliente: customer.ciudad,
            departamentoCliente: customer.departamento,
            idProducto: extractIdNumber(descripcion),
            producto: extractText(descripcion),
            unidadesProducto: cantidad
          }))
        )
        .flat()
    )
    const salesWithCategory = addCategory(sales)
    setSalesData(salesWithCategory)
  }

  useEffect(() => {
    extractUniqueThirdParties(thirdPartiesData, department)
  }, [excelDataCost, excelDataThirdParties])

  useEffect(() => {
    extractSalesFromData(dataSaleItem, uniqueCustomers)
  }, [uniqueCustomers])

  return (
    <div>
      <table className='table table-hover table-sm'>
        <thead>
          <tr>
            <th>Vendedor</th>
            <th>Documento</th>
            <th>Fecha</th>
            <th>ID Tercero</th>
            <th>Tercero</th>
            <th>Municipio</th>
            <th>Departamento</th>
            <th>ID Producto</th>
            <th>Producto</th>
            <th>Categoria Producto</th>
            <th>Unidades</th>
            <th>Valor unitario</th>
            <th>Venta bruta</th>
            <th>Descuento</th>
            <th>Venta Neta</th>
            <th>IVA</th>
            <th>Valor Total</th>
          </tr>
        </thead>
        <tbody className='table-group-divider'>
          {
            (dataSaleItem.length === 0)
              ? (<tr><td colSpan={17} className='text-center'>No hay datos para mostrar, por favor cargue todos los informes</td></tr>)
              : (
                  salesData.map((el, index) => (
                    <tr key={index}>
                      <td> {el.vendedor}</td>
                      <td>{el.doc}</td>
                      <td>{el.fecha}</td>
                      <td>{el.idCliente}</td>
                      <td>{el.cliente}</td>
                      <td>{el.ciudadCliente}</td>
                      <td>{el.departamentoCliente}</td>
                      <td>{el.idProducto}</td>
                      <td>{el.producto}</td>
                      <td>{el.categoriaProducto}</td>
                      <td>{el.unidadesProducto}</td>
                      <td>{currencyFormat(el.valorUnitario)}</td>
                      <td>{currencyFormat(el.ventaBruta)}</td>
                      <td>{currencyFormat(el.descuento)}</td>
                      <td>{currencyFormat(el.ventaNeta)}</td>
                      <td>{currencyFormat(el.iva)}</td>
                      <td>{currencyFormat(el.valorTotal)}</td>
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
