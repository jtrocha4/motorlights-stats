import React, { useContext, useState } from 'react'
import Swal from 'sweetalert2'
import { UserContext } from '../../context/user'

const ButtonUploadDb = ({ title, background = 'primary', data = [], sales = [], customers = [], sellers = [], products = [], postFunction }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { user, setUser } = useContext(UserContext)
  const { token } = user

  const leakedData = []

  if (customers.length > 0 && sales.length === 0 && sellers.length === 0 && products.length === 0) {
    customers.forEach(element => {
      const { ciudad, id, telefonos, ...restOfData } = element
      leakedData.push({
        ...restOfData,
        identificacion: id,
        telefono: telefonos,
        municipio: ciudad
      })
    })
  }

  if (sales.length > 0 && customers.length > 0 && sellers.length > 0 && products.length > 0) {
    sales.forEach(element => {
      const matchingSeller = sellers.find(seller => seller.identificacion === element.vendedor)
      const matchingCustomer = customers.find(customer => customer.identificacion === element.idCliente)
      const matchingProduct = products.find(product => product.codigo === element.idProducto)

      if (matchingSeller && matchingCustomer && matchingProduct) {
        const saleDate = new Date(element.fecha)
        leakedData.push({
          codigoDeFactura: element.doc,
          fecha: saleDate,
          mes: saleDate.getMonth(),
          anio: saleDate.getFullYear(),
          idVendedor: matchingSeller.id,
          idCliente: matchingCustomer.id,
          idProducto: matchingProduct.id,
          metodoDePago: element.formaDePago,
          cantidad: element.unidadesProducto,
          valorUnitario: element.valorUnitario,
          ventaBruta: element.ventaBruta,
          descuento: element.descuento,
          ventaNeta: element.ventaNeta,
          iva: element.iva,
          valorTotal: element.valorTotal
        })
      }
    })
  }

  if (products.length > 0 && sales.length === 0 && customers.length === 0 && sellers.length === 0) {
    products.forEach(element => {
      leakedData.push(element)
    })
  }

  const handleUploadDb = async () => {
    Swal.fire({
      title: '¿Seguro que deseas guardar esta información?',
      text: 'Por favor revise la informacion antes de subirla al servidor',
      icon: 'warning',
      showDenyButton: true,
      confirmButtonColor: '#3085d6',
      denyButtonColor: '#6e7881',
      denyButtonText: 'Cancelar',
      confirmButtonText: 'Guardar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (leakedData.length > 0) {
          try {
            setIsLoading(true)
            for (const key in leakedData) {
              await postFunction(leakedData[key], token)
            }
            Swal.fire({
              title: 'Los datos se han guardado con éxito.',
              icon: 'success'
            })
            setIsLoading(false)
          } catch (error) {
            console.log(error)
            if (error.response.data.error === 'authorization required, token has expired') {
              Swal.fire({
                title: 'Tu sesión ha expirado.',
                text: 'Por favor, vuelve a iniciar sesión.',
                icon: 'warning'
              }).then((result) => {
                if (result.isConfirmed) {
                  setUser(null)
                  window.localStorage.removeItem('loggedApp')
                }
              })
              setIsLoading(false)
            } else {
              Swal.fire({
                title: 'Lo sentimos, ha ocurrido un error al guardar los datos.',
                text: 'Por favor, asegúrese de haber cargado todos los informes necesarios.',
                icon: 'error'
              })
              setIsLoading(false)
            }
          }
        } else {
          Swal.fire({
            title: 'Lo sentimos, ha ocurrido un error al guardar los datos.',
            text: 'Por favor, asegúrese de haber cargado todos los informes necesarios.',
            icon: 'error'
          })
          setIsLoading(false)
        }
      }
    })
  }

  return (
    <div>
      <button type='button' className={`btn btn-outline-${background}`} onClick={handleUploadDb}>
        {
          (isLoading === false)
            ? (
              <div>
                <i className='fa-solid fa-cloud-arrow-up me-1' />
                {title}
              </div>
              )
            : (
              <div>
                <span className='spinner-border spinner-border-sm me-1' aria-hidden='true' />
                <span role='status'> Subiendo informacion...</span>
              </div>
              )
        }
      </button>
    </div>
  )
}

export default ButtonUploadDb
