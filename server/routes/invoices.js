const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/basicAuth.js');
const db = require('../lib/db.js');

// get all invoices
router.get("/all", isLoggedIn, (req, res) =>{
    db.query(`SELECT b.*, CONCAT(marges.name, ' (', marges.marge_pc,'%)') AS marge 
    FROM(SELECT a.ID, a.invoice_number, a.clientID, CONCAT_WS(" ", clients.first_name, clients.last_name) AS fullName, clients.company,  a.total_sum_netto, a.total_sum_brutto, a.is_paid, DATE_FORMAT(a.invoice_date , "%d.%m.%y") AS invoice_date, a.margeID
        FROM(SELECT * FROM invoices) AS a
        LEFT JOIN clients
        ON a.clientID = clients.ID) AS b
    LEFT JOIN marges
    ON b.margeID = marges.ID`, (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});
router.post("/ID", isLoggedIn, (req, res) =>{
    const invoiceID = req.body.invoiceID;

    db.query(`
    SELECT c.ID, c.clientID, c.invoice_number, DATE_FORMAT(c.invoice_date , "%d.%m.%y") AS invoice_date, CONCAT(company," (", first_name, " ", last_name, ")") AS client, c.total_sum_netto, c.total_sum_brutto, c.is_paid, c.margeID, c.marge_name
        FROM
            (SELECT a.*, CONCAT(marges.name, ' (', marges.marge_pc,'%)') AS marge_name 
             FROM
                (SELECT * FROM invoices WHERE ID = ?) AS a
            LEFT JOIN marges
            on a.margeID = marges.ID) AS c
    LEFT JOIN clients
    ON c.clientID = clients.ID`,invoiceID, (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});
router.post("/ID/prod", isLoggedIn, (req, res) =>{
    const invoiceID = req.body.invoiceID;

    db.query(`
    SELECT c.ID, c.invoiceID, c.clientID, c.orderID, c.productID, c.product_name, c.amount, DATE_FORMAT(c.order_date , "%d.%m.%y") AS order_date, DATE_FORMAT(c.delivery_date , "%d.%m.%y") AS delivery_date, CONCAT(clients.company," (", clients.first_name, " ", clients.last_name, ")") AS client, c.price_piece, c.price_total 
            FROM
            (SELECT * FROM invoices_items WHERE invoiceID = ?) AS c
    LEFT JOIN clients
    ON c.clientID = clients.ID`,invoiceID, (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});
// search invoices by client
router.post("/searchbyclient", isLoggedIn, (req, res) => {
    const clientID = req.body.clientID;
    db.query("SELECT * FROM invoices WHERE clientID = ? ", clientID, (err, result) =>{
         if(err){
            console.log(err)
         } else {
            res.send(result)

            
         }
    });
});
// select unpaid invoices
router.get("/unpaid", isLoggedIn, (req, res) => {
    db.query(`SELECT ID, clientID, invoice_number, DATE_FORMAT(invoice_date , "%d.%m.%y") AS invoice_date, total_sum_brutto, total_sum_netto, is_paid, margeID
     FROM invoices WHERE is_paid IS null `, (err, result) =>{
         if(err){
            console.log(err)
         } else {
            res.send(result)

            
         }
    });
});
router.get("/invoiceno", isLoggedIn, (req, res) => {
    db.query(`SELECT ID, clientID, CONCAT("#",invoice_number, " (",DATE_FORMAT(invoice_date , "%d.%m.%y"), ")") AS name, is_paid
     FROM invoices WHERE is_paid IS null `, (err, result) =>{
         if(err){
            console.log(err)
         } else {
            res.send(result)

            
         }
    });
});
// add item from catalog to invoice
router.post("/new/item", isLoggedIn, (req, res, next) => {

    const invoiceID = req.body.invoiceID;
    const clientID = req.body.clientID;
    const productID = req.body.productID
    let product_name = req.body.product_name;
    const amount = req.body.amount;
    const price_piece = req.body.price_piece;
    const price_total = req.body.price_total;
    const order_date = req.body.delivery_date;
    const delivery_date = req.body.delivery_date;

    if((productID >= 1)){
        db.query("SELECT product_name FROM products WHERE ID = ?", 
        [productID], 
        (err, result) =>{
            if(err){
                console.log(err)
            } else{
                product_name = result[0].product_name
                db.query(`INSERT INTO invoices_items 
                (invoiceID, clientID, productID, product_name, amount, price_piece, price_total, order_date, delivery_date) 
                VALUES (?,?,?,?,?,?,?,?,?) `, 
                [invoiceID, clientID, productID, product_name, amount, price_piece, price_total, order_date, delivery_date], 
                (err, result) =>{
                    if(err){
                        console.log(err)
                    } else{
                            res.send("success")
                    };
                })
            };
        });

    }else{
        db.query(`INSERT INTO invoices_items 
        (invoiceID, clientID, productID, product_name, amount, price_piece, price_total, order_date, delivery_date) 
        VALUES (?,?,?,?,?,?,?,?,?) `, 
        [invoiceID, clientID, productID, product_name, amount, price_piece, price_total, order_date, delivery_date], 
        (err, result) =>{
            if(err){
                console.log(err)
            } else{
                    res.send("success")
            };
        })
    }

        
});
// Add unpaid Item of client to invoice
router.post("/new/client/item", isLoggedIn, (req, res, next) => {

    const invoiceID = req.body.invoiceID;
    const clientID = req.body.clientID;
    const productID = req.body.productID
    let product_name = req.body.product_name;
    const amount = req.body.amount;
    const price_piece = req.body.price_piece;
    const price_total = req.body.price_total;
    const order_date = req.body.delivery_date;
    const production_date = req.body.production_date;
    const delivery_date = req.body.delivery_date;
    const orderItemID = req.body.orderItemID;

    if((productID >= 1)){
        db.query("SELECT product_name FROM products WHERE ID = ?", 
        [productID], 
        (err, result) =>{
            if(err){
                console.log(err)
            } else{
                product_name = result[0].product_name
                db.query(`INSERT INTO invoices_items 
                (invoiceID, clientID, productID, product_name, amount, price_piece, price_total, order_date, production_date, delivery_date) 
                VALUES (?,?,?,?,?,?,?,?,?,?) `, 
                [invoiceID, clientID, productID, product_name, amount, price_piece, price_total, order_date, production_date, delivery_date], 
                (err, result) =>{
                    if(err){
                        console.log(err)
                    } else{
                        db.query(`UPDATE orders_items SET invoiceID = ? WHERE ID = ?`, 
                        [invoiceID, orderItemID], 
                        (berr, result) =>{
                            if(berr){
                                console.log(berr)
                            } else {
                                res.send("success")
                            }
                        });
                    };
                })
            };
        });

    }

        
});

// add all open items (orders) from a client to the invoice
router.post("/new/items/client", isLoggedIn, (req, res, next) => {
    const clientID = req.body.clientID;
    const invoiceID = req.body.invoiceID;
    let orderID

    db.query(`
    INSERT INTO invoices_items 
    (invoiceID, clientID, orderID, productID, amount, order_date, production_date, delivery_date, product_name, price_piece, price_total)
    SELECT ? as invoiceID, b.*, products.product_name, products.vkp_netto, (products.vkp_netto * amount) AS price_total 
    FROM(
        SELECT a.clientID, orders_items.orderID, orders_items.productID, orders_items.amount, orders_items.order_date, orders_items.production_date, orders_items.delivery_date
        FROM(
            SELECT ID, clientID FROM orders 
            WHERE clientID = ?
        ) AS a
    LEFT JOIN orders_items
    ON orders_items.orderID = a.ID AND invoiceID IS NULL 
    ) AS b
    LEFT JOIN products
    ON products.ID = b.productID;
        `, 
    [invoiceID, clientID], 
    (err, result) =>{
        if(err){
            console.log(err)
        } else{
            db.query(`
            UPDATE orders SET invoiceID = ? 
                WHERE clientID = ? AND invoiceID IS NULL
            `, 
            [invoiceID, clientID], 
            (berr, bres) =>{
                if(berr){
                    console.log(berr)
                } else {
                    db.query(`
                    SELECT ID         
                        FROM orders
                        WHERE clientID = ?`, 
                    [invoiceID, clientID], 
                    (cerr, cres) =>{
                        if(cerr){
                            console.log(cerr)
                        } else {
                            console.log(cres, cres[0].ID)
                            cres.forEach((obj)=>{
                                orderID = obj.ID
                                db.query(`UPDATE orders_items SET invoiceID = ? WHERE invoiceID IS NULL AND orderID = ?`, 
                                [invoiceID, orderID], 
                                (berr, result) =>{
                                    if(berr){
                                        console.log(berr)
                                    } else {
                                       
                                    }
                                });
                            })
                          
                        }
                    });
                }
            });
        };
        res.send("success")
    })
});

// add one order to invoice
router.post("/new/items/order", isLoggedIn, (req, res, next) => {
    const orderID = req.body.orderID;
    const clientID = req.body.clientID;
    const invoiceID = req.body.invoiceID;

    db.query(`INSERT INTO invoices_items 
    (invoiceID, clientID, orderID ,productID, amount, order_date, production_date, delivery_date, product_name, price_piece, price_total) 
    SELECT b.*, products.product_name, products.vkp_netto, (products.vkp_netto * amount) AS price_total
    FROM (SELECT a.*
        FROM (SELECT ? AS invoiceID, ? AS clientID, orderID, productID, amount, delivery_date  
            FROM orders_items 
            WHERE orderID = ? AND invoiceID IS NULL) as a
        LEFT JOIN orders
        ON a.orderID = orders.ID) as b
    LEFT JOIN products
    ON b.productID = products.ID`, 
    [invoiceID, clientID, orderID], 
    (err, result) =>{
        if(err){
            console.log(err)
        } else{
        db.query("UPDATE orders_items SET invoiceID = ? WHERE orderID = ?", 
        [invoiceID, orderID], 
        (err, result) =>{
            if(err){
                console.log(err)
            } else {
                db.query("UPDATE orders SET invoiceID = ? WHERE ID = ?", 
                [invoiceID, orderID], 
                (err, result) =>{
                    if(err){
                        console.log(err)
                    } else {
                       
                    }
                });
            }
        });
        };
        res.send("success")
    })
});

router.put("/new", isLoggedIn, (req, res, next) => {
    const clientID = req.body.clientID;
    const invoice_date = req.body.invoice_date

    db.query(`SELECT a.last_invoice, clients.margeID
        FROM (SELECT MAX(invoice_number) as last_invoice 
        FROM invoices) as a
    LEFT JOIN clients
    ON ID = ?`, 
    clientID, 
    (err, result) =>{
        if(err){
            console.log(err)
        } else{
        const invoice_number = result[0].last_invoice +1;
        const margeID = result[0].margeID;
        db.query(`INSERT INTO invoices (clientID, invoice_number, invoice_date, margeID) VALUES (?,?,?,?)`, 
        [clientID, invoice_number, invoice_date, margeID], 
        (err, res) =>{
            if(err){
                console.log(err)
            } else{
                res.send(res);
            };
        })
        };

    })
});


// Update invoice in general
router.put("/update", isLoggedIn, (req, res, next) => {
   const ID = req.body.ID;
   const clientID = req.body.clientID;
   const invoice_date = req.body.invoice_date;
   const invoice_number = req.body.invoice_number;
   const margeID = req.body.margeID;

   db.query("UPDATE invoices SET clientID = ?, invoice_date = ?, invoice_number = ?, margeID = ? WHERE ID = ?", 
   [clientID, invoice_date, invoice_number, margeID, ID], 
   (err, result) =>{
       if(err){
           console.log(err)
       } else{
           res.send("success");
       };
   });
    
});
//claculate price for invoice_items
router.put("/update/item/price", isLoggedIn, (req, res, next) => {
    const invoiceID = req.body.invoiceID;
    const clientID = req.body.clientID;

    db.query(`SELECT ID FROM invoices_items
    WHERE invoiceID = ? AND clientID = ?`,[invoiceID, clientID] , 
    (err, result) =>{
        if(err){
           console.log(err)
        } else {
            for (i=0; i<result.length; i++){
                let invoice_itemID = result[i].ID
                db.query(`SELECT marge_pc*vkp_netto AS price_piece, c.amount*marge_pc*vkp_netto AS price_total
                    FROM (SELECT b.*, marge_pc/100 as marge_pc
                        FROM (SELECT a.*, invoices.margeID
                            FROM (SELECT recipeID, formID, amount , invoiceID
                                FROM invoices_items
                                WHERE ID = ?) AS a
                            LEFT JOIN invoices
                            ON a.invoiceID = invoices.ID) AS b
                        LEFT JOIN marges
                        ON b.margeID = marges.ID) as c
                    LEFT JOIN products
                    ON c.recipeID = products.recipeID AND c.formID = products.formID`, 
                    [invoice_itemID], 
                (berr, bresult) =>{
                    if(berr){
                        console.log(berr)
                    } else{
                        let price_piece = bresult[0].price_piece
                        let price_total = bresult[0].price_total
                        db.query(`UPDATE invoices_items SET price_piece = ?, price_total = ?
                        WHERE ID = ?`, 
                        [price_piece, price_total, invoice_itemID], 
                        (cerr, cresult) =>{
                        if(cerr){
                            console.log(cerr)
                        }
                        });
                    };
                });
            }
            res.send("success");
        }
   });
   
 });

// Update items on invoice
router.put("/update/item", isLoggedIn, (req, res, next) => {
    const productID = req.body.productID;
    const clientID = req.body.clientID;
    const recipeID = req.body.recipeID;
    const formID = req.body.formID;
    let name = req.body.name;
    const amount = req.body.amount;
    const order_date = req.body.delivery_date;
    const delivery_date = req.body.delivery_date;

    if((recipeID >= 1) && (formID >= 1)){
        db.query("SELECT product_name FROM products WHERE ID = ?", 
        [clientID,recipeID, formID, name, amount, order_date, delivery_date, productID], 
        (err, result) =>{
            if(err){
                console.log(err)
            } else{
                name = result[0].product_name
                db.query("UPDATE invoices_items SET clientID = ?, recipeID = ?, formID = ?, name = ?, amount = ?, order_date = ?, delivery_date = ? WHERE ID = ?", 
                [clientID,recipeID, formID, name, amount, order_date, delivery_date, productID], 
                (err, result) =>{
                    if(err){
                        console.log(err)
                    } else{
                        res.send("success");
                    };
                });
            };
        });

    }else{
        db.query("UPDATE invoices_items SET clientID = ?, recipeID = ?, formID = ?, name = ?, amount = ?, order_date = ?, delivery_date = ? WHERE ID = ?", 
        [clientID,recipeID, formID, name, amount, order_date, delivery_date, productID], 
        (err, result) =>{
            if(err){
                console.log(err)
            } else{
                res.send("success");
            };
        });
    }
 
   
     
 });

 // mark invoice as paid
router.put("/update/is_paid", isLoggedIn, (req, res, next) => {
    const invoiceID = req.body.invoiceID;
    const is_paid = req.body.is_paid;

    db.query("UPDATE invoices SET is_paid = ? WHERE ID = ?", 
    [is_paid, invoiceID], 
    (err, result) =>{
        if(err){
            console.log(err)
        } else{
            res.send("success");
        };
    });
     
 });
// delete invoice, delete items from invoices_items and reset orders - invoiceID if necessary
router.delete("/delete", isLoggedIn, (req, res) => {

   const invoiceID = req.body.invoiceID;


   db.query(`DELETE invoices, 
   invoices_items 
   FROM invoices
   INNER JOIN invoices_items 
   ON invoices_items.invoiceID = invoices.ID
   WHERE invoices.ID = ?`, invoiceID, 
   (err, result) =>{
       if(err){
          console.log(err)
       } else {
        db.query(`
        SELECT DISTINCT orderID FROM orders_items WHERE invoiceID = ?`, 
        [invoiceID], 
        (err, result) =>{
            if(err){
                console.log(err)
            } else{
                const orderIDs = result
                db.query("UPDATE orders_items SET invoiceID = null WHERE invoiceID = ?", 
                [invoiceID], 
                (berr, bresult) =>{
                    if(berr){
                        console.log(berr)
                    } else{
                        orderIDs.forEach((order)=>{
                            db.query(`
                            UPDATE orders SET 
                                billed_items = (SELECT COUNT(ID) AS total_items FROM orders_items WHERE orderID = ? AND invoiceID IS NOT NULL)
                            WHERE ID = ?`, 
                            [order.orderID, order.orderID], 
                            (berr, bresult) =>{
                                if(berr){
                                    console.log(berr)
                                } else{
                                    db.query(`
                                    UPDATE orders SET 
                                        invoiceID = NULL 
                                    WHERE ID = ? AND invoiceID = ?`, 
                                    [order.orderID,invoiceID], 
                                    (berr, bresult) =>{
                                        if(berr){
                                            console.log(berr)
                                        } else{
                                            
                                        };
                                    })
                                    
                                };
                            })
                        })
                        
                    };
                });
                                
            };
        })
        res.send("success")
       }
  });
});

// delete single Item from Invoice
router.delete("/delete/item", isLoggedIn, (req, res) => {

    const invoice_itemID = req.body.invoice_itemID;
    const invoiceID = req.body.invoiceID;
    const productID = req.body.productID;
    const orderID = req.body.orderID;
 
    db.query("DELETE FROM invoices_items WHERE ID = ?", invoice_itemID, 
    (err, result) =>{
        if(err){
           console.log(err)
        } else {
            if(productID != -1){
                db.query("UPDATE orders_items SET invoiceID = null WHERE invoiceID = ? AND productID =?", 
                [invoiceID, productID], 
                (berr, bresult) =>{
                    if(berr){
                        console.log(berr)
                    } else{
                        db.query(`
                            UPDATE orders SET 
                                billed_items = (SELECT COUNT(ID) AS total_items FROM orders_items WHERE orderID = ? AND invoiceID IS NOT NULL)
                            WHERE ID = ?`, 
                        [orderID, orderID], 
                        (berr, bresult) =>{
                            if(berr){
                                console.log(berr)
                            } else{
                                
                            };
                        })
                    };
                });
            }else{
                
            };
            res.send("success");
        }
   });
 });

module.exports = router;