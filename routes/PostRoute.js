const express = require('express')
const router = express.Router()
const PostController = require("../controllers/PostControler");
const Post = require("../models/Post");


router.post('/create',PostController.createPost)

router.get('/create', PostController.create)













module.exports = router