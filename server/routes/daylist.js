const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/users.js');
const db = require('../lib/db.js');

router.get("/all", isLoggedIn, (req, res) =>{
    db.query("SELECT * FROM daylist", (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});
router.post("/all/day", isLoggedIn, (req, res) =>{
    const date =  req.body.date + "%";
    db.query(`SELECT d.*, CASE WHEN clients.company <> '' THEN clients.company ELSE CONCAT(clients.first_name, ' ', clients.last_name)  END AS clientName FROM 
    (SELECT c.*, orders.clientID FROM
        (SELECT b.*, form.name AS formName 
        FROM (SELECT a.*, recipes.name AS recipeName 
            FROM (SELECT * FROM daylist WHERE date LIKE ?) AS a
                LEFT JOIN recipes
                ON a.recipeID = recipes.ID) AS b
            LEFT JOIN form
            ON b.formID = form.ID) AS c
        LEFT JOIN orders
        ON c.orderID = orders.ID) AS d
    LEFT JOIN clients
    ON d.clientID = clients.ID 
    ORDER BY d.recipeName ASC, d.formName ASC`, date, (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});

router.post("/all/form", isLoggedIn, (req, res) =>{
    const date =  req.body.date + "%";
    db.query(`SELECT a.*, form.name, form.bruch FROM 
    (SELECT recipeID, formID, SUM(amount) as amount 
        FROM daylist WHERE date LIKE ?
        GROUP BY recipeID, formID) AS a
    LEFT JOIN form
    ON a.formID = form.ID
    `, date, (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});

router.put("/new", isLoggedIn, (req, res) => {

    const recipeID = req.body.recipeID;
    const formID = req.body.formID;
    const clientID = req.body.clientID;
    const amount = req.body.amount;
    const ist = 0;
    const date = req.body.date;
    const orderID = req.body.orderID;
    const note = req.body.note;
    
    if(orderID == -1){
        
        db.query("INSERT INTO orders (order_date, clientID) VALUES (now(), ?)", [clientID],
        (aerr, aresult) =>{
            if(aerr){
                console.log(aerr)
            } else{
                const newOrderID = aresult.insertId
                db.query("INSERT INTO daylist (date, recipeID, formID, amount, ist, orderID, note) VALUES (?, ?, ?, ?, ?, ?, ?)", 
                [date, recipeID, formID, amount, ist, newOrderID, note], 
                (err, result) =>{
                    if(err){
                        console.log(err)
                    } else{
                        const ID = result.insertId;
            
                        db.query(`
                        UPDATE daylist SET 
                        mass = (SELECT( ? * (SELECT formweight FROM recipe_form WHERE recipeID = ? and formID = ?)) AS mass) 
                        WHERE ID = ?`, 
                        [amount, recipeID, formID, ID], 
                        (berr, bresult) =>{
                            if(berr){
                                console.log(berr)
                            } else{
                                res.send("success");
                            };
                        })
                    };
                })
            };
        })
    }else{
        db.query("INSERT INTO daylist (date, recipeID, formID, amount,ist, orderID, note) VALUES (?, ?, ?, ?, ?, ?, ?)", 
        [date, recipeID, formID, amount, ist, orderID, note], 
        (err, result) =>{
            if(err){
                console.log(err)
            } else{
                const ID = result.insertId;
    
                db.query(`
                UPDATE daylist SET 
                mass = (SELECT( ? * (SELECT formweight FROM recipe_form WHERE recipeID = ? and formID = ?)) AS mass) 
                WHERE ID = ?`, 
                [amount, recipeID, formID, ID], 
                (berr, bresult) =>{
                    if(berr){
                        console.log(berr)
                    } else{
                        db.query("DELETE FROM worksheet WHERE date LIKE ? AND ID >= 0", date, (err, result) =>{
                            if(err){
                               console.log(err)
                            } else {
                               db.query(`INSERT INTO worksheet (date, recipeID, recipe_mass, ing_mass, base_ingID, base_recipeID, base, titleID, sortID, note, level)
                        SELECT b.*, "1" AS "level"
                            FROM (SELECT a.date, dough.recipeID as recipeID, a.mass AS recipe_mass, (dough.amount_pc * a.mass) AS ing_mass, dough.ingredientID AS base_ingID, "0" AS base_recipeID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID, a.note			
                                    FROM (SELECT daylist.date, SUM(daylist.mass) as mass, daylist.recipeID, daylist.note 
                                    FROM daylist 
                                    WHERE date = ?
                                    GROUP BY daylist.recipeID) AS a 
                            LEFT JOIN dough
                            ON a.recipeID = dough.recipeID) AS b    
                        UNION
                        SELECT c.date, c.recipeID, c.recipe_mass, (dough.amount_pc * c.ing_mass) AS ing_mass, dough.ingredientID AS base_ingID, c.base_recipeID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID, "" AS note,  "2" AS "level"
                            FROM (SELECT b.date, b.recipeID, b.recipe_mass, b.ing_mass, b.base_ingID, ingredients.recipeID AS base_recipeID, b.base, b.titleID, b.sortID
                                FROM (SELECT a.date, dough.recipeID AS recipeID, a.mass AS recipe_mass, (dough.amount_pc * a.mass) AS ing_mass, dough.ingredientID AS base_ingID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID				
                                    FROM (SELECT daylist.date, SUM(daylist.mass) as mass, daylist.recipeID 
                                        FROM daylist 
                                        WHERE date = ?
                                        GROUP BY daylist.recipeID) AS a 
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
                                FROM (SELECT c.date, c.recipeID, c.recipe_mass, (dough.amount_pc * c.ing_mass) AS ing_mass, dough.ingredientID AS base_ingID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID
                                    FROM (SELECT b.date, b.recipeID, b.recipe_mass, b.ing_mass, b.base_ingID, ingredients.recipeID AS base_recipeID, b.base, b.titleID, b.sortID
                                    FROM (SELECT a.date, dough.recipeID AS recipeID, a.mass AS recipe_mass, (dough.amount_pc * a.mass) AS ing_mass, dough.ingredientID AS base_ingID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID				
                                            FROM (SELECT daylist.date, SUM(daylist.mass) as mass, daylist.recipeID
                                                FROM daylist 
                                                WHERE date = ?
                                                GROUP BY daylist.recipeID) AS a 
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
                                
                            }
                        });
                            }
                       });
                        
            
                    };
                })
               
            };
        })
        res.send("success");
    } 




});

router.put("/update", isLoggedIn, (req, res) => {
    
    const ID = req.body.ID;
    const recipeID = req.body.recipeID;
    const formID = req.body.formID;
    const amount = req.body.amount;
    const ist = req.body.ist;
    const rest = req.body.rest;
    const orderID = req.body.orderID;
    const note = req.body.note;
    const date = req.body.date;



    db.query(`UPDATE daylist SET  
    recipeID = ?, 
    formID = ?, 
    amount = ?, 
    ist = ?, 
    rest = ?, 
    orderID = ?, 
    note = ? 
    WHERE ID = ?`,

    [recipeID,formID,amount,ist,rest,orderID,note, ID], 
    (err, result) =>{
        if(err){
            console.log(err)
         } else{           
            
            db.query(`
            UPDATE daylist SET mass = (SELECT formweight 
                FROM recipe_form 
                WHERE recipeID = ? 
                AND formID = ?) 
            WHERE ID = ? 
            `, 
            [recipeID, formID, ID], 
            (berr, bresult) =>{
                if(berr){
                    console.log(berr)
                } else{
                    
                    db.query("DELETE FROM worksheet WHERE date LIKE ? AND ID >= 0", date, (cerr, cresult) =>{
                        if(cerr){
                           console.log(cerr)
                        } else {
                           db.query(`INSERT INTO worksheet (date, recipeID, recipe_mass, ing_mass, base_ingID, base_recipeID, base, titleID, sortID, note, level)
                    SELECT b.*, "1" AS "level"
                        FROM (SELECT a.date, dough.recipeID as recipeID, a.mass AS recipe_mass, (dough.amount_pc * a.mass) AS ing_mass, dough.ingredientID AS base_ingID, "0" AS base_recipeID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID, a.note			
                                FROM (SELECT daylist.date, SUM(daylist.mass) as mass, daylist.recipeID, daylist.note 
                                FROM daylist 
                                WHERE date = ?
                                GROUP BY daylist.recipeID) AS a 
                        LEFT JOIN dough
                        ON a.recipeID = dough.recipeID) AS b    
                    UNION
                    SELECT c.date, c.recipeID, c.recipe_mass, (dough.amount_pc * c.ing_mass) AS ing_mass, dough.ingredientID AS base_ingID, c.base_recipeID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID, "" AS note,  "2" AS "level"
                        FROM (SELECT b.date, b.recipeID, b.recipe_mass, b.ing_mass, b.base_ingID, ingredients.recipeID AS base_recipeID, b.base, b.titleID, b.sortID
                            FROM (SELECT a.date, dough.recipeID AS recipeID, a.mass AS recipe_mass, (dough.amount_pc * a.mass) AS ing_mass, dough.ingredientID AS base_ingID, dough.base, dough.titleID AS titleID, dough.sortID AS sortID				
                                FROM (SELECT daylist.date, SUM(daylist.mass) as mass, daylist.recipeID 
                                    FROM daylist 
                                    WHERE date = ?
                                    GROUP BY daylist.recipeID) AS a 
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
                                            GROUP BY daylist.recipeID) AS a 
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
                    ON e.base_recipeID = dough.recipeID`, [date,date,date], (derr, dresult) =>{
                        if(derr){
                            console.log(derr)
                        } else {
                            
                        }
                    });
                        }
                   });
                    
                };
            })
            res.send(result)
        };
    })
});

router.delete("/delete", isLoggedIn, (req, res) => {

    const ID = req.body.ID;

    db.query("DELETE FROM daylist WHERE ID = ?", ID, (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});

module.exports = router;