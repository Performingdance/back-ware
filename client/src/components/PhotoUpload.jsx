import React, { useState } from "react";

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
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('/s/imgs/all'); // Assuming your server is running on the same host and port 3000
        setFiles(response.data.files);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFiles();
  }, []);
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
