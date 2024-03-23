const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/basicAuth.js');
const multer =  require('multer')
const path = require('path');
const fs = require('fs')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/var/lib/data/recipe_imgs')
  },
  filename:(req, file, cb) => {
    console.log(file)
    cb(null, Date.now() + "_" + path.extname(file.originalname))
  }
})
const upload = multer({
  storage: storage
})
console.log(__dirname)

router.post('/photoUpload', isLoggedIn, upload.single('image'), (req, res) => {
  
  console.log(req.body.image)
  res.send("success")
  });

router.get('/all', isLoggedIn, (req, res) => {
  
  const folderPath = '/var/lib/data/recipe_imgs'; // Replace 'your-folder-path' with the actual folder path
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read folder' });
    }else{
      res.send( files );  
    }


  });
});

module.exports = router;