import { v2 as cloudinary } from 'cloudinary';
const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/basicAuth.js');
const multer =  require('multer')
const path = require('path');
const db = require('../lib/db.js');
const REACT_APP_IMG_API_CLOUD_NAME = process.env.REACT_APP_IMG_API_CLOUD_NAME
const REACT_APP_IMG_API_KEY = process.env.REACT_APP_IMG_API_KEY
const REACT_APP_IMG_API_SECRET = process.env.REACT_APP_IMG_API_SECRET



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


    file_name = "product_"+Date.now() + image.filename.split(".")[1]

    
    // Upload an image
    const uploadResult = await cloudinary.uploader.upload(image, {
        public_id: file_name,
        asset_folder: "./public/product_imgs"
    }).catch((error)=>{console.log(error)});
    
    console.log(uploadResult);
    
    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url(file_name, {
        fetch_format: 'auto',
        quality: 'auto'
    });
    
    console.log(optimizeUrl);
    
    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url(file_name, {
        crop: 'auto',
        gravity: 'auto',
        width: 400,
        height: 280,
    });
    
    console.log(autoCropUrl);    
})();
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
  (async function (){
  const result = await cloudinary.uploader
    .destroy(oldImg)
    .catch((error)=>{console.log(error)});
    console.log(result)
  })

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
  
});


module.exports = router;