const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid')

const db = require('../lib/db.js');
const {validateRegister,isLoggedIn, authRole} = require('../middleware/basicAuth.js');


router.post("/sign-up", validateRegister, (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query(`SELECT id FROM users WHERE LOWER(username) = LOWER(?)`, username, (err, result) => {
        if(result && result.length) {//error
            return res.status(409).send({
                message: "Benutzername bereits vergeben"
            });
        } else {    // username not in use
            bcrypt.hash(password, 10, (err, hash) => {
                if(err) {

                    return res.statusMessage(500).send({
                        message: err,
                    });
                } else {
                    db.query(`INSERT INTO users (id, username, password, registered) VALUES ('${uuid.v4()}',?,'${hash}', now());`,[username],
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
    const username = req.body.username;
    const password = req.body.password;
    db.query(`SELECT * FROM users WHERE username = ?`,[username],
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
        bcrypt.compare(password, result[0]['password'], (bErr, bResult) => {
            if(bErr){
                return res.status(400).send({
                    message: 'Benutzername oder Passwort stimmt nicht!'
                })
            }
            if(bResult) {   // password match
                const token = jwt.sign({
                    username:result[0].username,
                    userId: result[0].id
                    }, process.env.REACT_APP_SECRET_KEY, {expiresIn: "7d"}
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

router.get("/s", isLoggedIn, (req, res, next) => {
    console.log(req.userData);
    res.send('This is secret content');
});
module.exports = router;