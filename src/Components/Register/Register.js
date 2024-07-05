import React, { useRef, useState } from 'react';
import '../Login/login.css';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, firestore_database, storage } from '../../Firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';


const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [img, setImg] = useState('');
  const [img_priview,setImg_preview] = useState(null);
  const [isLoading,setLoading] = useState(false)

  const navigate=useNavigate()

  const fileInputRef = useRef(null)

  const setFile = (e)=>{
    setImg(e.target.files[0])
    setImg_preview(URL.createObjectURL(e.target.files[0]))
  }

  //create user on form submit
  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true)
    console.log(email, password)

    createUserWithEmailAndPassword(auth, email, password)
      .then(newUSer => {
        console.log(newUSer)

        const date = new Date().getTime()

        const imgref = ref(storage, `${date + company}`)
        uploadBytesResumable(imgref, img)
          .then(res => {
            console.log(res)
            getDownloadURL(imgref)
              .then(imgUrl => {
                console.log(imgUrl)

                updateProfile(newUSer.user, {
                  displayName: company,
                  photoURL: imgUrl
                })

                setDoc(doc(firestore_database, "user", newUSer.user.uid), {
                  uid: newUSer.user.uid,
                  compane_name: company,
                  email: email,
                  photoURL: imgUrl
                })

                localStorage.setItem('Com_name',company)
                localStorage.setItem('Photo_url',imgUrl)
                localStorage.setItem('email',email)
                localStorage.setItem('uid',newUSer.user.uid)
                navigate('/dashboard')
                setLoading(false)
              })
          }).catch(error=>{
                console.log(error)
                setLoading(false)
              })
      })
      .catch(err => {
        setLoading(false)
        console.log(err)
      })
  }

  return (
    <div className='login-wrapper'>
      <div className='login-container'>
        <div className='login-left'>
          {/* The background image is set in the CSS */}
        </div>
        <div className='login-right'>
          <h2 className='login-header'>Register</h2>
          <form onSubmit={submitHandler}>
            <input onChange={(e) => { setEmail(e.target.value) }} className='login-input' type='email' placeholder='Email'required />
            <input onChange={(e) => { setCompany(e.target.value) }} className='login-input' type='text' placeholder='Company Name'required />
            <input onChange={(e) => {setFile(e)}} style={{ display: 'none' }} className='login-input' type='file' ref={fileInputRef} required/>
            <input onChange={(e) => { setPassword(e.target.value) }} className='login-input' type='password' placeholder='Password' required/>
            <button className='login-input' type='button' onClick={() => { fileInputRef.current.click() }}>Select You Logo</button>
           { img_priview != null &&
            <img className='img-pre' src={img_priview} alt='image preview'/>}
            <button className='login-input' type='submit'>Submit {isLoading && <i class="fa-solid fa-spinner fa-spin-pulse"></i>}</button>
          </form>
          <p>
            <Link to='/login'>Login and account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
