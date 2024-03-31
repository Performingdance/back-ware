const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/basicAuth.js');
const db = require('../lib/db.js');

router.post("/bvp", isLoggedIn, (req, res) =>{
    const productID = req.body.productID;
    db.query(`
    SELECT g.*, CAST((nvp+ (nvp*mwst/100))AS DECIMAL(5,2)) AS bvp
    FROM(SELECT f.*, CAST((sk+(sk*rg/100)) AS DECIMAL(5,2)) AS nvp   
        FROM (SELECT e.*,CAST(bk+mk AS DECIMAL(5,2)) AS sk, settings.setting AS mwst
            FROM (SELECT d.*, settings.setting AS rg, CAST(priceKG*formweight*d.mk_preisniveau AS DECIMAL(5,2)) AS mk
                FROM (SELECT c.*,  CAST(settings.setting/100 AS DECIMAL(5,2)) AS mk_preisniveau
                    FROM (SELECT b.*, CAST(settings.setting*b.worktime AS DECIMAL(5,2)) AS bk
                        FROM(SELECT a.*, ingredients.priceKG
                            FROM (SELECT * FROM recipe_form
                            WHERE ID = ?) AS a
                        LEFT JOIN ingredients
                        ON ingredients.recipeID = a.recipeID) AS b 
                    LEFT JOIN settings
                    on settings.ID = 1) AS c
                LEFT JOIN settings
                on settings.ID = 2) AS d 
            LEFT JOIN settings
            on settings.ID = 3) AS e
        LEFT JOIN settings
        on settings.ID = 4) AS f) 
    AS g `, [productID],
        (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});

router.post("/nutri", isLoggedIn, (req, res) => {
    const recipeID = req.body.recipeID;
    db.query("SELECT * FROM ingredients WHERE recipeID = ? ", recipeID, (err, result) =>{
         if(err){
            console.log(err)
         } else {
            res.send(result)
         }
    });
});
router.post("/nutri/form", isLoggedIn, (req, res) => {
    const recipeID = req.body.recipeID;
    const productID = req.body.productID;
    
    db.query(`SELECT a.ID, 
    a.name, 
    a.allergen, 
    a.source,
    CAST(products.formweight AS DECIMAL(5,3)) AS formweight,
    products.formID, 
     CAST((a.priceKG * products.formweight) AS DECIMAL(5, 2)) AS price, 
    a.date, 
    CAST((a.kj * 10 *  products.formweight) AS DECIMAL(5, 2)) AS kj, 
     CAST((a.kcal * 10 * products.formweight)AS DECIMAL(5, 2)) AS kcal, 
     CAST((a.protein * 10 * products.formweight)AS DECIMAL(5, 2)) AS protein, 
     CAST((a.carbs * 10 * products.formweight)AS DECIMAL(5, 2)) AS carbs, 
     CAST((a.sugar * 10 * products.formweight)AS DECIMAL(5, 2)) AS sugar, 
     CAST((a.fat * 10 * products.formweight)AS DECIMAL(5, 2)) AS fat, 
     CAST((a.sat_fat * 10 * products.formweight)AS DECIMAL(5, 2)) AS sat_fat, 
     CAST((a.fibres * 10 * products.formweight)AS DECIMAL(5, 2)) AS fibres, 
     CAST((a.salt * 10 * products.formweight)AS DECIMAL(5, 2)) AS salt 
    FROM (SELECT * FROM ingredients WHERE recipeID = ?) AS a
    LEFT JOIN products
    ON products.ID = ?`, [recipeID, productID], (err, result) =>{
         if(err){
            console.log(err)
         } else {
            res.send(result)
         }
    });
});

router.post("/ing", isLoggedIn, (req, res) => {
    const recipeID = req.body.recipeID;
    db.query(`
    SELECT sort.level, sort.name, CASE WHEN base_recipeID IS NULL THEN recipeID ELSE base_recipeID END AS recipeSortID, sort.base
FROM (SELECT i.*
	FROM (SELECT hh.*, (CASE WHEN hh.base = 1 THEN CONCAT(ingredients.name," (",REPLACE(ROUND(total_amount_pc*100,2),".",","), "%): ") ELSE CONCAT(ingredients.name," (",REPLACE(ROUND(total_amount_pc*100,2),".",","), "%), ") END) AS name 
		FROM (SELECT c.*, "1" AS "level"
			FROM (SELECT b.recipeID, b.amount_pc AS total_amount_pc, b.amount_pc, b.base_ingID, ingredients.recipeID AS base_recipeID, b.base, b.titleID, b.sortID
				FROM (SELECT recipeID, amount_pc, dough.ingredientID AS base_ingID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID				
					FROM dough
					WHERE ? = recipeID) AS b   
			LEFT JOIN ingredients
			ON b.base_ingID = ingredients.ID) AS c
		UNION
		SELECT d.recipeID, d.total_amount_pc, d.amount_pc, d.base_ingID, ingredients.recipeID AS base_recipeID, d.base, d.titleID, d.sortID, "2" AS "level"
			FROM (SELECT c.recipeID, (dough.amount_pc * c.amount_pc) AS total_amount_pc, dough.amount_pc AS amount_pc, dough.ingredientID AS base_ingID, c.base_recipeID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID
				FROM (SELECT ingredients.recipeID, b.amount_pc, b.base_ingID, ingredients.recipeID AS base_recipeID, b.base, b.titleID, b.sortID
					FROM (SELECT recipeID, amount_pc, dough.ingredientID AS base_ingID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID				
						FROM dough
						WHERE ? = recipeID ) AS b
					LEFT JOIN ingredients
					ON b.base_ingID = ingredients.ID) AS c
			LEFT JOIN dough
			ON c.base_recipeID = dough.recipeID) AS d
        LEFT JOIN ingredients
		ON d.base_ingID = ingredients.ID
		UNION
        SELECT f.recipeID, f.total_amount_pc, f.amount_pc, f.base_ingID, ingredients.recipeID AS base_recipeID, f.base, f.titleID, f.sortID,  "3" AS "level"
		FROM (SELECT e.recipeID, (dough.amount_pc * e.amount_pc) AS total_amount_pc, dough.amount_pc AS amount_pc, dough.ingredientID AS base_ingID, e.base_recipeID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID
			FROM (SELECT ingredients.recipeID, d.amount_pc, d.base_ingID, ingredients.recipeID AS base_recipeID, d.base, d.titleID, d.sortID
				FROM (SELECT c.recipeID, (dough.amount_pc* c.amount_pc) AS amount_pc, dough.ingredientID AS base_ingID, c.base_recipeID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID
					FROM (SELECT b.recipeID, b.amount_pc, b.base_ingID, ingredients.recipeID AS base_recipeID, b.base, b.titleID, b.sortID
						FROM (SELECT recipeID, amount_pc, dough.ingredientID AS base_ingID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID				
							FROM dough
							WHERE ? = recipeID) AS b
						LEFT JOIN ingredients
						ON b.base_ingID = ingredients.ID) AS c
				LEFT JOIN dough
				ON c.base_recipeID = dough.recipeID
				WHERE dough.base = 1) AS d
			LEFT JOIN ingredients
			ON d.base_ingID = ingredients.ID) AS e
		LEFT JOIN dough
		ON e.base_recipeID = dough.recipeID) AS f 
        LEFT JOIN ingredients
		ON f.base_ingID = ingredients.ID
		UNION
		SELECT h.recipeID, h.total_amount_pc, h.amount_pc, h.base_ingID, ingredients.recipeID AS base_recipeID, h.base, h.titleID, h.sortID,  "4" AS "level"
		FROM (SELECT  g.recipeID, (dough.amount_pc * g.amount_pc) AS total_amount_pc, dough.amount_pc, dough.ingredientID AS base_ingID, g.base_recipeID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID
			FROM (SELECT  ingredients.recipeID, f.amount_pc, f.base_ingID, ingredients.recipeID AS base_recipeID, f.base, f.titleID, f.sortID
				FROM (SELECT e.recipeID, (dough.amount_pc* e.amount_pc) AS amount_pc, dough.ingredientID AS base_ingID, e.base_recipeID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID,  "3" AS "level"
					FROM (SELECT d.recipeID, d.amount_pc, d.base_ingID, ingredients.recipeID AS base_recipeID, d.base, d.titleID, d.sortID
						FROM (SELECT c.recipeID, (dough.amount_pc* c.amount_pc) AS amount_pc, dough.ingredientID AS base_ingID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID
							FROM (SELECT b.recipeID, b.amount_pc, b.base_ingID, ingredients.recipeID AS base_recipeID, b.base, b.titleID, b.sortID
								FROM (SELECT recipeID, amount_pc, dough.ingredientID AS base_ingID, dough.recipeID AS base_recipeID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID				
									FROM dough
									WHERE ? = recipeID) AS b
                                LEFT JOIN ingredients
                                ON b.base_ingID = ingredients.ID) AS c
                            LEFT JOIN dough
                            ON c.base_recipeID = dough.recipeID
                            WHERE dough.base = 1) AS d
                        LEFT JOIN ingredients
                        ON d.base_ingID = ingredients.ID) AS e
                    LEFT JOIN dough
                    ON e.base_recipeID = dough.recipeID) AS f
                LEFT JOIN ingredients
                ON f.base_ingID = ingredients.ID) AS g
            LEFT JOIN dough
			ON g.base_recipeID = dough.recipeID) AS h
            LEFT JOIN ingredients
            ON h.base_ingID = ingredients.ID) AS hh
            LEFT JOIN ingredients
        	ON hh.base_ingID = ingredients.ID) AS i
  WHERE amount_pc > 0) AS sort
  ORDER BY recipeSortID ASC,  total_amount_pc DESC, level ASC`, 
[recipeID,recipeID,recipeID,recipeID], 
(err, result) =>{
         if(err){
            console.log(err)
         } else {
            //console.log(result)
            res.send(result)
         }
    });
});



module.exports = router;