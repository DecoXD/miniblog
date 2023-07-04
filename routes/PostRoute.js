const express = require('express')
const router = express.Router()
const PostController = require("../controllers/PostControler");
const Post = require("../models/Post");

//POST ROUTES
router.post('/create',PostController.createPost)

//GET ROUTES

router.get('/details', PostController.details)
router.get('/create', PostController.create)













module.exports = router