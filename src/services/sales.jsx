import axios from 'axios'
const baseUrl = import.meta.env.VITE_URL_MONGODB

const getSales = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  try {
    const response = await axios.get(`${baseUrl}/api/sales`, config)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

const createNewSale = async (newSale, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  try {
    const response = await axios.post(`${baseUrl}/api/sales`, newSale, config)
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

export { getSales, createNewSale }
