const express = require('express');
const router = express.Router();

router.all("/", (req, res) => {
    res.send(
        <div>
            <h1>Back-Ware API</h1>
        </div>
    )
        

});
module.exports = router;