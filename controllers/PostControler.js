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
        const {id} = req.params;
    
        const posts = await Post.findOne({raw:true,where:{id},include:User})
        //ajustar a passagem dos posts e das tags
        const postData = [posts]           
        postData.forEach((post) =>{
                 post.tag = post.tag.split(',')
             })
        // pull the comment model and include in posts model,  in comment model add author and comment fields
    
        
        if(postData.length == 0 ) {
            res.redirect('/')
            //i can add a flash messages in the body , but i'll think more about this
            return 
        }

        res.render('posts/details',{postData})
    }
}