import React from 'react'
import './Register.css'

function Register() {
  return (
    <div className='Register'>
      <div className='columnRegister column1Register'>
      </div>
      <div className='columnRegister column2Register'>
        <form className='registerForm'>
          <h2>Regístrate</h2>
          <label>
            Nombre:
            <input type="text" name="name" required autoComplete="off"/>
          </label>
          <label>
            Correo Electrónico:
            <input type="email" name="email" required autoComplete="off"/>
          </label>
          <label>
            Contraseña:
            <input type="password" name="password" required />
          </label>
          <label>
            Confirmar Contraseña:
            <input type="password" name="confirmPassword" required />
          </label>
          <button type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  )
}

export default Register
