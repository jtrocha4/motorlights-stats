import axios from 'axios'
const baseUrl = import.meta.env.VITE_URL_MONGODB

const getCustomers = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  try {
    const response = await axios.get(`${baseUrl}/api/customers`, config)
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

const createNewCustomer = async (newCustomer, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  try {
    const response = await axios.post(`${baseUrl}/api/customers`, newCustomer, config)
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

export { getCustomers, createNewCustomer }
