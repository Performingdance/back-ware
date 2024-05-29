import React, { useEffect, useState } from "react"
import axios from '../apis/backWare';
import authHeader from '../services/auth-header';
import config from '../config.json'






export function FileUploadPopUp({
  onClickOK,
  btnOk,
  title,
  productID,
  productImg
}){
  const [file, setFile] = useState();
  const [res, setRes] = useState("")
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  //console.log(file)
  const handleUpload = () => {
    if(!productID ){return}
    if(!file ){
      setError({message: "Foto auswählen"})
      return}

    setLoading(true)
    let formData = new FormData()
    formData.append("image", file);
    formData.append("productID", productID || -1);
    formData.append("oldImg", productImg || -1);

      axios({
          axiosInstance: axios,
          method: "POST",
          url:"/s/imgs/photoUpload",
          headers: {
              "authorization": authHeader(),
              "Content-Type": file.type,
              "Content-Length": `${file.size}`
          },
          data: formData
          
      }).then((response)=>{
        //console.log(response)
        setRes("Erfolgreich hochgeladen")
      }).catch((err) => {
          setError(err)
          //console.log(err);
      })

      setLoading(false)
      
  }

  const handleDefaultPhoto = () => {
    if(!productID){return}

    setLoading(true)
    let formData = new FormData()
    formData.append("image", "");
    formData.append("productID", productID || -1);
    formData.append("oldImg", productImg || -1);

      axios({
          axiosInstance: axios,
          method: "POST",
          url:"/s/imgs/photoDefault",
          headers: {
              "authorization": authHeader(),
          },
          data: formData
          
      }).then((response)=>{
        //console.log(response)
        setRes("Erfolgreich Zurückgesetzt")
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
            <div key="upload_div" className="popup-title jc-c">
            <h3 key="title" >{title? title : ""}</h3>
            <input type="file" onChange={(e)=>setFile(e.target.files[0])} />
            <br></br>
            <div className="d-il" >
            <button className="popup-card-btn" onClick={()=> handleUpload()}>Hochladen</button>
            <button className="popup-card-btn" onClick={()=>{handleDefaultPhoto()}}>Foto zurücksetzen</button>
            </div>
            
           
           {res && <h5 className="successMsg">{res}</h5>}
           {error.message && <h5 className="errorMsg">{error.message}</h5>}
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
        setFiles(response.data)
          //console.log(res);
      }).catch((err) => {
          setError(err)
          //console.log(err);
      })

      setLoading(false)
      
  }
  useEffect(()=>handleFileRequest(),[]);
console.log(files)
  return (
    <div>
      <h2>File List</h2>
      <ul>
        {/* {files.map((file, index) => (
          <li key={index}>{file}</li>
        ))} */}
      </ul> 
    </div>
  );
};
