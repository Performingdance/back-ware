const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/basicAuth.js');
const db = require('../lib/db.js');

router.get("/all", isLoggedIn, (req, res) =>{
    db.query("SELECT * FROM machines", (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});

router.put("/search", isLoggedIn, (req, res) => {
    const searchbyname = "%"+ req.body.searchbyname + "%";
    db.query("SELECT * FROM machines WHERE name LIKE ? ", searchbyname, (err, result) =>{
         if(err){
            console.log(err)
         } else {
            res.send(result)   
         }
    });
});

router.put("/limits", isLoggedIn, (req, res) => {
   const ID = req.body.ID;
   db.query(`SELECT a.*, form.name
   FROM (SELECT machines.*, machine_limit.formID, machine_limit.amount
      FROM machines
      LEFT JOIN machine_limit
      ON machines.ID = machine_limit.machineID
      WHERE machines.ID = ?) AS a 
      LEFT JOIN form
   ON a.formID = form.ID
   
   
   ;`, ID, (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)         
        }
   });
});
router.put("/update", isLoggedIn, (req, res) => {
   const ID = req.body.ID;
   const name = req.body.name;
   const weightlimit = req.body.weightlimit;

   db.query("UPDATE machines SET name = ?, weightlimit = ? WHERE ID = ? ",
   [ name, weightlimit, ID],
   (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)

           
        }
   });
});
router.post("/new", isLoggedIn, (req, res) => {

   const name = req.body.name;
   const weightlimit = req.body.weightlimit;
   
   db.query("INSERT INTO machines (name, weightlimit) Values (?,?)", 
   [name, weightlimit], 
   (err, result) =>{
       if(err){
           console.log(err)
       } else{
         const machineID = result.insertId;
     };

   })
});

router.post("/form/new", isLoggedIn, (req, res) => {

   const machineID = req.body.machineID;
   const formID = req.body.formID;
   const amount = req.body.amount;

   db.query(
      "INSERT INTO machine_limit (machineID, formID, amount) VALUES (?,?,?)",
      [machineID, formID, amount],
      (err, result) =>{
         if(err){
            console.log(err)
         } else {
            res.send(result) 
         }
       });
});
router.put("/form/update", isLoggedIn, (req, res) => {

   const ID = req.body.form_limitID;
   const machineID = req.body.machineID;
   const formID = req.body.formID;
   const amount = req.body.amount;

   db.query(
      "UPDATE machine_limit SET machineID = ?, formID = ?, amount = ? WHERE ID = ? ",
      [machineID, formID, amount, ID],
      (err, result) =>{
         if(err){
            console.log(err)
         } else {
            res.send(result) 
         }
       });
});
router.delete("/form/delete/all", isLoggedIn, (req, res) => {
   const machineID = req.body.machineID;
   db.query("DELETE FROM machine_limit WHERE machineID = ?", machineID, (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});
router.delete("/form/delete", isLoggedIn, (req, res) => {
   const machineID = req.body.machineID;
   const formID = req.body.formID;
   db.query("DELETE FROM machine_limit WHERE machineID = ? AND formID = ?", [machineID,formID], (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});


router.delete("/delete", isLoggedIn, (req, res) => {
   const ID = req.params.ID;
   db.query("DELETE FROM machines WHERE ID LIKE ?", ID, (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});

module.exports = router;