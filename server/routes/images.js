const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/basicAuth.js');
const multer =  require('multer')
const path = require('path');
const db = require('../lib/db.js');
const fs = require('fs')
import {v2 as cloudinary} from 'cloudinary';
const REACT_APP_IMG_API_CLOUD_NAME = env.REACT_APP_IMG_API_CLOUD_NAME
const REACT_APP_IMG_API_KEY = env.REACT_APP_IMG_API_KEY
const REACT_APP_IMG_API_SECRET = env.REACT_APP_IMG_API_SECRET



let file_name


router.post('/photoUpload', isLoggedIn, (req, res) => {
  const productID = req.body.productID
  const oldImg = req.body.oldImg
  const image = req.body.image

  // Configuration
  cloudinary.config({ 
    cloud_name: REACT_APP_IMG_API_CLOUD_NAME, 
    api_key: REACT_APP_IMG_API_KEY, 
    api_secret: REACT_APP_IMG_API_SECRET // Click 'View Credentials' below to copy your API secret
});

  (async function() {

    console.log(image)

    file_name = Date.now() + path.extname(image.originalname)

    
    // Upload an image
    const uploadResult = await cloudinary.uploader.upload(file, {
        public_id: file_name,
    }).catch((error)=>{console.log(error)});
    
    console.log(uploadResult);
    
    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url("shoes", {
        fetch_format: 'auto',
        quality: 'auto'
    });
    
    console.log(optimizeUrl);
    
    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url("shoes", {
        crop: 'auto',
        gravity: 'auto',
        width: 500,
        height: 500,
    });
    
    console.log(autoCropUrl);    
})();
  // Remove old photo
  if (oldImg) {

  }
  db.query("UPDATE products SET img = ? WHERE ID = ? ",[file_name, productID], (err, result) =>{
    if(err){
       console.log(err)
    } else {
    }
});
  //console.log(req.body.image)
  res.send("success")
  });

router.post('/photoDefault', isLoggedIn, (req, res) => {
  const productID = req.body.productID
  const oldImg = req.body.oldImg
  // Remove old photo
  if (oldImg) {
    const oldPath = path.join("/var/lib/data/recipe_imgs/", oldImg);
    if (fs.existsSync(oldPath)) {
      fs.unlink(oldPath, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        res.status(200).send(userObj);
      });
    }
  }
  db.query("UPDATE products SET img = ? WHERE ID = ? ",["NULL", productID], (err, result) =>{
    if(err){
        console.log(err)
    } else {
    }
});
  //console.log(req.body.image)
  res.send("success")
  });
  
router.get('/all', isLoggedIn, (req, res) => {
  
  const folderPath = '/var/lib/data/recipe_imgs'; 
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read folder' });
    }else{
      res.json( files );  
    }


  });
});


module.exports = router;