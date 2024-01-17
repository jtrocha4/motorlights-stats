import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/login'
import { UserContext } from '../context/user'

const Login = () => {
  const [form, setForm] = useState({
    userName: '',
    password: ''
  })

  const [errorMessage, setErrorMessage] = useState(null)
  const [isHidePassword, setIsHidePassword] = useState(true)

  const navigate = useNavigate()

  const { setUser } = useContext(UserContext)

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const data = await login({
        nombreUsuario: form.userName,
        contrasena: form.password
      })
      setUser(data)
      navigate('/')
    } catch (error) {
      setErrorMessage('Usuario o contraseña no válidos')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleHidePassword = (event) => {
    const inputType = document.getElementById('password')
    if (inputType.type === 'password') {
      inputType.type = 'text'
      setIsHidePassword(false)
    } else {
      inputType.type = 'password'
      setIsHidePassword(true)
    }
  }

  return (
    <div className='div-login'>
      <section className='section-login'>
        <form action='' onSubmit={handleSubmit}>
          <div className='container-logo mb-4'>
            <img className='logo' src='src\assets\banner-motorlights.png' alt='' />
          </div>

          {
            (errorMessage !== null)
              ? (
                <div className='alert alert-danger' role='alert'>
                  {errorMessage}
                </div>
                )
              : ('')
          }

          <div className='mb-3'>
            <label className='form-label' htmlFor='userName'>Usuario</label>
            <input className='form-control' name='userName' id='userName' type='text' onChange={handleChange} />
          </div>
          <div className='mb-3'>
            <label className='form-label' htmlFor='password'>Contraseña</label>
            <div className='input-group mb-3'>
              <input className='form-control' name='password' id='password' type='password' onChange={handleChange} />
              <button className='btn btn-outline-dark' type='button' onClick={handleHidePassword}>
                {
                (isHidePassword) ? (<i className='fa-regular fa-eye' />) : (<i className='fa-regular fa-eye-slash' />)
              }
              </button>
            </div>
          </div>
          <div className='d-grid gap-2'>
            <button className='btn btn-primary'>Iniciar sesión</button>
          </div>
          <hr />
          <a href=''><p className='text-center'>¿Olvidaste tu contraseña?</p></a>
        </form>
      </section>
    </div>
  )
}

export default Login
