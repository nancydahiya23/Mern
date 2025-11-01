import React, { useState } from 'react'
import '../style/addtask.css'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AddTask() {
    const [taskData,setTaskData] = useState();
    const navigate = useNavigate();
    const handleaddTask=async()=>{
        console.log(taskData);
        let result = await fetch ('http://localhost:3200/add-task',{
            method:'POST',
            body:JSON.stringify(taskData),
            credentials:'include',
            headers:{
                'Content-Type':'Application/JSON'
            }
        })
        result= await result.json()
        if(result.success) {
            toast.success("New Task Added!")
            navigate("/");
            console.log("new task added");
        }else {
            toast.error("Try after Sometime! ")
        }
    }
  return (
    <div className='container'>
        <h1>Add New Task</h1>
            <label>Title</label>
            <input onChange={(e)=>setTaskData({...taskData,title:e.target.value})} type="text" placeholder='Enter Task Title' name='title' />
            <br /><br />
            <label>Description</label>
            <textarea onChange={(e)=>setTaskData({...taskData,description:e.target.value})} rows={4} name='description' placeholder='Enter Task Description' id=""></textarea>
            <button onClick={handleaddTask} className='submit'>Add New Task</button>
    </div>
  )
}
