import axios from 'axios'
const baseUrl = import.meta.env.VITE_URL_MONGODB

const getSellerPerformance = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/sellerPerformance`)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

const createSellerPerformance = async (newData) => {
  try {
    const response = await axios.post(`${baseUrl}/api/sellerPerformance`, newData)
    if (response.status === 201) {
      return response.data
    } else {
      throw new Error('Error en la creacion de la data. Verifica los datos y vuelve a intentarlo.')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

const getDepartments = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/departments`)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

const createMunicipality = async (newData) => {
  try {
    const response = await axios.post(`${baseUrl}/api/municipalities`, newData)
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

const createNewSeller = async (newSeller) => {
  try {
    const response = await axios.post(`${baseUrl}/api/sellers`, newSeller)
    if (response.status === 201) {
      return response.data
    } else {
      throw new Error('Error al crear el vendedor. Verifica los datos y vuelve a intentarlo.')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

const getSellers = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/sellers`)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

const deleteSeller = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/api/sellers/${id}`)
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

const editSeller = async (id, sellerData) => {
  try {
    const response = await axios.put(`${baseUrl}/api/sellers/${id}`, sellerData)
    if (response.status === 200) {
      return response.data
    } else {
      throw new Error('Error al editar el vendedor. Verifica los datos y vuelve a intentarlo.')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

const getCustomers = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/customers`)
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

const createNewCustomer = async (newCustomer) => {
  try {
    const response = await axios.post(`${baseUrl}/api/customers`, newCustomer)
    if (response.status === 201) {
      return response.data
    } else {
      throw new Error('Error al crear el cliente. Verifica los datos y vuelve a intentarlo.')
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

const getProducts = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/products`)
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

const createNewProduct = async (newProduct) => {
  try {
    const response = await axios.post(`${baseUrl}/api/products`, newProduct)
    if (response.status === 201) {
      return response.data
    } else {
      throw new Error('Error al crear el producto. Verifica los datos y vuelve a intentarlo.')
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

const createNewSale = async (newSale) => {
  try {
    const response = await axios.post(`${baseUrl}/api/sales`, newSale)
    if (response.status === 201) {
      return response.data
    } else {
      throw new Error('Error al crear la venta. Verifica los datos y vuelve a intentarlo.')
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export { getSellerPerformance, createSellerPerformance, getDepartments, createMunicipality, createNewSeller, getSellers, deleteSeller, editSeller, getCustomers, createNewCustomer, getProducts, createNewProduct, createNewSale }
