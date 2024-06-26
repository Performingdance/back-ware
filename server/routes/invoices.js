const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/basicAuth.js');
const db = require('../lib/db.js');

// get all invoices
router.get("/all", isLoggedIn, (req, res) =>{
    db.query(`SELECT b.*, CONCAT(marges.name, ' (', marges.marge_pc,'%)') AS marge 
    FROM(SELECT a.ID, a.invoice_number, a.clientID, CONCAT_WS(" ", clients.first_name, clients.last_name) AS fullName, clients.company,  a.total_sum_netto, a.total_sum_brutto, a.is_paid, DATE_FORMAT(a.invoice_date , "%d.%m.%y") AS invoice_date, a.invoice_part, a.margeID
        FROM(SELECT * FROM invoices) AS a
        LEFT JOIN clients
        ON a.clientID = clients.ID) AS b
    LEFT JOIN marges
    ON b.margeID = marges.ID
    ORDER BY b.invoice_number, b.invoice_part, b.invoice_date DESC`, (err, result) =>{
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
    SELECT d.*, DATE_FORMAT(MIN(invoices_items.delivery_date) , "%d.%m.%y") AS delivery_date, 
    DATE_FORMAT(MAX(invoices_items.delivery_date) , "%d.%m.%y") AS delivery_date_end
        FROM(
        SELECT c.ID, c.clientID, c.invoice_number, DATE_FORMAT(c.invoice_date , "%d.%m.%y") AS invoice_date, c.invoice_part, 
        CONCAT(company," (", first_name, " ", last_name, ")") AS client, c.total_sum_netto, c.total_sum_brutto, c.is_paid, c.margeID, c.marge_name, c.tax, c.notes
            FROM
                (SELECT a.*, CONCAT(marges.name, ' (', marges.marge_pc,'%)') AS marge_name, marges.tax 
                FROM
                    (SELECT * FROM invoices WHERE ID = ?) AS a
                LEFT JOIN marges
                on a.margeID = marges.ID) AS c
        LEFT JOIN clients
        ON c.clientID = clients.ID) AS d
    LEFT JOIN invoices_items
    ON d.ID = invoices_items.invoiceID
    `,invoiceID, (err, result) =>{
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
    SELECT c.ID, c.invoiceID, c.clientID, c.orderID, c.productID, c.product_name, c.amount, DATE_FORMAT(c.order_date , "%d.%m.%y") AS order_date, DATE_FORMAT(c.delivery_date , "%d.%m.%y") AS delivery_date, CONCAT(clients.company," (", clients.first_name, " ", clients.last_name, ")") AS client, c.price_piece, c.price_total, c.tax 
            FROM
            (SELECT * FROM invoices_items WHERE invoiceID = ?) AS c
    LEFT JOIN clients
    ON c.clientID = clients.ID
    ORDER BY c.delivery_date ASC`,invoiceID, (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});
router.post("/ID/tax", isLoggedIn, (req, res) =>{
    const invoiceID = req.body.invoiceID;

    db.query(`
    SELECT invoiceID,tax,TRUNCATE(SUM(price_total),2) AS total , TRUNCATE(SUM(price_total)*(1-tax*0.01),2) AS total_netto, TRUNCATE(SUM(price_total)*(tax*0.01),2) AS total_tax
    FROM invoices_items
    WHERE invoiceID = ?
    GROUP BY invoiceID,tax
    `,invoiceID, (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});
router.post("/ID/margeChange", isLoggedIn, (req, res) =>{
    const invoiceID = req.body.invoiceID;
    const margeID = req.body.margeID || 1;
 
    db.query(`
    UPDATE invoices_items JOIN prices 
    ON invoices_items.productID = prices.productID AND prices.margeID = ?
    SET invoices_items.price_piece = prices.price,
        invoices_items.price_total = prices.price*invoices_items.amount
    WHERE invoices_items.invoiceID = ?`, 
    [margeID, invoiceID], 
    (err, result) =>{
        if(err){
            console.log(err)
        } else {
            res.send("success")
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
    const tax = req.body.tax || 7;

    if((productID >= 1)){
        db.query(`INSERT INTO invoices_items 
            (invoiceID, clientID, productID, product_name, amount, price_piece, price_total, order_date, delivery_date, tax) 
            VALUES (?,?,?,?,?,?,?,?,?,?) `, 
            [invoiceID, clientID, productID, product_name, amount, price_piece, price_total, order_date, delivery_date, tax], 
            (err, result) =>{
                if(err){
                    console.log(err)
                } else{
                       
                };
            })

    }else{
        db.query(`INSERT INTO invoices_items 
        (invoiceID, clientID, productID, product_name, amount, price_piece, price_total, order_date, delivery_date,tax) 
        VALUES (?,?,?,?,?,?,?,?,?,?) `, 
        [invoiceID, clientID, productID, product_name, amount, price_piece, price_total, order_date, delivery_date,tax], 
        (err, result) =>{
            if(err){
                console.log(err)
            } else{
                 
            };
        })
    }

    res.send("success")  
});
// Add unpaid Item of client to invoice
router.post("/new/client/item", isLoggedIn, (req, res, next) => {

    const invoiceID = req.body.invoiceID;
    const clientID = req.body.clientID;
    const productID = req.body.productID;
    const orderID = req.body.orderID;
    let product_name = req.body.product_name;
    const amount = req.body.amount;
    const price_piece = req.body.price_piece;
    const price_total = req.body.price_total;
    const order_date = req.body.delivery_date;
    const production_date = req.body.production_date;
    const delivery_date = req.body.delivery_date;
    const orderItemID = req.body.orderItemID;
    const tax = req.body.tax || 7;

    if((productID >= 1)){
        db.query("SELECT product_name FROM products WHERE ID = ?", 
        [productID], 
        (err, result) =>{
            if(err){
                console.log(err)
            } else{
                product_name = result[0].product_name
                db.query(`INSERT INTO invoices_items 
                (invoiceID, clientID, productID, product_name, amount, price_piece, price_total, order_date, production_date, delivery_date,tax) 
                VALUES (?,?,?,?,?,?,?,?,?,?,?) `, 
                [invoiceID, clientID, productID, product_name, amount, price_piece, price_total, order_date, production_date, delivery_date,tax], 
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
                                db.query(`UPDATE orders 
                                    SET  
                                    total_items =
                                    (SELECT COUNT(ID) AS total_items 
                                                FROM orders_items 
                                                WHERE orderID = ?),
                                    billed_items = (SELECT COUNT(ID) AS billed_items 
                                                FROM orders_items 
                                                WHERE orderID = ? AND invoiceID > 0)
                                    WHERE ID = ?           
                                    `, 
                                [orderID,orderID,orderID], 
                                (err, result) =>{
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
        });
        res.send("success")
    }

        
});

// add all open items (orders) from a client to the invoice
router.post("/new/items/client", isLoggedIn, (req, res, next) => {
    const clientID = req.body.clientID;
    const invoiceID = req.body.invoiceID;
    let orderID

    db.query(`
    INSERT INTO invoices_items 
    (invoiceID, clientID, orderID, productID, amount, order_date, production_date, delivery_date, product_name, price_piece, price_total, tax)
    SELECT ? as invoiceID, b.*, products.product_name, products.vkp_netto, (products.vkp_netto * amount) AS price_total 
    FROM(
        SELECT a.clientID, orders_items.orderID, orders_items.productID, orders_items.amount, orders_items.order_date, orders_items.production_date, orders_items.delivery_date, orders_items.tax
        FROM(
            SELECT ID, clientID FROM orders 
            WHERE clientID = ?
        ) AS a
    LEFT JOIN orders_items
    ON orders_items.orderID = a.ID
    WHERE invoiceID IS NULL) AS b
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
                    [clientID], 
                    (err, res) =>{
                        if(err){
                            console.log(err)
                        } else {
                            //console.log(res)
                            res.forEach((obj)=>{
                                orderID = obj.ID
                                db.query(`UPDATE orders_items SET invoiceID = ? WHERE invoiceID IS NULL AND orderID = ?`, 
                                [invoiceID, orderID], 
                                (err, result) =>{
                                    if(err){
                                        console.log(err)
                                    } else {
                                        db.query(`UPDATE orders 
                                            SET  
                                            total_items =
                                            (SELECT COUNT(ID) AS total_items 
                                                        FROM orders_items 
                                                        WHERE orderID = ?),
                                            billed_items = (SELECT COUNT(ID) AS billed_items 
                                                        FROM orders_items 
                                                        WHERE orderID = ? AND invoiceID > 0)
                                            WHERE ID = ?           
                                            `, 
                                        [orderID,orderID,orderID], 
                                        (err, result) =>{
                                            if(err){
                                                console.log(err)
                                            } else {
                                                
                                            }
                                        });
                                    }
                                });
                            })
                          
                        }
                    });
                }
            });
            res.send("success")
        };   
    })
});

// add one order to invoice
router.post("/new/items/order", isLoggedIn, (req, res, next) => {
    const orderID = req.body.orderID;
    const clientID = req.body.clientID;
    const invoiceID = req.body.invoiceID;

    db.query(`INSERT INTO invoices_items 
    (invoiceID, clientID, orderID ,productID, amount,  production_date, delivery_date, order_date, notes, product_name, price_piece, price_total, tax) 
    SELECT b.*, products.product_name, products.vkp_netto, (products.vkp_netto * b.amount) AS price_total, products.tax
    FROM (SELECT a.*, orders.order_date, orders.notes
        FROM (SELECT ? AS invoiceID, ? AS clientID, orderID, productID,  amount, production_date, delivery_date  
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
                db.query(`UPDATE orders 
                    SET  
                    total_items =
                    (SELECT COUNT(ID) AS total_items 
                                FROM orders_items 
                                WHERE orderID = ?),
                    billed_items = (SELECT COUNT(ID) AS billed_items 
                                FROM orders_items 
                                WHERE orderID = ? AND invoiceID > 0)
                    WHERE ID = ?           
                    `, 
                [orderID,orderID,orderID], 
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
    let invoice_number = ""
    let invoiceID = -1
    let margeID = -1

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
            invoice_number = result[0].last_invoice +1;
            margeID = result[0].margeID;
        db.query(`INSERT INTO invoices (clientID, invoice_number, invoice_date, margeID) VALUES (?,?,?,?)`, 
        [clientID, invoice_number, invoice_date, margeID], 
        (err, result) =>{
            if(err){
                console.log(err)
            } else{
                invoiceID = result.insertId
                res.send({"invoice_number": invoice_number, "invoiceID" : invoiceID})

            };
        })
        };
        
    })
});


// Update invoice in general
router.put("/update", isLoggedIn, (req, res, next) => {
   const invoiceID = req.body.invoiceID;
   const clientID = req.body.clientID;
   const invoice_date = req.body.invoice_date;
   const invoice_number = req.body.invoice_number;
   const margeID = req.body.margeID;
   const notes = req.body.notes;

   db.query("UPDATE invoices SET clientID = ?, invoice_date = ?, invoice_number = ?, margeID = ?, notes = ? WHERE ID = ?", 
   [clientID, invoice_date, invoice_number, margeID, notes, invoiceID], 
   (err, result) =>{
       if(err){
           console.log(err)
       } else{
           res.send("success");
       };
   });
    
});

// update delivery date to create a partial Invoice
router.put("/update/deliverydate", isLoggedIn, (req, res, next) => {
    const invoiceID = req.body.invoiceID;
    const delivery_date_end = req.body.delivery_date_end;
    let invoice_part = req.body.invoice_part || 0;

    if(invoice_part == 0){
        invoice_part = parseInt(invoice_part)+1
        db.query(`
            UPDATE invoices
            SET invoice_part = ?
            WHERE ID = ?`, 
        [invoice_part, invoiceID], 
        (err, result) =>{
            if(err){
                console.log(err)
            } else{
            };
        });
    }
    db.query(`
        INSERT INTO invoices
        (clientID, invoice_number, invoice_date, margeID, notes, invoice_part ) 
        SELECT clientID, invoice_number, invoice_date, margeID, notes, invoice_part+1 
        FROM invoices 
        WHERE ID = ?`, 
    [invoiceID], 
    (err, result) =>{
        if(err){
            console.log(err)
        } else{
            const newInvoiceID = result.insertId
            db.query(`
                UPDATE invoices_items 
                SET invoiceID = ? 
                WHERE invoiceID = ? AND delivery_date > ?
                `, 
            [newInvoiceID, invoiceID, delivery_date_end], 
            (err, result) =>{
                if(err){
                    console.log(err)
                } else{
    
                };
            });
            
        };
    });
    res.send("success");
     
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
router.put("/update/items/all", isLoggedIn, (req, res, next) => {
    const items = req.body.changedItems
    items.forEach((item)=>{
        const itemID = item.ID;
        const amount = item.amount;
        const price_piece = item.price_piece;
        const price_total = item.price_total;
        const tax = item.tax || 7;
        const delivery_date = item.delivery_date;
        const order_date = item.order_date;
        const product_name = item.product_name;
        db.query("UPDATE invoices_items SET product_name = ?, amount = ?, price_piece = ?, price_total = ?, order_date = ?, delivery_date = ?, tax = ? WHERE ID = ?", 
            [product_name, amount, price_piece, price_total, order_date, delivery_date, tax, itemID], 
        (err, result) =>{
            if(err){
                console.log(err)
            } else{
            };
        });
    })
    res.send("success");
 
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
                db.query("UPDATE orders_items SET invoiceID = NULL WHERE invoiceID = ?", 
                [invoiceID], 
                (berr, bresult) =>{
                    if(berr){
                        console.log(berr)
                    } else{
                        orderIDs.forEach((order)=>{
                            db.query(`
                            UPDATE orders 
                                SET  
                                total_items =
                                (SELECT COUNT(ID) AS total_items 
                                            FROM orders_items 
                                            WHERE orderID = ?),
                                billed_items = (SELECT COUNT(ID) AS billed_items 
                                            FROM orders_items 
                                            WHERE orderID = ? AND invoiceID > 0)
                                WHERE ID = ?            

                                `, 
                            [order.orderID, order.orderID, order.orderID], 
                            (berr, bresult) =>{
                                if(berr){
                                    console.log(berr)
                                } else{
                                    
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
                db.query("UPDATE orders_items SET invoiceID = NULL WHERE invoiceID = ? AND productID = ?", 
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