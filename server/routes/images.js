const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/basicAuth.js');
const multer =  require('multer')
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/var/lib/data/public/recipe_imgs')
  },
  filename:(req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
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
  
  const folderPath = path.join(__dirname, '/var/lib/data/public/recipe_imgs'); // Replace 'your-folder-path' with the actual folder path
  console.log(__dirname, folderPath)
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read folder' });
    }else{
      res.json({ files });  
    }


  });
});

module.exports = router;