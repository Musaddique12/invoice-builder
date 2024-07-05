import React, { useRef, useState } from 'react'
import { auth, firestore_database, storage } from '../../Firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

const Setting = () => {
  const fileInputRef = useRef(null)

  const [email, setEmail] = useState(localStorage.getItem('email'));
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState(localStorage.getItem('Com_name'));
  const [imgUrl, setImgUrl] = useState(localStorage.getItem('Photo_url'));
  const [file, setFile] = useState(null);

  const onSetFile = (e) => {
    setFile(e.target.files[0])
    setImgUrl(URL.createObjectURL(e.target.files[0]))
  }

  const updateLogo = () => {
    const fileRef = ref(storage, localStorage.getItem('Photo_url'))
    console.log(fileRef._location.path_)

    const storageRef = ref(storage, fileRef._location.path)
    uploadBytesResumable(storageRef, file)
      .then(result => {
        window.location.reload()
      })
  }


  const updateCompanyDetail=()=>{
    updateProfile(auth.currentUser,{
      displayName:company
    })
    .then(result => {
      localStorage.setItem('Com_name',company)
      // localStorage.setItem('email',email)

      updateDoc(doc(firestore_database,'user',localStorage.getItem('uid')),{
        compane_name:company,
        // email:email
      })
      .then(res=>{
        window.location.reload()
      })
    })
  }

  return (
    <div>
      <div className='setting-wrapper'>
        <div className='profile-info update-cName'>
          <img onClick={() => { fileInputRef.current.click() }} className='' src={imgUrl} alt='Profile Pic' />
          <input onChange={(e) => { onSetFile(e) }} style={{ display: 'none' }} type='file' ref={fileInputRef} />
          {file && <button onClick={updateLogo} style={{width:'30%',backgroundColor:'hotpink'}}>update profilr pic</button>}
        </div>

        <div className='update-cName'>
            <input onChange={(e)=>{setCompany(e.target.value)}} type='text' placeholder='Company name' value={company}/>
            {/* <input onChange={(e)=>{setEmail(e.target.value)}} type='text' placeholder='email' value={email}/> */}
            <button onClick={updateCompanyDetail}>update detail</button>
        </div>

      </div>
    </div>
  )
}

export default Setting