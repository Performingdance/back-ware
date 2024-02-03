const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/basicAuth.js');
const db = require('../lib/db.js');

router.put("/new", isLoggedIn, (req, res) => {

    const name = req.body.name;

    db.query("INSERT INTO ingredients (name, date) Values (?,now())", 
    [name], 
    (err, result) =>{
        if(err){
            console.log(err)
        } else{
            res.send(result);

        };
    })
});

router.put("/update", isLoggedIn, (req, res) => {
    
    const name = req.body.name;
    const allergen = req.body.allergen;
    const source = req.body.source;
    const amount = req.body.amount;
    const price = req.body.price;
    const priceKG = req.body.priceKG;
    const kj = req.body.kj;
    const kcal = req.body.kcal;
    const protein = req.body.protein;
    const carbs = req.body.carbs;
    const sugar = req.body.sugar;
    const fat = req.body.fat;
    const sat_fat = req.body.sat_fat;
    const fibres = req.body.fibres;
    const salt = req.body.salt;
    const ID = req.body.ID;
    

    db.query("UPDATE ingredients SET name = ?, allergen = ?, source = ?, amount = ?, price = ?, priceKG = ?, date = now (), kj = ?, kcal = ?, protein = ?, carbs = ?, sugar = ?, fat = ?, sat_fat = ?, fibres = ?, salt = ?  WHERE ID = ?", 
    [name, allergen, source, amount, price, priceKG, kj, kcal, protein, carbs, sugar, fat, sat_fat, fibres, salt, ID], 
    (err, result) =>{
        if(err){
            console.log(err)
        } else{
            res.send(result);
        };
    })
});
router.get("/all", isLoggedIn, (req, res) => {
    db.query("SELECT * FROM ingredients ORDER BY name ASC", (err, result) =>{
         if(err){
            console.log(err)
         } else {
            res.send(result)
         }
    });
});
router.get("/all/noRecipes", isLoggedIn, (req, res) => {
    db.query("SELECT * FROM ingredients WHERE recipeID IS null ORDER BY name ASC", (err, result) =>{
         if(err){
            console.log(err)
         } else {
            res.send(result)
         }
    });
});
router.get("/all/name", isLoggedIn, (req, res) => {
    db.query("SELECT ID,name FROM ingredients ORDER BY name ASC ", (err, result) =>{
         if(err){
            console.log(err)
         } else {
            res.send(result)
         }
    });
});

router.post("/ID", isLoggedIn, (req, res) => {
    const ingID = req.body.ingID;
    db.query("SELECT * FROM ingredients WHERE ID = ?", [ingID], (err, result) =>{
         if(err){
            console.log(err)
         } else {
            res.send(result)
         }
    });
});

router.put("/search", isLoggedIn, (req, res) => {
    const searchbyname = "%"+ req.body.searchbyname + "%";
    const base = req.body.base;
    if(base == true){
        db.query("SELECT * FROM ingredients WHERE name LIKE ? AND base IS NOT ?", [searchbyname,null], (err, result) =>{
            if(err){
               console.log(err)
            } else {
               res.send(result)
            }
       });
    }else{
        db.query("SELECT * FROM ingredients WHERE name LIKE ?", searchbyname, (err, result) =>{
            if(err){
               console.log(err)
            } else {
               res.send(result)
            }
       });
    }
    
});
router.delete("/delete", isLoggedIn, (req, res) => {
    const ID = req.body.ID;
    db.query("SELECT recipeID FROM dough WHERE ingredientID = ?", ID, (err, result) =>{
        if(err){
            console.log(err)
        }
        if (result && !result.length) {
        db.query("DELETE FROM ingredients WHERE ID = ?", ID, (err, res) =>{
            if(err){
                console.log(err)
            } else {
                res.send(result)
            }
        });
    }else {
        res.send(`Zutat wird in Rezept(en) verwendet. ID: ${ result}`)
    }
});
});

module.exports = router;