const jwt = require('jsonwebtoken');

module.exports = {
    validateRegister: (req, res, next) => {
        // username min length 3
        if(!req.body.username || req.body.username.length < 3) {
            return res.status(400).send({
                message: "Bitte Benutzernamen mit mind. 3 Zeichen eingeben",
            });
        }
        // pw min 6 chars
        if(!req.body.password || req.body.password.length < 6) {
            return res.status(400).send({
                message: "Bitte Passwort mit mind. 6 Zeichen eingeben",
            });
        }
        // pw (repeat) must match
        if(!req.body.password_repeat || req.body.password != req.body.password_repeat) {
            return res.status(400).send({
                message: "Passwort muss übereinstimmen",
            });
        }
        next();
    },
    isLoggedIn: (req, res, next) => {
        if(!req.headers.authorization) {
            return res.status(400).send({
                message: "Your session is not valid",
            });
        }
        try{
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.REACT_APP_SECRET_KEY);
            req.userData = decoded;
            next();
        } catch (err) {

            return res.status(401).send({
                message: "Your session is not valid",
            });
        }
    },
    authRole: (role) => {
        return (req, res, next) => {
            //console.log(req.userData)
            if (req.userData.userRole !== role) {
                return res.status(403).send("Not allowed")
            }
            next()
        }
    }
}