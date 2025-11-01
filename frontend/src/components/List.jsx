import React, { useEffect, useState } from "react";
import '../style/list.css'
import { Link } from "react-router-dom";

export default function List() {
  const [taskData, setTaskData] = useState();
  const [selectedTask, setSelectedTask]= useState([]);

  useEffect(() => {
    getListData();
  }, []);

  const getListData = async() => {
    let list = await fetch ("http://localhost:3200/tasks",{
      credentials:"include",
    });
    list = await list.json();
    if (list.success) {
      console.log(list.result);
      setTaskData(list.result);
    }else{
      toast.error("Try after Sometime! ")
    }
  };

  const deleteTask=async(id)=>{
    let item = await fetch ("http://localhost:3200/delete/"+id,{method:'delete',credentials:'include'});
    item = await item.json();
    if (item.success) {
      getListData();
    }else{
      toast.error("Try after Sometime! ")
    }
  }

  const selectAll=(event)=> {
    if(event.target.checked) {
      let items = taskData.map((item)=>item._id)
      setSelectedTask(items)
    }else {
      setSelectedTask([])
    }
  }

  const selectSingleItem=(id)=>{
    if(selectedTask.includes(id)){
      let items = selectedTask.filter((item)=>item!=id);
      setSelectedTask([items])
    }else{
      setSelectedTask([id,...selectedTask])
    }
  }

  const deleteMulti=async()=> {
    console.log(selectedTask)
    let item = await fetch ("http://localhost:3200/delete-multi/",
      {method:'delete',
        body:JSON.stringify(selectedTask),
        credentials:'include',
        headers:{
          'Content-Type':'Application/JSON'
        }
      });

    item = await item.json();
    if (item.success) {
      getListData();
    }else{
      toast.error("Try after Sometime! ")
    }
  }

  return (
    <div className="list-container">
      <h1>To Do List</h1>
      <button onClick={deleteMulti} className="delete-item delete-multi">Delete</button>
      <ul className="task-list">
        <li className="list-header"><input onChange={selectAll} type="checkbox" /></li>
        <li className="list-header">S.No</li>
        <li className="list-header">Title</li>
        <li className="list-header">Description</li>
        <li className="list-header">Action</li>

        {
        taskData && taskData.map((item,index) => {
          return (
          <React.Fragment key={item.id || index}>
            <li className="list-item"><input onChange={()=>selectSingleItem(item._id)} checked={selectedTask.includes(item._id)} type="checkbox" /></li>
            <li className="list-item">{index+1}</li>
            <li className="list-item">{item.title}</li>
            <li className="list-item">{item.description}</li>
            <li className="list-item"><button onClick={()=>deleteTask(item._id)} className="delete-item">Delete</button>
            <Link to={"update/"+item._id} className="update-item">Update</Link></li>
          </React.Fragment>
          )
        })
        }
      </ul>
    </div>
  );
}
