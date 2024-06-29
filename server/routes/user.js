const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid')

const db = require('../lib/db.js');
const {validateRegister,isLoggedIn} = require('../middleware/basicAuth.js');

router.get("/all", isLoggedIn, (req, res, next) => {
    db.query("SELECT * FROM users", (err,result) =>{
        if(err){
            console.log(err)
            res.send(err)
        }else{
            res.send(result);
        }
    })
    
});

router.post("/sign-up", validateRegister, (req, res, next) => {
    const username = req.body.username;
    db.query(`SELECT id FROM users WHERE LOWER(username) = LOWER(?)`, username, (err, result) => {
        if(result && result.length) {//error
            return res.status(409).send({
                message: "Benutzername bereits vergeben"
            });
        } else {    // username not in use
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {

                    return res.statusMessage(500).send({
                        message: err,
                    });
                } else {
                    db.query(`INSERT INTO users (id, username, password, registered) VALUES ('${uuid.v4()}',${db.escape(req.body.username)},'${hash}', now());`,
                    (err, result) => {
                        if(err) {
                            return res.status(400).send({
                                message: err,
                            });
                        }
                        return res.status(201).send({
                            message: "Erfolgreich registriert!"
                        })
                    }
                                        
                    )
                }
            });
        }
    })
})

router.post("/login", (req, res, next) => {
    db.query(`SELECT * FROM users WHERE username = ${db.escape(req.body.username)};`,
    (err, result) => {
        if(err) {
            return res.status(400).send({
                message: err,
            });
        }
        if(!result.length){
            return res.status(400).send({
                message: 'Benutzername oder Passwort stimmt nicht!'
            });
        }
        bcrypt.compare(req.body.password, result[0]['password'], (bErr, bResult) => {
            if(bErr){
                return res.status(400).send({
                    message: 'Benutzername oder Passwort stimmt nicht!'
                })
            }
            if(bResult) {   // password match
                const token = jwt.sign({
                    username:result[0].username,
                    userId: result[0].id,
                    userRole: result[0].role
                    }, 'Klee', {expiresIn: "7d"}
                    );
                db.query(`UPDATE users SET last_login = now() WHERE id = '${result[0].id}';`);
                return res.status(200).send({
                    message: "angemeldet!",
                    auth: true,
                    token,
                    user: result[0]
                })
            }
            return res.status(401).send({
                message: 'Benutzername oder Passwort stimmt nicht!' 
            })            
    });
    })
    
});


module.exports = router;