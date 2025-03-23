import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'
import logo from '../assets/money-logo.svg'

function Login() {
  const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault()
        if(e.target.username.value === 'yashwantnagarkar04@gmail.com' && e.target.password.value === 'Yjn@270304') {
            localStorage.setItem('token', 'true')
            // alert('Login Successful');
            navigate('/');

        } else {
            alert('Invalid Credentials')
        }
    }
  return (
    <div className='Login'>
        <div className="login-container">
          <img src={logo} alt="logo" className='logo-login' />
        <h1>Login</h1>
        <form className="login-form" onSubmit={handleSubmit}>
            <input className='login-input' type="text" name='username' placeholder="Username" />
            <input className='login-input' type="password" name='password' placeholder="Password" />
            <button>Login</button>
        </form>
        </div>
    </div>
  )
}

export default Login