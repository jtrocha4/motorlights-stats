import axios from 'axios'
const baseUrl = 'https://motorlights-api.vercel.app'

const getData = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/data`)
    return response.data
  } catch (error) {
    throw new Error(error)
  }
}

const createNewData = async (newData) => {
  try {
    const request = await axios.post(`${baseUrl}/api/data`, newData)
    return { message: 'Los datos se han guardado con éxito', request }
  } catch (error) {
    throw new Error(error)
  }
}

export { getData, createNewData }
