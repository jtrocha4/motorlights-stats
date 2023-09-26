import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/data'

const getData = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNewData = async (newData) => {
  const request = await axios.post(baseUrl, newData)
  return request.data
}

export { getData, createNewData }
