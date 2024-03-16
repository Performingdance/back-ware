const express = require('express');
const router = express.Router();
const {isLoggedIn, authRole} = require('../middleware/basicAuth.js');
const db = require('../lib/db.js');

router.get("/img", isLoggedIn, (req, res) => {
    db.query(`SELECT DISTINCT a.recipeID AS ID, recipes.name, a.img
    FROM (SELECT DISTINCT recipeID, img FROM  recipe_form) as a
       LEFT JOIN recipes
        ON recipeID = recipes.ID
        WHERE name IS NOT NULL `, (err, result) =>{
         if(err){
            console.log(err)
         } else {
            res.send(result)
         }
    });
});
router.post("/id", isLoggedIn, (req, res) => {
   const ID = req.body.ID;
   db.query(`SELECT * FROM recipes WHERE ID = ? `, ID, (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});
router.post("/form/id", isLoggedIn, (req, res) => {
    const recipeID = req.body.recipeID;
    db.query(`SELECT a.*, form.name FROM
    (SELECT * FROM recipe_form WHERE recipeID = ?) AS a
    JOIN form
    ON a.formID = form.ID`, recipeID, (err, result) =>{
         if(err){
            console.log(err)
         } else {
            res.send(result)
         }
    });
});
router.post("/form/prices", isLoggedIn, (req, res) => {
   const productID = req.body.productID;
   db.query(`SELECT a.*, CONCAT(marges.name, ' (', marges.marge_pc,'%)') AS name  
            FROM (SELECT * FROM prices WHERE productID = ?) AS a
            LEFT JOIN marges
            ON marges.ID = a.margeID`, productID, (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});
router.post("/forms", isLoggedIn, (req, res) => {
   const recipeID = req.body.recipeID;
   db.query(`SELECT a.*, form.name FROM
   (SELECT formID AS ID, recipeID, img FROM recipe_form WHERE recipeID = ?) AS a
   JOIN form
   ON a.ID = form.ID`, recipeID, (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});

router.put("/form/new", isLoggedIn, (req, res) => {
   const recipeID = req.body.recipeID;
   const formID = req.body.formID; 
   const formweight = req.body.formweight;
   const img = req.body.img;
   const worktime = req.body.worktime;
   const workamount = req.body.workamount;
   const vkp_netto = req.body.vkp_netto;

   db.query("SELECT ID FROM recipe_form WHERE formID = ? AND recipeID = ?", [formID, recipeID], (err,result)=>{
      if(err || !result.length){
         db.query("INSERT INTO recipe_form (recipeID, formID, formweight, img, worktime, workamount, vkp_netto) VALUES (?,?,?,?,?,?,?)", 
         [recipeID, formID, formweight, img, worktime, workamount, vkp_netto], 
         (err, result)=>{
            if (err){
               console.log(err)
            } else {
               const productID = result.insertId;
               db.query("SELECT ID FROM marges", 
               (err, result)=>{
                  if (err){
                     console.log(err)
                  } else {
                     for(i=0;i<=result.length; i++){
                        let margeID = result[i].ID
                        db.query("INSERT INTO prices (productID, margeID) VALUES (?,?)", 
                        [productID, margeID], 
                        (err, result)=>{
                           if (err){
                              console.log(err)
                           } else {
                             
                           }
                        });
                     }
                     res.send("success")
                  }
               });
            }
         });    
      } else {
         res.send(("Form bereits eingespeichert"))
      }

   });
});
router.put("/form/update", isLoggedIn, (req, res) => {
   const formID = req.body.formID;
   const productID = req.body.productID; 
   const formweight = req.body.formweight;
   const product_name = req.body.product_name;
   const worktime = req.body.worktime;
   const workamount = req.body.workamount;
   const vkp_netto = req.body.vkp_netto || 0;
   const priceList = req.body.priceList || [];

         db.query("UPDATE recipe_form SET formID = ?, formweight = ?, product_name = ?, worktime = ?, workamount = ?, vkp_netto = ? WHERE ID = ?", 
         [ formID, formweight, product_name, worktime, workamount, vkp_netto, productID], 
         (err, result)=>{
            if (err){
               console.log(err)
            } else {
               if(priceList.length > 0){
                  for(let i=0;i<=priceList.length;i++){
                     let margeID = priceList[i].margeID
                     let price = priceList[i].price || 0

                     db.query("UPDATE prices SET price = ? WHERE productID = ? AND margeID = ?", 
                     [ price, productID, margeID], 
                     (err, result)=>{
                        if (err){
                           console.log(err)
                        } else {
                           res.send("success")
                        }
                     });  
                  }

               }else{
                  res.send("success")
               }
               
            }
         });  
});

router.put("/form/update/nvp", isLoggedIn, (req, res) => {
   const ID = req.body.ID;
   const vkp_netto = req.body.vkp_netto || 0;


         db.query("UPDATE recipe_form SET  vkp_netto = ? WHERE ID = ?", 
         [ vkp_netto, ID], 
         (err, result)=>{
            if (err){
               console.log(err)
            } else {
               res.send(result)
            }
         });  
});
router.put("/form/update/prices", isLoggedIn, (req, res) => {
   const priceList = req.body.priceList || [];

   if(priceList.length){
      for(let i=0;i<=priceList.length;i++){
         let margeID = priceList[i].margeID
         let productID = priceList[i].productID
         let price = priceList[i].price || 0

         db.query("UPDATE prices SET price = ? WHERE productID = ? AND margeID = ?", 
         [ price, productID, margeID], 
         (err, result)=>{
            if (err){
               console.log(err)
            } else {
               res.send("success")
            }
         });  
      }

   }
});

router.delete("/form/delete", isLoggedIn, (req,res) => {
   const ID = req.body.ID;

   db.query("DELETE FROM recipe_form WHERE ID = ?", ID, (err, result) => {
      if(err){
         console.log(err)
      } else {
         db.query("DELETE FROM prices WHERE productID = ?", ID, (err, result) => {
            if(err){
               console.log(err)
            } else {
               res.send(result)
            }
         });
      }
   });
});

router.get("/searchbyname", isLoggedIn, (req, res) => {
    const searchbyname = "%" + req.body.searchbyname +"%";
    db.query("SELECT name, ID FROM recipes WHERE name LIKE ?", searchbyname, (err, result) =>{
         if(err){
            console.log(err)
         } else {
            res.send(result)
         }
    });
});
router.get("/searchbyid", isLoggedIn, (req, res) => {
   const ID = req.body.ID;
   db.query("SELECT * FROM recipes WHERE ID=?", ID, (err, result) =>{
        if(err){
           console.log(err)
        } else {
           res.send(result)
        }
   });
});

router.put("/new", isLoggedIn, (req, res) => {
   const name = req.body.name;
   db.query("SELECT ID FROM recipes WHERE name = ?", name, (err,result)=>{
      if(err || !result.length){
         db.query("INSERT INTO recipes (name) VALUES (?)", name, (err, bresult)=>{
            if(err){
               console.log(err)
            } else {
               const recipeID = bresult.insertId;
               db.query("INSERT INTO ingredients (name, amount, recipeID) VALUES (?,?, ?)", [name, 1, recipeID], (err, cresult)=>{
                  if(err){
                     console.log(err)
                  } else {
                     
                  }
               }); 
               res.send(bresult)
            }
         });    
      } else {
         res.send(name + " bereits eingespeichert")
      }

   });
   
});

router.put("/update", isLoggedIn, (req, res) => {
   const ID = req.body.ID;
   const name = req.body.name;

   db.query("UPDATE recipes SET name = ? WHERE ID = ?", 
   [name, ID], 
   (err, result) => {
      if(err){
         console.log(err)
      } else {
         db.query("UPDATE ingredients SET name = ? WHERE recipeID = ?", 
         [name, ID], 
         (err, result) => {
            if(err){
               console.log(err)
            } else {
            }
         });
         res.send(result)
      }
   });
});
router.get("/all", isLoggedIn, (req, res) => {

   db.query("SELECT * FROM recipes",  
   (err, result) => {
      if(err){
         console.log(err)
      } else {
         res.send(result)
      }
   });
});



router.delete("/delete", isLoggedIn, (req,res) => {
   const ID = req.body.ID;
   db.query("SELECT ID FROM ingredients WHERE recipeID = ?", ID, (err, result) => {
      if(err){
         console.log(err)
      } else {
         
         let ingID 
         if(result.length){
            ingID = result[0].ID
         } else{
            ingID = -1
            }  
         console.log(ingID)
         db.query("SELECT ID FROM dough WHERE ingredientID = ?", ingID, (berr, bresult) => {
            if(berr){
               console.log(berr)
            } else {
                 if(bresult.length == 0){
                  db.query("SELECT ID FROM daylist WHERE recipeID = ?", ID, (cerr, cresult) => {
                     if(cerr){
                        console.log(cerr)
                     } else {
                          if(cresult.length == 0){
                           db.query("DELETE FROM recipes WHERE ID = ?", ID, (derr, dresult) => {
                              if(derr){
                                 console.log(derr)
                              } else {
                                 db.query("DELETE FROM ingredients WHERE recipeID = ?", ID, (eerr, eresult) => {
                                    if(err){
                                       console.log(eerr)
                                    } else {
                                       db.query("DELETE FROM recipe_form WHERE recipeID = ?", ID, (ferr, fresult) => {
                                          if(ferr){
                                             console.log(ferr)
                                          } else {
                                             res.send("success")  
                                          }
                                       }) 
                                    }
                                 });
                              }
                           });
                        
         
                          }else{
                           res.send("Rezept noch in der Tagesliste eingespeichert - ID" + result)
                          }    
                     }
                  });

                 }else{
                  res.send("Rezept noch als Grundteig eingespeichert bei ID" +result)
                 }    
            }
         });    
      }
   });
});
   

router.get("/base/update", isLoggedIn, (req, res) => {
   
   db.query("SELECT max(recipeID) AS maxID FROM ingredients WHERE recipeID > 0", (err,result)=>{
      if(err){
         res.send(err)
      }
      else{
         const maxID = result[0].maxID
         
         //console.log(ID_list)
         //Update calculated Ingredients of recipe:
         for(let i=1; i<=maxID;i++ ){
            let ID = i
            db.query(`   
            SELECT c.recipeID, 
            TRIM(LEADING ', ' FROM GROUP_CONCAT(DISTINCT c.allergen SEPARATOR ', '))  AS allergen,
            SUM(c.priceKG_part) AS priceKG_sum,
            SUM(c.kj_part) AS kj_sum,
            SUM(c.kcal_part) AS kcal_sum,
            SUM(c.protein_part) AS protein_sum,
            SUM(c.carbs_part) AS carbs_sum,
            SUM(c.sugar_part) AS sugar_sum,
            SUM(c.fat_part) AS fat_sum,
            SUM(c.sat_fat_part) AS sat_fat_sum,
            SUM(c.fibres_part) AS fibres_sum,
            SUM(c.salt_part) AS salt_sum
            FROM (SELECT 
            b.recipeID,
            b.ID,
            b.allergen,
            b.priceKG * amount_pc priceKG_part,
            b.kj * amount_pc kj_part,
            b.kcal * amount_pc kcal_part,
            b.protein * amount_pc protein_part,
            b.carbs * amount_pc carbs_part,
            b.sugar * amount_pc sugar_part,
            b.fat * amount_pc fat_part,
            b.sat_fat * amount_pc sat_fat_part,
            b.fibres * amount_pc fibres_part,
            b.salt * amount_pc salt_part
            
            FROM (SELECT dough_ID.amount_pc, dough_ID.recipeID, ingredients.ID, ingredients.allergen, ingredients.price, ingredients.priceKG, ingredients.kj, ingredients.kcal, ingredients.protein, ingredients.carbs, ingredients.sugar, ingredients.fat, ingredients.sat_fat, ingredients.fibres, ingredients.salt
               FROM (SELECT * FROM dough WHERE recipeID = ?) AS dough_ID
               LEFT JOIN ingredients
               ON ingredients.ID = dough_ID.ingredientID AND dough_ID.recipeID) AS b) AS c`, 
            [ID], 
            (berr, bresult) => {
               if(err){
                  console.log(berr)
               } else {
                 // console.log(bresult)
                  let allergen = bresult[0].allergen;
                  let price = bresult[0].priceKG_sum;
                  let priceKG = bresult[0].priceKG_sum;
                  let kj = bresult[0].kj_sum;
                  let kcal = bresult[0].kcal_sum;
                  let protein = bresult[0].protein_sum;
                  let carbs = bresult[0].carbs_sum;
                  let sugar = bresult[0].sugar_sum;
                  let fat = bresult[0].fat_sum;
                  let sat_fat = bresult[0].sat_fat_sum;
                  let fibres = bresult[0].fibres_sum;
                  let salt = bresult[0].salt_sum;

                  if(bresult[0].recipeID != null){
                     db.query("UPDATE ingredients SET allergen = ?, price = ?, priceKG = ?, date = now (), kj = ?, kcal = ?, protein = ?, carbs = ?, sugar = ?, fat = ?, sat_fat = ?, fibres = ?, salt = ? WHERE recipeID = ?", 
                     [allergen, price, priceKG, kj, kcal, protein, carbs, sugar, fat, sat_fat, fibres, salt, ID], 
                     (cerr) => {
                        if(cerr){
                           console.log(cerr)
                        }
                        else{
                           return
                        }
                     });
                  } 
                  return              
               }

            })
            
         
      };
         
         res.send("recipes sucessfully updated")
      }
   })
});
router.post("/ing/id", isLoggedIn, (req, res) => {
   const ID = req.body.recipeID
   db.query(`SELECT b.*, titles.title, titles.title_sortID 
   FROM( SELECT dough.*, ingredients.name FROM (SELECT * FROM dough WHERE recipeID = ?) AS dough
       LEFT JOIN ingredients
       ON dough.ingredientID = ingredients.ID) AS b
   LEFT JOIN titles
   ON b.titleID = titles.ID
   ORDER BY title_sortID ASC`,[ID],  
   (err, result) => {
      if(err){
         console.log(err)
      } else {
         res.send(result)
      }
   });
});
router.put("/ing/new", isLoggedIn, (req, res) => {
   const recipeID = req.body.recipeID;
   const ingredientID = req.body.ingredientID;
   let base
   const amount = req.body.amount;
   const titleID = req.body.titleID;
   db.query("SELECT * FROM ingredients WHERE ID = ? AND recipeID > 0",
   [ingredientID], 
   (err, result) => {
      if(err){
         console.log(err)
      } else {
      if(result.length = 0){
         base = 0
      }else{
         base = 1
      }
         db.query("INSERT INTO dough (recipeID, ingredientID, amount, base, titleID) VALUES (?, ?, ?, ?, ?)",
         [recipeID, ingredientID, amount, base, titleID], 
         (err, result) => {
            if(err){
               console.log(err)
            } else {
               // console.log(result);
               const ID = result.insertId;
               db.query("SELECT SUM(amount) AS totalamount FROM dough WHERE recipeID = ?",
               [recipeID], 
               (err, aresult) => {
               if(err){
                  console.log(err)
               } else {
                  const totalamount = aresult[0].totalamount;
   
                  db.query("UPDATE recipes SET amount = ? WHERE ID = ?", 
                  [totalamount, recipeID], 
                  (berr,bresult) => {
                     if(berr){
                        console.log(berr)
                     } else {
                        db.query("SELECT amount, ID FROM dough WHERE recipeID = ?", 
                        [recipeID], 
                        (cerr,cresult) => {
                           if(cerr){
                              console.log(cerr)
                           } else{
                              //const ingamounts = cresult.amount;
                              
                              //console.log(cresult[0].amount);
   
                              for(let i = 0;i < cresult.length; i++) {
                                 const amount_pc = parseFloat(cresult[i].amount / totalamount).toFixed(3);
                                 const ingID = cresult[i].ID;
                                 db.query("UPDATE dough SET amount_pc = ? WHERE ID = ?", 
                              [amount_pc, ingID], 
                              (derr,dresult) => {
                                 if(derr){
                                    console.log(derr)
                                 }        
                              });
                           };
                        }});
                     }
                  });
   
                  };
               });
            }
         });
      res.send(result);

   }
});
   
});

router.put("/ing/update", isLoggedIn, (req, res) => {
   const ID = req.body.ID;
   const amount = req.body.amount;
   const recipeID = req.body.recipeID;

   db.query("UPDATE dough SET amount = ? WHERE ID = ?",
    [amount, ID], 
    (err, result) => {
      if(err){
         console.log(err)
      } else {
         db.query("SELECT SUM(amount) AS totalamount FROM dough WHERE recipeID = ?",
         [recipeID], 
         (err, aresult) => {
           if(err){
              console.log(err)
           } else {
            const totalamount = aresult[0].totalamount;
            db.query("UPDATE recipes SET amount = ? WHERE ID = ?", 
            [totalamount, recipeID], 
            (berr,bresult) => {
               if(berr){
                  console.log(berr)
               } else {
                  db.query("SELECT amount, ID FROM dough WHERE recipeID = ?", 
                  [recipeID], 
                  (cerr,cresult) => {
                     if(cerr){
                        console.log(cerr)
                     } else{
                        //const ingamounts = cresult.amount;
                        
                        //console.log(cresult[0].amount);

                        for(let i = 0;i < cresult.length; i++) {
                           const amount_pc = parseFloat(cresult[i].amount / totalamount).toFixed(3);
                           const ingID = cresult[i].ID;
                           db.query("UPDATE dough SET amount_pc = ? WHERE ID = ?", 
                        [amount_pc, ingID], 
                        (derr,dresult) => {
                           if(derr){
                              console.log(derr)
                           }        
                        });
                     };
                  }});
         }});

      }});
   }
      res.send(result)
   });
});

router.put("/ing/sort/update", isLoggedIn, (req, res) => {
   const ID = req.body.ID;
   const sortID = req.body.orderID;

   db.query("UPDATE dough SET sortID = ? WHERE ID = ?",
    [sortID, ID], 
    (err, result) => {
      if(err){
         console.log(err)
      } else {
         res.send(result)
      }
   });
});

router.delete("/ing/delete", isLoggedIn, (req,res) => {
   const ID = req.body.ID;

   db.query("DELETE FROM dough WHERE ID = ?", ID, (err, result) => {
      if(err){
         console.log(err)
      } else {
         res.send(result)
      }
   });
});
router.delete("/ing/title/delete", isLoggedIn, (req,res) => {
   const recipeID = req.body.recipeID;
   const titleID = req.body.titleID;

   db.query("DELETE FROM dough WHERE recipeID = ? AND titleID = ?", [recipeID,titleID], (err, result) => {
      if(err){
         console.log(err)
      } else {
         db.query("DELETE FROM titles WHERE recipeID = ? AND ID = ?", [recipeID,titleID], (err, result) => {
            if(err){
               console.log(err)
            } 
         });
         res.send(result)
      }
   });
});

router.put("/ins/new", isLoggedIn, (req, res) => {
   const recipeID = req.body.recipeID;
   const insTitleID = req.body.insTitleID;
   const insTitle = req.body.insTitle;
   const instruction = req.body.instruction;

   db.query("INSERT INTO instructions (recipeID, insTitleID, insTitle, instruction) VALUES (?, ?, ?, ?)",
   [recipeID, insTitleID, insTitle, instruction], 
   (err, result) => {
      if(err){
         console.log(err)
      } else {
         res.send(result)
      }
   });
});

router.put("/ins/update", isLoggedIn, (req, res) => {
   const ID = req.body.ID;
   const insTitleID = req.body.insTitleID;
   const insTitle = req.body.insTitle;
   const instruction = req.body.instruction;

   db.query("UPDATE instructions SET insTitleID = ?, insTitle = ?, instruction = ? WHERE ID = ?",
    [insTitleID, insTitle, instruction, ID], 
    (err, result) => {
      if(err){
         console.log(err)
      } else {
         res.send(result)
      }
   });
});
router.post("/ins/id", isLoggedIn, (req, res) => {
   const recipeID = req.body.recipeID;

   db.query("SELECT * FROM instructions WHERE recipeID = ?",
    [recipeID], 
    (err, result) => {
      if(err){
         console.log(err)
      } else {
         res.send(result)
      }
   });
});

router.delete("/ins/delete", isLoggedIn, (req,res) => {
   const ID = req.body.ID;

   db.query("DELETE FROM instructions WHERE ID = ?", ID, (err, result) => {
      if(err){
         console.log(err)
      } else {
         res.send(result)
      }
   });
});

module.exports = router;