const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/basicAuth.js');
const db = require('../lib/db.js');

router.get("/all", isLoggedIn, (req, res) =>{
    db.query("SELECT * FROM worksheet", (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});
router.post("/all/date", isLoggedIn, (req, res) =>{
    const production_date = req.body.production_date + "%" ;
    db.query(`
    SELECT c.*, titles.title FROM
    (Select b.*, ingredients.name AS ingName FROM
        (SELECT a.*, recipes.name AS recipeName FROM
            (SELECT * FROM worksheet WHERE date LIKE ?) AS a
            LEFT JOIN recipes
            ON a.recipeID = recipes.ID) AS b
         LEFT JOIN ingredients
         ON b.base_ingID = ingredients.ID) AS c
    LEFT JOIN titles
    ON c.recipeID = titles.recipeID && c.titleID = titles.ID
    ORDER BY c.recipeID ASC, c.titleID, c.sortID `, production_date, (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});

router.get("/all/date/base", isLoggedIn, (req, res) =>{
   const production_date = req.body.production_date + "%" ;
   const selected_base = req.body.selected_base; // SELECT recipeID FROM worksheet WHERE date LIKE '2023-02-03' GROUP BY recipeID
   db.query(`
   SELECT d.*, recipes.name as recipeName FROM
    (SELECT c.*, recipes.name AS base_recipeName FROM
        (SELECT  b.*, worksheet.recipeID FROM
                (SELECT a.ID, a.date, a.recipeID AS base_recipeID, SUM(a.ing_mass) AS base_recipeMass FROM 
                    (SELECT ID, date, recipeID, ing_mass, base_ingID 
                            FROM worksheet 
                            WHERE date LIKE ?
                    UNION
                    SELECT ID, date, base_recipeID, ing_mass, base_ingID 
                            FROM worksheet 
                            WHERE date LIKE ?) AS a
                GROUP BY base_recipeID) AS b
            LEFT JOIN worksheet
            ON b.base_recipeID = worksheet.base_recipeID OR b.base_recipeID = worksheet.recipeID
            WHERE b.base_recipeID > 0
            GROUP BY base_recipeID, recipeID) AS c
    LEFT JOIN recipes
    ON c.base_recipeID = recipes.ID) AS d
LEFT JOIN recipes
ON d.recipeID = recipes.ID
WHERE (CASE WHEN ? > 0 THEN base_recipeID IN (?) ELSE base_recipeID IN (SELECT recipeID FROM worksheet WHERE date LIKE ? GROUP BY recipeID) END)

ORDER BY base_recipeName ASC`, [production_date, production_date, selected_base, selected_base, production_date], (err, result) =>{
       if(err){
          console.log(err)
       } else {
          res.send(result)
       }
  });
});
router.put("/checked", isLoggedIn, (req, res) => {
   const ID = req.body.itemID;
   const is_checked = req.body.is_checked;
   db.query("UPDATE worksheet SET is_checked = ? WHERE ID = ?", [is_checked,ID], (err, result) =>{
       if(err){
          console.log(err)
       } else {
          res.send(result)
       }
  });
   
});
router.put("/checked/base", isLoggedIn, (req, res) => {
   const titleID = req.body.titleID;
   const recipeID = req.body.recipeID;
   const date = req.body.date + "%";
   const is_checked = req.body.is_checked;
   db.query("UPDATE worksheet SET is_checked = ? WHERE recipeID = ? AND titleID = ? AND date LIKE ?", [is_checked,recipeID, titleID, date], (err, result) =>{
       if(err){
          console.log(err)
       } else {
          res.send(result)
       }
  });
   
});
router.put("/checked/section", isLoggedIn, (req, res) => {
   const titleID = req.body.titleID;
   const recipeID = req.body.recipeID;
   const date = req.body.date + "%";
   const is_checked = req.body.is_checked;
   db.query("UPDATE worksheet SET is_checked = ? WHERE recipeID = ? AND titleID = ? AND date LIKE ?", [is_checked,recipeID, titleID, date], (err, result) =>{
       if(err){
          console.log(err)
       } else {
          res.send(result)
       }
  });
   
});
router.put("/checked/recipe", isLoggedIn, (req, res) => {
   const recipeID = req.body.recipeID;
   const date = req.body.date+ "%";
   const is_checked = req.body.is_checked;
   db.query("UPDATE worksheet SET is_checked = ? WHERE recipeID = ? AND date = ?", [is_checked,recipeID, date], (err, result) =>{
       if(err){
          console.log(err)
       } else {
          res.send(result)
       }
  });
   
});

router.post("/new", isLoggedIn, (req, res) => {
   const date = req.body.date;
   db.query(`INSERT INTO worksheet (date, recipeID, recipe_mass, ing_mass, base_ingID, base_recipeID, base, titleID, sortID, note, level)
   SELECT b.*, "1" AS "level"
       FROM (SELECT a.date, dough.recipeID as recipeID, a.mass AS recipe_mass, (dough.amount_pc * a.mass) AS ing_mass, dough.ingredientID AS base_ingID, "0" AS base_recipeID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID, a.note			
               FROM (SELECT daylist.date, SUM(daylist.mass) as mass, daylist.recipeID, daylist.note 
               FROM daylist 
               WHERE date = ?
               GROUP BY daylist.date, daylist.recipeID, daylist.note ) AS a 
       LEFT JOIN dough
       ON a.recipeID = dough.recipeID) AS b    
   UNION
   SELECT c.date, c.recipeID, c.recipe_mass, (dough.amount_pc * c.ing_mass) AS ing_mass, dough.ingredientID AS base_ingID, c.base_recipeID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID, "" AS note,  "2" AS "level"
       FROM (SELECT b.date, b.recipeID, b.recipe_mass, b.ing_mass, b.base_ingID, ingredients.recipeID AS base_recipeID, b.base, b.titleID, b.sortID
           FROM (SELECT a.date, dough.recipeID AS recipeID, a.mass AS recipe_mass, (dough.amount_pc * a.mass) AS ing_mass, dough.ingredientID AS base_ingID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID				
               FROM (SELECT daylist.date, SUM(daylist.mass) as mass, daylist.recipeID 
                   FROM daylist 
                   WHERE date = ?
                   GROUP BY daylist.date, daylist.recipeID, daylist.note) AS a 
           LEFT JOIN dough
           ON a.recipeID = dough.recipeID
           WHERE base = 1) AS b
       LEFT JOIN ingredients
       ON b.base_ingID = ingredients.ID) AS c
   LEFT JOIN dough
   ON c.base_recipeID = dough.recipeID
   UNION
   SELECT e.date, e.recipeID, e.recipe_mass, (dough.amount_pc * e.ing_mass) AS ing_mass, dough.ingredientID AS base_ingID, e.base_recipeID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID, "" AS note,  "3" AS "level"
       FROM (SELECT d.date, d.recipeID, d.recipe_mass, d.ing_mass, d.base_ingID, ingredients.recipeID AS base_recipeID, d.base, d.titleID, d.sortID
           FROM (SELECT c.date, c.recipeID, c.recipe_mass, (dough.amount_pc * c.ing_mass) AS ing_mass, dough.ingredientID AS base_ingID, dough.base, c.titleID AS titleID, c.sortID AS sortID
               FROM (SELECT b.date, b.recipeID, b.recipe_mass, b.ing_mass, b.base_ingID, ingredients.recipeID AS base_recipeID, b.base, b.titleID, b.sortID
               FROM (SELECT a.date, dough.recipeID AS recipeID, a.mass AS recipe_mass, (dough.amount_pc * a.mass) AS ing_mass, dough.ingredientID AS base_ingID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID				
                       FROM (SELECT daylist.date, SUM(daylist.mass) as mass, daylist.recipeID
                           FROM daylist 
                           WHERE date = ?
                           GROUP BY daylist.date, daylist.recipeID, daylist.note) AS a 
               LEFT JOIN dough
               ON a.recipeID = dough.recipeID
               WHERE base = 1) AS b
               LEFT JOIN ingredients
               ON b.base_ingID = ingredients.ID) AS c
           LEFT JOIN dough
           ON c.base_recipeID = dough.recipeID
           WHERE dough.base = 1) AS d
       LEFT JOIN ingredients
       ON d.base_ingID = ingredients.ID) AS e
   LEFT JOIN dough
   ON e.base_recipeID = dough.recipeID`, [date,date,date], (err, result) =>{
       if(err){
          console.log(err)
       } else {
          res.send(result)
       }
  });
   
});


router.delete("/delete", isLoggedIn, (req, res) => {

    const ID = req.body.ID;

    db.query("DELETE FROM worksheet WHERE ID = ?", ID, (err, result) =>{
        if(err){
           console.log(err)
        } else {
         
           res.send(result)
        }
   });
});
router.delete("/delete/date", isLoggedIn, (req, res) => {

   const date = req.body.date;

   db.query("DELETE FROM worksheet WHERE date = ? AND ID >= 0", date, (err, result) =>{
       if(err){
          console.log(err)
       } else {
          res.send(result)
       }
  });
});

module.exports = router;