const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/basicAuth.js');
const multer =  require('multer')
const sharp = require('sharp')
const path = require('path');
const db = require('../lib/db.js');
const fs = require('fs')

const REACT_APP_DATA_PATH = process.env.REACT_APP_DATA_PATH
const imgPath = REACT_APP_DATA_PATH+'/product_imgs';
let file_name


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imgPath)
  },
  filename:(req, file, cb) => {
    file_name = file.fieldname +"_"+ Date.now() + path.extname(file.originalname)
    cb(null, file_name)
  }
})
const upload = multer({
  storage: storage
})

router.post('/photoUpload', isLoggedIn, upload.single("image"), (req, res) => {
  const productID = req.body.productID
  const oldImg = req.body.oldImg
  
  sharp(imgPath+'/'+file_name)
    .resize(640,480)
    .jpeg({
      quality:80,
      chromaSubsampling: '4:4:4'
    })
    .toFile(imgPath+'/prev_'+file_name, (err,info)=>{
      if(err){
        res.send(err)
      }else{
        res.send(info)
      }
    })
  // Remove old photo
  if (oldImg) {
    let oldPath 
    let oldPath_prev 

    if(oldImg.includes("prev_")){
      oldPath = path.join(imgPath,"/", oldImg.slice(4))
      oldPath_prev = path.join(imgPath,"/", oldImg)
    }else{
      oldPath = path.join(imgPath,"/", oldImg)
      oldPath_prev = path.join(imgPath,"/prev_", oldImg)
    }
    if (fs.existsSync(oldPath)) {
      fs.unlink(oldPath, (err) => {
        if (err) {
          console.error(err);
          return;
        }else{
          fs.unlink(oldPath_prev, (err) => {
            if (err) {
              console.error(err);
              return;
            }
          });
        }
        res.status(200).send(userObj);
      });
    }
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
    let oldPath 
    let oldPath_prev 

    if(oldImg.includes("prev_")){
      oldPath = path.join(imgPath,"/", oldImg.slice(4))
      oldPath_prev = path.join(imgPath,"/", oldImg)
    }else{
      oldPath = path.join(imgPath,"/", oldImg)
      oldPath_prev = path.join(imgPath,"/prev_", oldImg)
    }
    if (fs.existsSync(oldPath)) {
      fs.unlink(oldPath, (err) => {
        if (err) {
          console.error(err);
          return;
        }else{
          fs.unlink(oldPath_prev, (err) => {
            if (err) {
              console.error(err);
              return;
            }
          });
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