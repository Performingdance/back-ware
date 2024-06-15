const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/basicAuth.js');
const db = require('../lib/db.js');

router.get("/all", isLoggedIn, (req, res) =>{
    db.query(`SELECT a.ID, a.clientID, a.notes, DATE_FORMAT(a.order_date , "%d.%m.%y") AS order_date, CONCAT(company," (", first_name, " ", last_name, ")") AS client, a.billed_items, a.total_items
    FROM (SELECT * FROM orders) AS a
        LEFT JOIN clients
        ON a.clientID = clients.ID
        ORDER BY ID DESC`, (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});
router.post("/ID", isLoggedIn, (req, res) =>{
    const orderID = req.body.orderID;
    db.query(`SELECT b.*, DATE_FORMAT(MIN(orders_items.delivery_date) , "%d.%m.%y") AS delivery_date,
                DATE_FORMAT(MAX(orders_items.delivery_date) , "%d.%m.%y") AS delivery_date_end
                FROM(SELECT a.ID, a.clientID, a.notes, DATE_FORMAT(a.order_date , "%d.%m.%y") AS order_date, CONCAT(company," (", first_name, " ", last_name, ")") AS client, a.total_items, a. billed_items
                        FROM (SELECT * FROM orders WHERE ID = ?) AS a
                    LEFT JOIN clients
                    ON a.clientID = clients.ID) AS b
                LEFT JOIN orders_items
                ON b.ID = orders_items.orderID 
                GROUP BY ID, clientID, notes, order_date, client, total_items, billed_items`,
        [orderID], (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});
router.post("/ID/prod", isLoggedIn, (req, res) =>{
    const orderID = req.body.orderID;
    db.query(`
    SELECT a.*, products.product_name
    FROM
        (SELECT ID, productID, CAST(amount AS SIGNED ) AS amount, orderID , DATE_FORMAT(production_date , "%d.%m.%y") AS production_date, DATE_FORMAT(delivery_date , "%d.%m.%y") AS delivery_date, invoiceID
        FROM orders_items WHERE orderID = ?) AS a
    LEFT JOIN products
    ON a.productID = products.ID
    ORDER BY a.productID
    `, [orderID], (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});

router.post("/all/date", isLoggedIn, (req, res) =>{
    const delivery_date = req.body.delivery_date;
    db.query("SELECT * FROM orders WHERE delivery_date = ?", delivery_date, (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});
router.get("/all/noInvoice", isLoggedIn, (req, res) =>{
    db.query(`SELECT a.*, CONCAT(company," (", first_name, " ", last_name, ")") AS client 
    FROM (SELECT orders.clientID, orders.ID, orders.billed_items, orders.total_items FROM orders_items 
          LEFT JOIN orders 
          ON orders.ID = orders_items.orderID
        WHERE orders_items.invoiceID IS null
       	GROUP BY orderID, clientID, billed_items, total_items
        ORDER BY orders.order_date DESC) AS a
    LEFT JOIN clients
    ON a.clientID = clients.ID;`, (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});
router.post("/all/client/noInvoice", isLoggedIn, (req, res, next) => {   
    const clientID = req.body.clientID;

            db.query(`SELECT a.*, CONCAT(company," (", first_name, " ", last_name, ")") AS client 
                FROM (SELECT orders.clientID, orders.ID, orders.billed_items, orders.total_items FROM orders_items 
                    LEFT JOIN orders 
                    ON orders.ID = orders_items.orderID
                    WHERE orders_items.invoiceID IS null AND orders.clientID=5
                    GROUP BY orderID, clientID, billed_items, total_items
                    ORDER BY orders.order_date DESC) AS a
                LEFT JOIN clients
                ON a.clientID = clients.ID`, 
            [clientID],
            (err, result) =>{
                if(err){
                    console.log(err)
                } else{
                    res.send(result)
                };
            })
            
});
router.post("/client/items/noInvoice", isLoggedIn, (req, res, next) => {   
    const clientID = req.body.clientID;

            db.query(`SELECT b.*,CONCAT(b.amount , "x ", products.product_name) AS name , products.vkp_netto AS price_piece, (products.vkp_netto*b.amount) AS price_total  
                FROM( SELECT a.*, orders.clientID 
                        FROM(SELECT * FROM orders_items
                        WHERE invoiceID IS NULL) AS a
                    LEFT JOIN orders
                    ON a.orderID = orders.ID
                    WHERE orders.clientID = ?) AS b
                LEFT JOIN products
                ON b.productID = products.ID;`, 
            [clientID],
            (err, result) =>{
                if(err){
                    console.log(err)
                } else{
                    res.send(result)
                };
            })
            
});
router.get("/all/items/noInvoice", isLoggedIn, (req, res, next) => {   


            db.query(`SELECT ID, product_name AS name, DATE_FORMAT(order_date , "%d.%m.%y") AS order_date, DATE_FORMAT(delivery_date , "%d.%m.%y") AS delivery_date  
            FROM order_items 
            WHERE invoiceID IS NULL`, 
            [clientID],
            (err, result) =>{
                if(err){
                    console.log(err)
                } else{
                    res.send(result)
                };
            })
            
});
router.post("/all/client", isLoggedIn, (req, res, next) => {   
    const clientID = req.body.clientID;

            db.query(`SELECT ID, CONCAT("#" , ID , " (" , DATE_FORMAT(order_date , "%d.%m.%y") , ")") AS name, invoiceID 
            FROM orders 
            WHERE clientID = ?
            ORDER BY ID DESC`, 
            [clientID],
            (err, result) =>{
                if(err){
                    console.log(err)
                } else{
                    res.send(result)
                };
            })
            
});
router.put("/new", isLoggedIn, (req, res, next) => {   
    const clientID = req.body.clientID;

            db.query("INSERT INTO orders (order_date, clientID) VALUES (now(), ?)", [clientID],
            (err, result) =>{
                if(err){
                    console.log(err)
                } else{
                    res.send(result)
                };
            })
            
});
router.put("/new/item", isLoggedIn, (req, res, next) => {   
    const orderID = req.body.orderID;
    const productID = req.body.productID;
    const amount = req.body.amount;
    const order_date = req.body.order_date
    const delivery_date = req.body.delivery_date || req.body.production_date;
    const production_date = req.body.production_date;

            db.query("INSERT INTO orders_items (orderID, productID, amount, order_date, production_date, delivery_date) VALUES (?,?,?,?,?,?)", 
            [orderID, productID, amount, order_date, production_date, delivery_date], 
            (err, result) =>{
                if(err){
                    console.log(err)
                } else{
                    db.query("SELECT recipeID, formID FROM products WHERE ID = ?", 
                    [productID], 
                    (err, result) =>{
                        if(err){
                            console.log(err)
                        } else{
                            const recipeID = result[0].recipeID;
                            const formID = result[0].formID;
                
                            db.query("INSERT INTO daylist (date, recipeID, formID, amount, orderID) VALUES (?, ?, ?, ?, ?)", 
                            [production_date, recipeID, formID, amount, orderID], 
                            (err, result) =>{
                                if(err){
                                    console.log(err)
                                } else{
                                    const ID = result.insertId;
                        
                                    db.query(`
                                    UPDATE daylist SET 
                                    mass = (SELECT( ? * (SELECT formweight FROM products WHERE ID = ?)) AS mass) 
                                    WHERE ID = ?`, 
                                    [amount, productID, ID], 
                                    (berr, bresult) =>{
                                        if(berr){
                                            console.log(berr)
                                        } else{
                                            db.query(`
                                            UPDATE orders SET 
                                                total_items = (SELECT COUNT(ID) AS total_items FROM orders_items WHERE orderID = ?)
                                            WHERE ID = ?`, 
                                            [orderID, orderID], 
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
                        };
                    })
                };
            })
            
});

router.put("/update", isLoggedIn, (req, res, next) => {
    const orderID = req.body.orderID;
    const clientID = req.body.clientID;
    const order_date = req.body.order_date;
    const notes = req.body.notes;

    db.query("UPDATE orders SET order_date = ?,  clientID = ?, notes = ? WHERE ID = ?", 
    [order_date,  clientID, notes, orderID], 
    (err, result) =>{
        if(err){
            console.log(err)
        } else{
            db.query("UPDATE orders_items SET order_date = ? WHERE orderID = ?", 
            [order_date, orderID], 
            (err, result) =>{
                if(err){
                    console.log(err)
                } else{
                }
            })
            res.send("success")
        }
    })
});
router.put("/update/items", isLoggedIn, (req, res, next) => {
    const ID = req.body.ID;
    const productID = req.body.productID;
    const orderID = req.body.orderID;
    const amount = req.body.amount;
    const delivery_date = req.body.delivery_date;
    const production_date = req.body.production_date;

 
    db.query("UPDATE orders_items SET amount = ?, delivery_date = ?, production_date = ? WHERE ID = ?", 
    [ amount, delivery_date, production_date, ID], 
    (err, result) =>{
        if(err){
            console.log(err)
        } else{
            db.query("SELECT recipeID, formID FROM products WHERE ID = ?", 
                    [productID], 
                    (err, result) =>{
                        if(err){
                            console.log(err)
                        } else{
                            const recipeID = result[0].recipeID;
                            const formID = result[0].formID;
                
                            
            db.query("SELECT ID FROM daylist WHERE orderID = ? AND recipeID = ? AND formID = ?", [orderID, recipeID, formID], (aerr, aresult) => {
                //console.log(aresult)
                if(aerr){
                    console.log(aerr)
                } 
                if (!aresult.length ){
                
                    db.query("INSERT INTO daylist (date, recipeID, formID, amount, orderID) VALUES (?, ?, ?, ?, ?)", 
                    [production_date, recipeID, formID, amount, orderID], 
                    (aaerr, result) =>{
                        if(aaerr){
                            console.log(aaerr)
                        } else{
                            const ID = result.insertId;
                
                            db.query(`
                            UPDATE daylist SET 
                            mass = (SELECT( ? * (SELECT formweight FROM products WHERE productID = ? )) AS mass) 
                            WHERE ID = ?`, 
                            [amount, recipeID, formID, ID], 
                            (aaaerr, aaaresult) =>{
                                if(aaaerr){
                                    console.log(aaaerr)
                                } else{
                                    res.send("success");
                                };
                            })
                        };
                    })
                
                }else{
                    const daylistID = aresult[0].ID;
                    db.query("UPDATE daylist SET date = ?, amount = ? WHERE ID = ? ", 
                    [production_date, amount, daylistID], 
                    (berr, bresult) =>{
                        if(err){
                            console.log(berr)
                        } else{
                                        
                            db.query(`
                            UPDATE daylist SET 
                            mass = (SELECT( ? * (SELECT formweight FROM products WHERE recipeID = ? and formID = ?)) AS mass) 
                            WHERE orderID = ?`, 
                            [amount, recipeID, formID, ID], 
                            (bberr, bbresult) =>{
                                if(berr){
                                    console.log(bberr)
                                } else{
                                    res.send("success");
                                };
                            })
                        };
                    })
                }
            })
                        };
                    })
        };
    });
     
});
router.put("/update/items/all", isLoggedIn, (req, res, next) => {
    const items = req.body.changedItems
    items.forEach(item => {
        const itemID = item.ID;
        const productID = item.productID;
        const orderID = item.orderID;
        const amount = item.amount;
        const delivery_date = item.delivery_date.includes(".")?.replace(/(..).(..).(..)/, "20$3-$2-$1");
        const production_date = item.production_date.includes(".")?.replace(/(..).(..).(..)/, "20$3-$2-$1");
        db.query("UPDATE orders_items SET amount = ?, delivery_date = ?, production_date = ? WHERE ID = ?", 
        [ amount, delivery_date, production_date, itemID], 
        (err, result) =>{
            if(err){
                console.log(err)
            } else{
                db.query("SELECT recipeID, formID FROM products WHERE ID = ?", 
                    [productID], 
                    (err, result) =>{
                        if(err){
                            console.log(err)
                        } else{
                            const recipeID = result[0].recipeID;
                            const formID = result[0].formID;

                        db.query("SELECT ID FROM daylist WHERE orderID = ? AND recipeID = ? AND formID = ?", 
                            [orderID, recipeID, formID], (aerr, aresult) => {
                            //console.log(aresult)
                            if(aerr){
                                console.log(aerr)
                            } 
                            if (!aresult.length ){
                            
                                db.query("INSERT INTO daylist (date, recipeID, formID, amount, orderID) VALUES (?, ?, ?, ?, ?)", 
                                [bake_date, recipeID, formID, amount, orderID], 
                                (aaerr, result) =>{
                                    if(aaerr){
                                        console.log(aaerr)
                                    } else{
                                        const ID = result.insertId;
                            
                                        db.query(`
                                        UPDATE daylist SET 
                                        mass = (SELECT( ? * (SELECT formweight FROM products WHERE recipeID = ? and formID = ?)) AS mass) 
                                        WHERE ID = ?`, 
                                        [amount, recipeID, formID, ID], 
                                        (aaaerr, aaaresult) =>{
                                            if(aaaerr){
                                                console.log(aaaerr)
                                            } else{
                                                
                                            };
                                        })
                                    };
                                })
                            
                            }else{
                                const daylistID = aresult[0].ID;
                                db.query("UPDATE daylist SET date = ?, amount = ? WHERE ID = ? ", 
                                [production_date, amount, daylistID], 
                                (berr, bresult) =>{
                                    if(err){
                                        console.log(berr)
                                    } else{
                                                    
                                        db.query(`
                                        UPDATE daylist SET 
                                        mass = (SELECT( ? * (SELECT formweight FROM products WHERE recipeID = ? and formID = ?)) AS mass) 
                                        WHERE orderID = ?`, 
                                        [amount, recipeID, formID, orderID], 
                                        (bberr, bbresult) =>{
                                            if(berr){
                                                console.log(bberr)
                                            } else{
                                                db.query("DELETE FROM worksheet WHERE date LIKE ? AND ID >= 0", production_date, (err, result) =>{
                                                    if(err){
                                                    console.log(err)
                                                    } else {
                                                    db.query(`INSERT INTO worksheet (date, recipeID, recipe_mass, ing_mass, base_ingID, base_recipeID, base, titleID, sortID, note, level)
                                                    SELECT res.* 
                                                    FROM(SELECT b.*, "1" AS "level"
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
                                                        ON e.base_recipeID = dough.recipeID) AS res
                                                        WHERE base_ingID IS NOT NULL`, [production_date,production_date,production_date], (err, result) =>{
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
                    }
                })
            };
        });           
     };
    });    
    });
    res.send("success");
});


router.delete("/delete/item", isLoggedIn, (req, res) => {

    const orderID = req.body.orderID;
    const itemID = req.body.productID;
    const date = req.body.date;
    db.query("DELETE FROM orders_items WHERE ID = ? AND orderID = ?", [itemID,orderID], (err, result) =>{
        if(err){
           console.log(err)
        } else {
            db.query(`SELECT recipeID, formID
                FROM orders_items
                LEFT JOIN products
                ON orders_items.productID = products.ID
                WHERE orders_items.ID = ?
                `,[itemID], (err, result) =>{
                if(err){
                   console.log(err)
                } else {
                    const recipeID = result[0].recipeID
                    const formID = result[0].formID
                    db.query("DELETE FROM daylist WHERE date = ? AND orderID = ? AND recipeID = ? AND formID = ?",[date, orderID, recipeID, formID], (berr, bresult) =>{
                        if(berr){
                           console.log(berr)
                        } else {
                            db.query(`
                            UPDATE orders SET 
                                total_items = (SELECT COUNT(ID) AS total_items FROM orders_items WHERE orderID = ?)
                            WHERE ID = ?`, 
                            [orderID, orderID], 
                            (berr, bresult) =>{
                                if(berr){
                                    console.log(berr)
                                } else{
                                    res.send("success");
                                };
                            })
                        }
                   });
                }
           });
        }
   });
});

router.delete("/delete", isLoggedIn, (req, res) => {

    const orderID = req.body.orderID;
    db.query("DELETE FROM orders WHERE ID = ?", orderID, (err, result) =>{
        if(err){
           console.log(err)
        } else {
            db.query("DELETE FROM daylist WHERE orderID = ?", orderID, (berr, bresult) =>{
                if(berr){
                   console.log(berr)
                } else {
                   res.send(bresult)
                }
           });
        }
   });
});

module.exports = router;