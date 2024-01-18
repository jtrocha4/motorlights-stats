import axios from 'axios'
const baseUrl = import.meta.env.VITE_URL_MONGODB

const getSellers = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  try {
    const response = await axios.get(`${baseUrl}/api/sellers`, config)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

const createNewSeller = async (newSeller, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  try {
    const response = await axios.post(`${baseUrl}/api/sellers`, newSeller, config)
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

const deleteSeller = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  try {
    const response = await axios.delete(`${baseUrl}/api/sellers/${id}`, config)
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

const editSeller = async (id, sellerData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  try {
    const response = await axios.put(`${baseUrl}/api/sellers/${id}`, sellerData, config)
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

export { createNewSeller, getSellers, deleteSeller, editSeller }
