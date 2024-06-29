import React, { useEffect } from 'react'
import "../styles/User.css"
import SVGIcon from './SVG'
import pencil_square from '../assets/icons/pencil-square.svg'
import handleUsersRequest from '../hooks/users/handleUserRequest'

export default function EditUser() {

    const [users,errUsers, loadingUsers, handleURequest] = handleUsersRequest();
    useEffect(()=>handleURequest(),[])

  return (
    <div className='user-wrapper'>
      

    </div>
  )
}
