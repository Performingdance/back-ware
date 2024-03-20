import React, { useEffect, useState } from "react"
import axios from '../apis/backWare';
import authHeader from '../services/auth-header';

export default function UploadAndDisplayImage () {

  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div>
      <h1>Upload image</h1>

      {selectedImage && (
        <div>
          <img
            alt="not found"
            width={"250px"}
            src={URL.createObjectURL(selectedImage)}
          />
          <br />
          <button onClick={() => setSelectedImage(null)}>Remove</button>
        </div>
      )}

      <br />
      <br />
      
      <input
        type="file"
        name="myImage"
        onChange={(event) => {
          console.log(event.target.files[0].name);
          setSelectedImage(event.target.files[0]);
        }}
      />
    </div>
  );
};


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
