const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/basicAuth.js');
const fs = require('fs');
const path = require('path');



router.post('/photoUpload', isLoggedIn, (req, res) => {
    if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
    }
  
    const file = req.files.file;
  
    file.mv(`${__dirname}/client/public/recipe_img/${file.name}`, err => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
  
      res.json({ fileName: file.name, filePath: `/client/public/recipe_img/${file.name}` });
    });
  });

router.get('/all', isLoggedIn, (req, res) => {
  
  const folderPath = path.join(__dirname, '/client/public/recipe_img'); // Replace 'your-folder-path' with the actual folder path
  res.send(folderPath)
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read folder' });
    }
   // res.json({ files });

  });
});

module.exports = router;