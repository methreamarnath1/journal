const express = require("express");
const { register, login } = require("../controllers/authController.js");
const router = express.Router(); // the Router() is an inbuild function of express that help in routing : the meaninig of routing is to move mone page to another
router.post("/register", register); // this will call the register function from authController when the user will hit the /register endpoint
router.post("/login", login); // this will call the login function from authController when the user will hit the /login endpoint

module.exports = router; // this will export the router so that it can be used in other files
