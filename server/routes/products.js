const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/basicAuth.js');
const db = require('../lib/db.js');

router.get("/all", isLoggedIn, (req, res) => {
    db.query(`SELECT b.*, form.name AS formName
    FROM(SELECT a.*, recipes.name AS recipeName FROM
    (SELECT * FROM recipe_form) AS a
    LEFT JOIN recipes
    ON a.recipeID = recipes.ID) AS b
    LEFT JOIN form
    ON b.formID = form.ID
    `, (err, result) =>{
         if(err){
            console.log(err)
         } else {
            res.send(result)
         }
    });
 });

 module.exports = router