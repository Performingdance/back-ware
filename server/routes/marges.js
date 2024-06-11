const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/basicAuth.js');
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
    const tax = req.body.tax || 1;
    


    db.query("INSERT INTO marges (name, marge_pc, tax) VALUES (?, ?, ?)", 
    [name, marge_pc, tax], 
    (err, result) =>{
        if(err){
            console.log(err)
        } else{
            const margeID = result.insertId
            db.query(`INSERT INTO prices (productID, margeID, price)
            SELECT DISTINCT productID, ?, 0 FROM prices`, 
            [margeID], 
            (err, result) =>{
                if(err){
                    console.log(err)
                } else{
                };
            })
            res.send("success");
        };
    })
});

router.put("/update", isLoggedIn, (req, res) => {
    
    const ID = req.body.ID;
    const name = req.body.name;
    const marge_pc = req.body.marge_pc;
    const tax = req.body.tax;

    db.query("UPDATE marges SET name = ?, marge_pc = ?, tax = ? WHERE ID = ?", 
    [name, marge_pc, tax, ID], 
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
                    db.query("DELETE FROM prices WHERE margeID = ?", ID, (berr, bresult) =>{
                        if(berr){
                           console.log(berr)
                        } else {
                        }
                   });
                   res.send("success")
                }
           });
        }else{
            res.send(`Kunde mit ID ${result[0].ID} hat Marge eingespeichert`)
            return
        }
   });
});

module.exports = router;