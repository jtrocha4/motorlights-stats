import axios from 'axios'
const baseUrl = 'https://motorlights-api.vercel.app'

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

const getDepartment = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/departments`)
    return response.data
  } catch (error) {
    console.error(error)
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

const getSeller = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/sellers`)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export { getSellerPerformance, createSellerPerformance, getDepartment, createNewSeller, getSeller }
