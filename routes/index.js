var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
    return res.status(200).json({code: 200, message: "Ok"})
})

module.exports = router;