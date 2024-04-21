const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/basicAuth.js');
const db = require('../lib/db.js');

router.get("/all", isLoggedIn, (req, res) =>{
    db.query("SELECT * FROM form ORDER BY name ASC", (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});

router.put("/search", isLoggedIn, (req, res) => {
    const searchbyname = "%"+ req.body.searchbyname + "%";
    db.query("SELECT * FROM form WHERE name LIKE ? ", searchbyname, (err, result) =>{
         if(err){
            console.log(err)
         } else {
            res.send(result)

            
         }
    });
});
router.put("/new", isLoggedIn, (req, res) => {
   const name = req.body.name;
   const bruch = req.body.bruch;

   db.query("SELECT ID FROM form WHERE name = ?", name, (err, result) =>{
      if(err){
         console.log(err)
      } 
      if(result && !result.length){
           db.query("INSERT INTO form (name, bruch) VALUES (?, ?)", 
           [name, bruch], 
           (err, result) =>{
               if(err){
                   console.log(err)
               } else{
                   res.send("success");
               };
           })
      }
      else{
         res.send("Form bereits eingetragen")
      }
   })
});


router.put("/update", isLoggedIn, (req, res) => {
   const ID = req.body.ID;
   const name = req.body.name;
   const bruch = req.body.bruch;

   db.query("UPDATE form SET name = ?, bruch = ? WHERE ID = ?", 
   [name, bruch, ID], 
   (err, result) =>{
       if(err){
           console.log(err)
       } else{
          
       };
   });
   res.send("success");
});

router.delete("/delete", isLoggedIn, (req, res) => {

   const ID = req.body.ID;
   db.query("SELECT recipeID FROM products WHERE formID = ?", ID, (err, result) =>{
    if(err){
       console.log(err)
    } 
    if(result && !result.length){
        db.query("DELETE FROM form WHERE ID = ?", ID, (berr, bresult) =>{
            if(berr){
               console.log(berr)
            } else {
               res.send("Form erfolgreich gelöscht")
            }
       });
    }
    
    else {
       res.send(`Form in Rezept(en) eingebunden. ID: ${ result}`)
    }
});
  
});

module.exports = router;