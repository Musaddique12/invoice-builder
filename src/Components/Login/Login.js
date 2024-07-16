import { useState } from 'react';
import './login.css';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../Firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading,setLoading] = useState(false)

const navigate = useNavigate()
  const submitHandler= (event)=>{
    setLoading(true)
    event.preventDefault()

    signInWithEmailAndPassword(auth,email,password)
    .then(res=>{
      const user = res.user;
      console.log(user)
      localStorage.setItem('Com_name',user.displayName)
      localStorage.setItem('Photo_url',user.photoURL)
      localStorage.setItem('email',user.email)
      localStorage.setItem('uid',user.uid)

      navigate('/choice')
      setLoading(false)
    })
    .catch(err=>{
      console.log(err)
      setLoading(false)
    })
  }

  return (
    <div className='login-wrapper'>
      <div className='login-container'>
        <div className='login-left'>
          {/* The background image is set in the CSS */}
        </div>
        <div className='login-right'>
          <h2 className='login-header'>Login</h2>
          <form onSubmit={submitHandler}>
            <input onChange={(e) => { setEmail(e.target.value) }} className='login-input' type='email' placeholder='Email' required/>
            <input onChange={(e) => { setPassword(e.target.value) }} className='login-input' type='password' placeholder='Password' required/>
            <button className='login-input' type='submit'>Submit {isLoading && <i class="fa-solid fa-spinner fa-spin-pulse"></i>}</button>
          </form>
          <p className='p'>
            <Link to='/register'>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
