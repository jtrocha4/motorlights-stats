import axios from 'axios'
const baseUrl = import.meta.env.VITE_URL_MONGODB

const login = async (credential) => {
  const response = await axios.post(`${baseUrl}/api/login`, credential)
  return response.data
}

export { login }
