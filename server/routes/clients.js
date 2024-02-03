const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const {isLoggedIn} = require('../middleware/basicAuth.js');
const db = require('../lib/db.js');

router.get("/all", isLoggedIn, (req, res) =>{
    db.query(` SELECT a.*, CONCAT (marges.name," (", marges.marge_pc, "%)") AS marge
    FROM (SELECT ID, CONCAT_WS(" ", first_name, last_name ) AS fullName, company, street_number,	zip_code,	city,	country,	phone,	mobile,	margeID  FROM clients) AS a
    LEFT JOIN marges
    ON a.margeID = marges.ID`, (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});
router.get("/select", isLoggedIn, (req, res) =>{
    db.query(`SELECT ID, CONCAT_WS(" ", first_name, last_name,  CONCAT( "(", company, ")") ) AS name FROM clients`, (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});
router.post("/byID", isLoggedIn, (req, res) =>{
    const ID = req.body.clientID;
    db.query(`SELECT a.*, CONCAT (marges.name," (", marges.marge_pc, "%)") AS marge 
    FROM(SELECT * FROM clients WHERE ID = ?) AS a
    LEFT JOIN marges
    ON a.margeID = marges.ID`, [ID], (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});
router.put("/new", isLoggedIn, (req, res, next) => {
    const company = req.body.company;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;

            db.query("INSERT INTO clients (company, first_name, last_name, registered) VALUES (?, ?, ?, now())", 
            [company, first_name, last_name], 
            (err, result) =>{
                if(err){
                    console.log(err)
                } else{
                    res.send(result);
                };
            })
});

router.put("/update", isLoggedIn, (req, res, next) => {
    const ID = req.body.ID;
    const company = req.body.company;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const street_number = req.body.street_number;
    const zip_code = req.body.zip_code;
    const city = req.body.city;
    const country = req.body.country;
    const phone = req.body.phone;
    const mobile = req.body.mobile;
    const margeID = req.body.margeID;

 
    db.query("UPDATE clients SET company = ?, first_name = ?, last_name = ?, street_number = ?, zip_code = ?, city = ?, country = ?, phone = ?, mobile = ?, margeID = ? WHERE ID = ?", 
    [company, first_name, last_name, street_number, zip_code, city, country, phone, mobile, margeID, ID], 
    (err, result) =>{
        if(err){
            console.log(err)
        } else{
            res.send("success");
        };
    });
     
});

router.delete("/delete", isLoggedIn, (req, res) => {

    const ID = req.body.ID;

    db.query("DELETE FROM clients WHERE ID = ?", ID, (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});

module.exports = router;