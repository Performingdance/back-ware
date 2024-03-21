const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/basicAuth.js');
const multer =  require('multer')
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    decodeBase64(null, 'public/recipe_imgs')
  },
  filename:(req, file, cb) => {
    decodeBase64(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({
  storage: storage
})

router.post('/photoUpload', isLoggedIn, upload.single('image'), (req, res) => {
  console.log(req.file)
  });

router.get('/all', isLoggedIn, (req, res) => {
  
  const folderPath = path.join(__dirname, ''); // Replace 'your-folder-path' with the actual folder path
  res.send(__dirname)
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read folder' });
    }
   // res.json({ files });

  });
});

module.exports = router;