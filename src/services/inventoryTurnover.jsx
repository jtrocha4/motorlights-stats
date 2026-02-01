import axios from 'axios'
const baseUrl = import.meta.env.VITE_URL_MONGODB

const getInventoryTurnover = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  try {
    const response = await axios.get(`${baseUrl}/api/invetoryTurnover`, config)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

const postInventoryTurnover = async (newInventoryTurnover, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  try {
    const response = await axios.post(`${baseUrl}/api/invetoryTurnover`, newInventoryTurnover, config)
    if (response.status === 201) {
      return response.data
    } else {
      throw new Error('Error al añadir el artículo. Verifica los datos y vuelve a intentarlo.')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

const putInventoryTurnover = async (id, inventoryTurnoverData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  try {
    const response = await axios.put(`${baseUrl}/api/invetoryTurnover/${id}`, inventoryTurnoverData, config)
    if (response.status === 200) {
      return response.data
    } else {
      throw new Error('Error al editar el artículo de rotación de inventario. Verifica los datos y vuelve a intentarlo.')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

const deleteInventoryTurnover = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  try {
    const response = await axios.delete(`${baseUrl}/api/invetoryTurnover/${id}`, config)
    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export { getInventoryTurnover, postInventoryTurnover, putInventoryTurnover, deleteInventoryTurnover }
