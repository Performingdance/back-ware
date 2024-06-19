const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/basicAuth.js');
const db = require('../lib/db.js');


router.get("/all", isLoggedIn, (req, res) => {
   const recipeID = req.body.recipeID;
   db.query("SELECT * FROM settings ", (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});

router.get("/company", isLoggedIn, (req, res) => {
   

   db.query(`
    SELECT l.*, settings.setting AS taxID
    FROM(SELECT k.*, settings.setting AS bic
    FROM(SELECT j.*, settings.setting AS iban
    FROM(SELECT i.*, settings.setting AS bank
    FROM(SELECT h.*, settings.setting AS tax_number
    FROM(SELECT g.*, settings.setting AS email
    FROM(SELECT f.*, settings.setting AS phone
    FROM(SELECT e.*, settings.setting AS country
    FROM(SELECT d.*, settings.setting AS city
    FROM(SELECT c.*, settings.setting AS zip_code
    FROM(SELECT b.ID, b.company, CONCAT(b.street, " ",settings.setting ) AS street_number
    FROM(SELECT a.*, settings.setting AS street 
    FROM(
    SELECT 1 AS ID, setting AS company FROM settings WHERE ID = 5) AS a
    LEFT JOIN settings 
    ON settings.ID = 6) AS b
    LEFT JOIN settings 
    ON settings.ID = 7) AS c
    LEFT JOIN settings 
    ON settings.ID = 8) AS d
    LEFT JOIN settings 
    ON settings.ID = 9) AS e
    LEFT JOIN settings 
    ON settings.ID = 10) AS f
    LEFT JOIN settings 
    ON settings.ID = 11) AS g
    LEFT JOIN settings 
    ON settings.ID = 12) AS h
    LEFT JOIN settings 
    ON settings.ID = 13) AS i
    LEFT JOIN settings 
    ON settings.ID = 14) AS j
    LEFT JOIN settings 
    ON settings.ID = 15) AS k
    LEFT JOIN settings 
    ON settings.ID = 16) AS l
    LEFT JOIN settings 
    ON settings.ID = 17;
    `, 
   (err, result) => {
      if(err){
         console.log(err)
      } else {
         res.send(result)
      }
   });
});

router.put("/update", isLoggedIn, (req, res) => {
   const ID = req.body.ID;
   const setting = req.body.setting;

   db.query("UPDATE settings SET setting = ? WHERE ID = ?",
    [setting, ID], 
    (err, result) => {
      if(err){
         console.log(err)
      } else {
         res.send(result)
      }
   });
});

router.delete("/delete", isLoggedIn, (req,res) => {
   const ID = req.body.ID;

   db.query("DELETE FROM settings WHERE ID = ? ", [ID], (err, result) => {
      if(err){
         console.log(err)
      } else {
         
               res.send(result)
      }
   });
});

module.exports = router;