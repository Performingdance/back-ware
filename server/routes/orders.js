const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/basicAuth.js');
const db = require('../lib/db.js');

router.get("/all", isLoggedIn, (req, res) =>{
    db.query(`SELECT a.ID, a.invoiceID, a.clientID, a.notes, DATE_FORMAT(a.order_date , "%d.%m.%y") AS order_date, CONCAT(company," (", first_name, " ", last_name, ")") AS client 
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
    db.query(`SELECT a.ID, a.invoiceID, a.clientID, a.notes, DATE_FORMAT(a.order_date , "%d.%m.%y") AS order_date, DATE_FORMAT(a.delivery_date , "%d.%m.%y") AS delivery_date, CONCAT(company," (", first_name, " ", last_name, ")") AS client 
        FROM (SELECT * FROM orders WHERE ID = ?) AS a
            LEFT JOIN clients
            ON a.clientID = clients.ID`, [orderID], (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});
router.post("/ID/ing", isLoggedIn, (req, res) =>{
    const orderID = req.body.orderID;
    db.query(`
    SELECT b.*, recipes.name AS recipe_name 
        FROM (SELECT a.*, form.name AS form_name 
             FROM (
                SELECT ID, formID, recipeID, CAST(amount AS SIGNED ) AS amount, orderID , DATE_FORMAT(production_date , "%d.%m.%y") AS production_date, DATE_FORMAT(delivery_date , "%d.%m.%y") AS delivery_date
                    FROM orders_items WHERE orderID = ?) as a
        LEFT JOIN form
        ON form.ID = a.formID) AS b
    LEFT JOIN recipes
    ON recipes.ID = b.recipeID
    ORDER BY b.recipeID
    `, [orderID, orderID], (err, result) =>{
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
    FROM (SELECT * FROM orders 
        WHERE invoiceID IS null
        ORDER BY order_date DESC) AS a
    LEFT JOIN clients
    ON a.clientID = clients.ID`, (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});
router.post("/all/client/noInvoice", isLoggedIn, (req, res, next) => {   
    const clientID = req.body.clientID;

            db.query(`SELECT ID, CONCAT("#" , ID , " (" , DATE_FORMAT(order_date , "%d.%m.%y") , ")") AS name 
            FROM orders 
            WHERE clientID = ? AND invoiceID IS NULL`, 
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


            db.query(`SELECT ID, CONCAT("#" , ID , " (" , DATE_FORMAT(order_date , "%d.%m.%y") , ")") AS name 
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
    const recipeID = req.body.recipeID;
    const productID = req.body.productID;
    const formID = req.body.formID;
    const amount = req.body.amount;
    const delivery_date = req.body.delivery_date;
    const production_date = req.body.production_date;

            db.query("INSERT INTO orders_items (orderID, productID, recipeID, formID, amount, delivery_date, production_date) VALUES (?,?,?,?,?,?,?)", 
            [orderID, productID, recipeID, formID, amount, delivery_date, production_date], 
            (err, result) =>{
                if(err){
                    console.log(err)
                } else{
                    db.query("INSERT INTO daylist (date, recipeID, formID, amount, orderID) VALUES (?, ?, ?, ?, ?)", 
                    [bake_date, recipeID, formID, amount, orderID], 
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
            
});

router.put("/update", isLoggedIn, (req, res, next) => {
    const orderID = req.body.orderID;
    const clientID = req.body.clientID;
    const order_date = req.body.order_date;
    const delivery_date = req.body.delivery_date;
    const delivery_date_end = req.body.delivery_date_end;
    const notes = req.body.notes;

    db.query("UPDATE orders SET order_date = ?, delivery_date = ?, delivery_date_end = ?,  clientID = ?, notes = ? WHERE ID = ?", 
    [order_date, delivery_date,delivery_date_end, clientID, notes, orderID], 
    (err, result) =>{
        if(err){
            console.log(err)
        } else{
            res.send(result)
        }
    })
});
router.put("/update/items", isLoggedIn, (req, res, next) => {
    const ID = req.body.ID;
    const orderID = req.body.orderID;
    const recipeID = req.body.recipeID;
    const formID = req.body.formID;
    const amount = req.body.amount;
    const delivery_date = req.body.delivery_date;
    const production_date = req.body.production_date;

 
    db.query("UPDATE orders_items SET amount = ?, delivery_date = ?, production_date = ? WHERE ID = ?", 
    [ amount, delivery_date, production_date, ID], 
    (err, result) =>{
        if(err){
            console.log(err)
        } else{
            db.query("SELECT ID FROM daylist WHERE orderID = ? AND recipeID = ? AND formID = ?", [orderID, recipeID, formID], (aerr, aresult) => {
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
                            mass = (SELECT( ? * (SELECT formweight FROM recipe_form WHERE recipeID = ? and formID = ?)) AS mass) 
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
                    [bake_date, amount, daylistID], 
                    (berr, bresult) =>{
                        if(err){
                            console.log(berr)
                        } else{
                                        
                            db.query(`
                            UPDATE daylist SET 
                            mass = (SELECT( ? * (SELECT formweight FROM recipe_form WHERE recipeID = ? and formID = ?)) AS mass) 
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
    });
     
});
router.put("/update/items/all", isLoggedIn, (req, res, next) => {
    const items = req.body.changedItems
    items.forEach(item => {
        const ID = item.ID;
        const orderID = item.orderID;
        const recipeID = item.recipeID;
        const formID = item.formID;
        const amount = item.amount;
        const delivery_date = item.delivery_date;
        const production_date = item.production_date;
        db.query("UPDATE orders_items SET amount = ?, delivery_date = ?, production_date = ? WHERE ID = ?", 
        [ amount, delivery_date, production_date, ID], 
        (err, result) =>{
            if(err){
                console.log(err)
            } else{
                db.query("SELECT ID FROM daylist WHERE orderID = ? AND recipeID = ? AND formID = ?", [orderID, recipeID, formID], (aerr, aresult) => {
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
                                mass = (SELECT( ? * (SELECT formweight FROM recipe_form WHERE recipeID = ? and formID = ?)) AS mass) 
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
                        [bake_date, amount, daylistID], 
                        (berr, bresult) =>{
                            if(err){
                                console.log(berr)
                            } else{
                                            
                                db.query(`
                                UPDATE daylist SET 
                                mass = (SELECT( ? * (SELECT formweight FROM recipe_form WHERE recipeID = ? and formID = ?)) AS mass) 
                                WHERE orderID = ?`, 
                                [amount, recipeID, formID, ID], 
                                (bberr, bbresult) =>{
                                    if(berr){
                                        console.log(bberr)
                                    } else{
                                    };
                                })
                            };
                        })
                    }
                })
            };
        });    
    });
    res.send("success");
});


router.delete("/delete/item", isLoggedIn, (req, res) => {

    const ID = req.body.ID;
    const orderID = req.body.orderID;
    const recipeID = req.body.recipeID;
    const formID = req.body.formID;
    const date = req.body.date;
    db.query("DELETE FROM orders_items WHERE ID = ? AND orderID = ?", [ID,orderID], (err, result) =>{
        if(err){
           console.log(err)
        } else {
            db.query("DELETE FROM daylist WHERE date = ? AND orderID = ? AND recipeID = ? AND formID = ?",[date, orderID, recipeID, formID], (berr, bresult) =>{
                if(berr){
                   console.log(berr)
                } else {
                   res.send(bresult)
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