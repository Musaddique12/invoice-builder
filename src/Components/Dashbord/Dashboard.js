import React from 'react'
import './Dashboard.css'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../../Firebase'
const Dashboard = () => {

    const navigate = useNavigate()

    const logout = ()=>{
        signOut(auth).then(()=>{
            localStorage.clear()
            navigate('/login')
        })
        .catch((err)=>{
            console.log(err)
        })
    }

  return (
    <div className='dashboard-wrapper'>
        <div className='side-nav'>
            <div className='profile-info'>
                <img src={localStorage.getItem('Photo_url')}></img>
                <div>
                    <p>{localStorage.getItem('Com_name')}</p>
                    <button onClick={logout}>Logout</button>
                </div>
            </div><hr/>
           <div className='menu'>
           <Link to='/dashboard/home' className='menu-link'>  <i class="fa-solid fa-house"></i> Home</Link>
            <Link to='/dashboard/invoices' className='menu-link'> <i class="fa-solid fa-file-invoice"></i>  Invoices</Link>
            <Link to='/dashboard/new-invoice' className='menu-link'> <i class="fa-solid fa-file-circle-plus"></i> New Invoice</Link>
            <Link to='/dashboard/setting' className='menu-link'> <i class="fa-solid fa-gear"></i> Setting</Link>
           </div>
        </div>

        <div className='main-container'>
            <Outlet/>
        </div>
    </div>
  )
}

export default Dashboard