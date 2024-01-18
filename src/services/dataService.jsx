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

export { getSellerPerformance, createSellerPerformance, getDepartments, createMunicipality }
