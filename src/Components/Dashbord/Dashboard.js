import React, { useState } from 'react';
import './Dashboard.css';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../Firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faFileInvoice, faFileCirclePlus, faGear, faPlusCircle, faBoxOpen } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
    const location = useLocation();
    const [invoice_type, setInvoiceType] = useState(location.state);
    const navigate = useNavigate();

    const logout = () => {
        signOut(auth).then(() => {
            localStorage.clear();
            navigate('/login');
        }).catch((err) => {
            console.log(err);
        });
    };

    return (
        <div className='dashboard-wrapper'>
            <div className='side-nav'>
                <div className='profile-info'>
                    <img src={localStorage.getItem('Photo_url')} alt='Profile' />
                    <div>
                        <p>{localStorage.getItem('Com_name')}</p>
                        <button onClick={logout}>Logout</button>
                    </div>
                </div>
                <hr />
                <div className='menu'>
                    <Link to='/dashboard/home' className='menu-link'>
                        <FontAwesomeIcon icon={faHouse} /> Home
                    </Link>
                    {invoice_type === 'buy' ? (
                        <>
                            <Link to='/dashboard/add' className='menu-link'>
                                <FontAwesomeIcon icon={faPlusCircle} /> Add
                            </Link>
                            <Link to='/dashboard/show' className='menu-link'>
                                <FontAwesomeIcon icon={faBoxOpen} /> Show Product
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to='/dashboard/invoices' className='menu-link'>
                                <FontAwesomeIcon icon={faFileInvoice} /> Invoices
                            </Link>
                            <Link to='/dashboard/new-invoice' className='menu-link'>
                                <FontAwesomeIcon icon={faFileCirclePlus} /> New Invoice
                            </Link>
                        </>
                    )}
                    <Link to='/dashboard/setting' className='menu-link'>
                        <FontAwesomeIcon icon={faGear} /> Setting
                    </Link>
                </div>
            </div>
            <div className='main-container'>
                <Outlet />
            </div>
        </div>
    );
};

export default Dashboard;
