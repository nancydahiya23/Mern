import React, { useEffect, useState } from 'react'
import '../style/addtask.css'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

export default function Login() {

    const [userData,setUserData] = useState()
    const navigate = useNavigate();

    useEffect(()=>{
        if(localStorage.getItem('login')){
            navigate("/")
        }
    })

    const handlelogin=async()=> {
        let response = await fetch ('http://localhost:3200/login',{
            method:'POST',
            body:JSON.stringify(userData),
            headers:{
                'Content-Type':'Application/JSON'
            }
        })
        response= await response.json()
        if(response.success) {
            toast.success("User login! ")
            console.log(response);
            document.cookie='token='+response.token;
            localStorage.setItem('login',userData.email)
            window.dispatchEvent(new Event('localStorage-change'))
            navigate("/")
        }else{
            toast.error("Try after Sometime! ");
        }
    }
    
  return (
    <div className='container'>
        <h1>Login</h1>
            
            <label>Email</label>
            <input onChange={(event)=>setUserData({...userData,email:event.target.value})}  type="text" placeholder='Enter Email' name='email' />
    
            <label>Password</label>
            <input onChange={(event)=>setUserData({...userData,password:event.target.value})}  type="password" placeholder='Enter Password' name='password' />
            
            <button onClick={handlelogin}  className='submit'>Login</button>
            <p className='account'>Doesn't have an account? <Link className='link' to="/signup">SignUp</Link></p>
    </div>
  )
}
