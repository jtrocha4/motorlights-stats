import axios from 'axios'
const baseUrl = import.meta.env.VITE_URL_MONGODB

const login = async (credential) => {
  try {
    const response = await axios.post(`${baseUrl}/api/login`, credential)
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error('Error en la autentificacion. Usuario o contraseña no válidos')
    throw error
  }
}

export { login }
