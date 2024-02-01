const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/users.js');
const db = require('../lib/db.js');

router.get("/all", isLoggedIn, (req, res) =>{
    db.query("SELECT * FROM marges", (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});
router.get("/all/name", isLoggedIn, (req, res) =>{
    db.query(`SELECT ID, CONCAT(marges.name, ' (', marges.marge_pc,'%)') AS name  FROM marges`, (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});

router.post("/new", isLoggedIn, (req, res) => {

    const name = req.body.name;
    const marge_pc = req.body.marge_pc;
    


    db.query("INSERT INTO marges (name, marge_pc) VALUES (?, ?)", 
    [name, marge_pc], 
    (err, result) =>{
        if(err){
            console.log(err)
        } else{
            res.send("success");
        };
    })
});

router.put("/update", isLoggedIn, (req, res) => {
    
    const ID = req.body.ID;
    const name = req.body.name;
    const marge_pc = req.body.marge_pc;

    db.query("UPDATE marges SET name = ?, marge_pc = ? WHERE ID = ?", 
    [name, marge_pc, ID], 
    (err, result) =>{
        if(err){
            console.log(err)
        } else{
            res.send("success");
        };
    })
});

router.delete("/delete", isLoggedIn, (req, res) => {

    const ID = req.body.ID;

    db.query("SELECT ID from clients WHERE margeID = ?", ID, (err, result) =>{
        if(err){
           console.log(err)
        } if(result && !result.length){
            
            db.query("DELETE FROM marges WHERE ID = ?", ID, (berr, bresult) =>{
                if(berr){
                   console.log(berr)
                } else {
                   res.send(bresult)
                }
           });
        }else{
            res.send(`Kunde mit ID ${result[0].ID} hat Marge eingespeichert`)
            return
        }
   });
});

module.exports = router;