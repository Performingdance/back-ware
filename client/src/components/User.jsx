import React, { useEffect, useState } from 'react'
import "../styles/User.css"
import SVGIcon from './SVG'
import pencil_square from '../assets/icons/pencil-square.svg'
import handleUsersRequest from '../hooks/users/handleUserRequest'
import { LabelInput } from './LabelBox'

export default function EditUser() {

    const [edit, setEdit] = useState(-1);
    const [updateUsers, setUpdateUsers] = useState(0)
    const [users,errUsers, loadingUsers, handleURequest] = handleUsersRequest();
    useEffect(()=>handleURequest(),[updateUsers])

    let editUserRef = useRef({
        ID: -1,
        name:"",
        email:"",
        role:""
    })
    const [delRes, setDelRes] = useState([])
    const [delError, setDelError] = useState("");
    const [delLoading, setDelLoading] = useState(false);

    const [updRes, setUpdRes] = useState([])
    const [updError, setUpdError] = useState("");
    const [updLoading, setUpdLoading] = useState(false);


    function handleSubmit(){
        if(editUserRef.ID == -1){return}
        setUpdLoading(true)
        axios({
            axiosInstance: axios,
            method: "PUT",
            url:"s/users/update",
            headers: {
                "authorization": authHeader()
            },
            data : {
                "userID": editUserRef.ID,
                "name": editUserRef.name,
                "email": editUserRef.email,
                "role": editUserRef.role
            }
        }).then((response)=>{
            setUpdRes(response.data)
            console.log(response.data);
            setUpdateUsers(updateUsers+1)
        }).catch((err) => {
            errorHandling(err)
            setUpdError(err)
            //console.log(err);
        })
    
        setDelLoading(false)
    
      }

    function handleUserDelete(ID){
        setDelLoading(true)
        axios({
            axiosInstance: axios,
            method: "DELETE",
            url:"s/users/delete",
            headers: {
                "authorization": authHeader()
            },
            data : {
                "userID": ID,
            }
        }).then((response)=>{
            setDelRes(response.data)
            console.log(response.data);
            setUpdateUsers(updateUsers+1);
        }).catch((err) => {
            errorHandling(err)
            setDelError(err)
            //console.log(err);
        })
    
        setDelLoading(false)
    
      }

  return (
    <div className='users-wrapper'>
      {users&& users.map((user, key)=>{
        if(edit == user.ID){
            editUserRef.ID = user.ID
            editUserRef.name = user.name
            editUserRef.email = user.email
            editUserRef.role = user.role
        return(
        <div key={key+"user-edit-div"}>
            <LabelInput key={key+"user-name"} placeholder={user.name} onChange={(e)=>{editUserRef.name= e.target.value}}></LabelInput>
            <LabelInput key={key+"user-email"} placeholder={user.email} onChange={(e)=>{editUserRef.email= e.target.value}}></LabelInput>
            <p key={key+"user-role"}>{user.role}</p>
            <div key={key + "btns"} className='rc-btns' > 
                <button key={key + "del"} className='rc-btn' onClick={()=>handleUserDelete(user.ID)}>
                <SVGIcon class="svg-icon-md" src={trash}/>
                </button>
                <button key={key+ "cancel"} className='rc-btn ' onClick={()=> setEdit(-1)}>
                <SVGIcon class="svg-icon-md" src={x_circle}/>
                </button>
                <button key={key + "check"} className='rc-btn ' onClick={()=> [handleSubmit(),setEdit(-1)]}>
                <SVGIcon class="svg-icon-md" src={check}/>
                </button>
            </div>
        </div>
        )}else{
        return(
            <div key={key+"user-div"}>
            <p key={key+"user-name"}>{user.name}</p>
            <p key={key+"user-email"}>{user.email}</p>
            <p key={key+"user-role"}>{user.role}</p>
            <button key={form.ID + "edit"} className='rc-btn' onClick={()=>setEdit(user.ID)}>
                <SVGIcon class="svg-icon-md" src={pencil_square}/>
            </button>
        </div>)
        }
      })}

    </div>
  )
}


