const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/users.js');
const db = require('../lib/db.js');
const res = require('express/lib/response.js');


router.get("/all", isLoggedIn, (req, res) => {
   const recipeID = req.body.recipeID;
   db.query("SELECT * FROM titles WHERE recipeID = ? ", recipeID, (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});

router.put("/new", isLoggedIn, (req, res) => {
   const title_sortID = req.body.title_sortID;
   const recipeID = req.body.recipeID;
   const title = req.body.title;
   

   db.query("INSERT INTO titles (recipeID, title, title_sortID) VALUES (?, ?, ?)",
   [recipeID, title, title_sortID], 
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
   const title_sortID = req.body.title_sortID;
   const title = req.body.title;

   db.query("UPDATE titles SET title = ?, title_sortID = ? WHERE ID = ?",
    [title, title_sortID, ID], 
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
   const title_sortID = req.body.title_sortID;
   const recipeID = req.body.recipeID;

   db.query("DELETE FROM titles WHERE ID = ? AND recipeID = ?", [ID, recipeID], (err, result) => {
      if(err){
         console.log(err)
      } else {
         db.query("DELETE FROM dough WHERE titleID = ? AND recipeID = ?", [title_sortID, recipeID], (berr, bresult) => {
            if(berr){
               console.log(berr)
            } else {
               res.send(bresult)
            }
         });
      }
   });
});

module.exports = router;