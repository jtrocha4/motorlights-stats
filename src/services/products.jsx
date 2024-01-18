import axios from 'axios'
const baseUrl = import.meta.env.VITE_URL_MONGODB

const getProducts = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  try {
    const response = await axios.get(`${baseUrl}/api/products`, config)
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

const createNewProduct = async (newProduct, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  try {
    const response = await axios.post(`${baseUrl}/api/products`, newProduct, config)
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

export { getProducts, createNewProduct }
