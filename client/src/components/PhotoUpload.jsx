import React, { useEffect, useState } from "react"
import axios from '../apis/backWare';
import authHeader from '../services/auth-header';
import fs from 'fs'
import path from "path";

export function FileUploadPopUp({
  onClickOK,
  btnOk,
  title,
  message
}){
  const [file, setFile] = useState();
  const [res, setRes] = useState([])
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    setFile(e.target.files[0])
  }
  //console.log(file)
  const handleUpload = () => {
    setLoading(true)
      axios({
          axiosInstance: axios,
          method: "POST",
          url:"/s/imgs/photoUpload",
          headers: {
              "authorization": authHeader(),
              "Content-Type": file.type,
              "Content-Length": `${file.size}`
          },
          body: {
            "image": file
          }
      }).then((response)=>{
        //console.log(response)
        setRes(response)
      }).catch((err) => {
          setError(err)
          //console.log(err);
      })

      setLoading(false)
      
  }



  return (
    <>
      {        
      <div key="pc" className='popup-card  '>
        <div key="pc-content" className='popup-card-content jc-c '>

            <div key="login_div" className="popup-title jc-c">
            <h3 key="title" >{title? title : ""}</h3>
            <input type="file" onChange={(e)=>setFile(e.target.files[0])} />
            <button onClick={()=> handleUpload()}>Hochladen</button>

            <div key={"pc_btn"} className='popup-card-btns'>
                <button key="pc_btn_ok" className='btn popup-card-btn' onClick={onClickOK} >{btnOk || "OK"}</button>
            </div>
          </div>
        </div>
      </div>}
      </>
    )

}


export function FileList () {
  const [files, setFiles] = useState([]);
  const [res, setRes] = useState([])
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleFileRequest () {
      setLoading(true)
      axios({
          axiosInstance: axios,
          method: "GET",
          url:"/s/imgs/all",
          headers: {
              "authorization": authHeader()
          },
      }).then((response)=>{
        console.log(response)
        setFiles(response.data.files)
          //console.log(res);
      }).catch((err) => {
          setError(err)
          //console.log(err);
      })

      setLoading(false)
      
  }
  useEffect(()=>handleFileRequest(),[]);

  return (
    <div>
      <h2>File List</h2>
      <ul>
        {files.map((file, index) => (
          <li key={index}>{file}</li>
        ))}
      </ul> 
    </div>
  );
};
