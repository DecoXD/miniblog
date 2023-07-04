const Post = require("../models/Post");
const User = require("../models/User");

module.exports = class PostController {

    
    static async checkIfIsImage(imageUrl) {
        try {
            const url = await fetch(imageUrl,{method:"HEAD"})
            const type = url.headers.get('content-type')
            
            if(type.startsWith('image/')){
                return true
                }
        } catch (error) {
            console.log('nao é uma imagem')
            return false
        }
        return false
       
    }
    

    //route functions



    static create(req, res) {
        res.render('posts/create')
    }

    static async createPost(req, res) {
        const {userid}  = req.session
        try {  
            const {title,tag,image} = req.body;
            const isImage = await PostController.checkIfIsImage(image)
            
           if(!isImage){
                req.flash('message','o link nao corresponde a uma imagem')
                res.render('posts/create')
                return
           }
           
            //separar os espaços em branco  em virgulas        
            const tagReplace = tag.replaceAll(' ',',')             
            const post = {
                title,
                tag:tagReplace,
                image,
                UserId:userid

            }
            await Post.create(post)
            res.redirect('/')
        } catch (error) {
            console.log('error no post createpost',error)
            
            res.render('posts/create')
        }
        
    }

    static async details(req,res) {
        res.render('posts/details')
    }
}