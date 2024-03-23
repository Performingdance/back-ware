const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/basicAuth.js');
const multer =  require('multer')
const path = require('path');
const db = require('../lib/db.js');
const fs = require('fs')
let file_name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/var/lib/data/recipe_imgs')
  },
  filename:(req, file, cb) => {
    file_name = file.fieldname +"_"+ Date.now() + path.extname(file.originalname)
    cb(null, file_name )
  }
})
const upload = multer({
  storage: storage
})

router.post('/photoUpload', isLoggedIn, upload.single("image"), (req, res) => {
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
  db.query("UPDATE recipe_form SET img = ? WHERE = ? ",[file_name, productID], (err, result) =>{
    if(err){
       console.log(err)
    } else {
    }
});
  //console.log(req.body.image)
  res.send("success")
  });

router.get('/all', isLoggedIn, (req, res) => {
  
  const folderPath = '/var/lib/data/recipe_imgs'; // Replace 'your-folder-path' with the actual folder path
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