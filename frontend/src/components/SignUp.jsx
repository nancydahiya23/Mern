import React, { useState, useEffect } from 'react'
import '../style/addtask.css'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

export default function SignUp() {

    const [userData,setUserData] = useState()
    const navigate = useNavigate();

    useEffect(()=>{
            if(localStorage.getItem('login')){
                navigate("/")
            }
        })

    const handleSignUp=async()=> {
        let response = await fetch ('http://localhost:3200/signup',{
            method:'POST',
            body:JSON.stringify(userData),
            headers:{
                'Content-Type':'Application/JSON'
            }
        })
        response= await response.json()
        if(response.success) {
            toast.success("New user added")
            console.log(response);
            document.cookie='token='+response.token
            localStorage.setItem('login',userData.email)
            navigate("/")
        }else {
            toast.error("Try after Sometime! ")
        }
    }
    
  return (

    <div className='container'>
        <h1>Sign Up</h1>
            <label>Name</label>
            <input onChange={(event)=>setUserData({...userData,name:event.target.value})}  type="text" placeholder='Enter Username' name='name' />
            
            <label>Email</label>
            <input onChange={(event)=>setUserData({...userData,email:event.target.value})}  type="text" placeholder='Enter Email' name='email' />
    
            <label>Password</label>
            <input onChange={(event)=>setUserData({...userData,password:event.target.value})}  type="password" placeholder='Enter Password' name='password' />
            
            <button onClick={handleSignUp}  className='submit'>Sign Up</button>
            <p className='account'>Already have an account? <Link className='link' to="/login" >Login</Link></p>
    </div>
  )
}
