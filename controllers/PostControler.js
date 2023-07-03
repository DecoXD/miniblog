const Post = require("../models/Post");

module.exports = class PostController {
    
    static create(req, res) {
        res.render('posts/create')
    }

    static async createPost(req, res) {
        try {
            const {title,tags,image} = req.body;
            const tagSplit = tags.split(',')
            const post = {
                title,
                tags:tagSplit,
                image
            }
            await Post.create(post)
        } catch (error) {
            console.log('error no post createpost',error)
        }
        
    }
}