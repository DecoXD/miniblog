//import router in express
const express = require('express')
const router = express.Router()

const User = require("../models/User");
//controllers
const AuthController = require("../controllers/AuthController");
const { checkAuth } = require('../helpers/checkAuth');

//POST ROUTES
router.post("/register",AuthController.registerPost)
router.post("/login",AuthController.loginPost)


//GET ROUTES
router.get("/dashboard",checkAuth,AuthController.dashboard)
router.get("/logout",AuthController.logout)
router.get("/register",AuthController.register)
router.get("/login",AuthController.login)
router.get("/",AuthController.homePage)

module.exports = router