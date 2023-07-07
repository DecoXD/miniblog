const express = require('express')
const router = express.Router()
const PostController = require("../controllers/PostControler");
const Post = require("../models/Post");

//POST ROUTES
router.post('/create',PostController.createPost)
router.post('/details/:id',PostController.addComment)
router.post('/update',PostController.updatePost)
router.post('/delete',PostController.deletePost)
router.post('/comment/delete',PostController.deleteComment)

//GET ROUTES


router.get('/update/:id', PostController.update)
router.get('/details/:id', PostController.postDetails)
router.get('/create', PostController.create)













module.exports = router