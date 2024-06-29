import React, { useEffect, useState, useRef } from 'react';
import "../styles/User.css";
import SVGIcon from './SVG';
import pencil_square from '../assets/icons/pencil-square.svg';
import trash from '../assets/icons/trash.svg';
import check from '../assets/icons/check.svg';
import x_circle from '../assets/icons/x-circle.svg';
import handleUsersRequest from '../hooks/users/handleUserRequest';
import LabelBox, { LabelInput } from './LabelBox';
import Loading from './Loading';
import errorHandling from '../services/errorHandling';
import axios from '../apis/backWare';
import authHeader from '../services/auth-header';

export default function EditUser() {

    const [edit, setEdit] = useState(-1);
    const [updateUsers, setUpdateUsers] = useState(0)
    const [users,errUsers, loadingUsers, handleURequest] = handleUsersRequest();
    useEffect(()=>handleURequest(),[updateUsers])

    let editUserRef = useRef({
        ID: -1,
        username:"",
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
                "name": editUserRef.username,
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
    {errUsers && <p className='errorMsg'>{errUsers.mesage}</p>}
      {(users)&& users.map((user, key)=>{
        if(edit == editUserRef.ID){
            editUserRef.ID = user.ID
            editUserRef.username = user.username
            editUserRef.email = user.email
            editUserRef.role = user.role
        return(
        <div key={key+"user-edit-div"} className='user-edit-div'>
            <LabelInput key={key+"user-name"} class="user-input" title="Name" placeholder={user.username} onChange={(e)=>{editUserRef.username= e.target.value}}></LabelInput>
            <LabelInput key={key+"user-email"} class="user-input" title="Email" placeholder={user.email} onChange={(e)=>{editUserRef.email= e.target.value}}></LabelInput>
            <p key={key+"user-role"}>{user.role}</p>
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
        )}else{
        return(
            <div key={key+"user-div"} className='user-div'>
            <LabelBox key={key+"user-name"} title="Name" text={user.username || "-"}></LabelBox>
            <LabelBox key={key+"user-email"} title="Email" text={user.email || "-"}></LabelBox>
            <LabelBox key={key+"user-role"} title="Rolle" text={user.role || "-"}></LabelBox>
            <button key={key + "edit"} className='rc-btn' onClick={()=>{setEdit(user.ID), editUserRef.ID = user.ID}}>
                <SVGIcon class="svg-icon-md" src={pencil_square}/>
            </button>
        </div>)
        }
      })}
        {loadingUsers && <Loading/>}
    </div> 
  )
}


