const Comment = require("../models/Comment");
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

    static async update(req, res) {
        const {id} = req.params
        const postData = await Post.findOne({raw:true,where:{id}})
        res.render('posts/update',{postData})
    }

    static async updatePost(req,res) {
        try { 
        const {id,title,image,tag} = req.body;
        //verificar se imagem corresponde
        const isImage = PostController.checkIfIsImage(image)
        if(!isImage){
            req.flash('message','o link nao corresponde a uma imagem')
            res.render('posts/update')
            return
        }
        const post = {
            title
            ,image
            ,tag
        }
        await Post.update(post,{where:{id}})
            res.redirect('/')
        } catch (error) {
            console.log('erro na edição',error)
            req.flash('message','ocorreu algum erro, tente novamente')
            res.render('posts/update')
        }
       

    }

    static async deletePost (req,res) {
        try {
            const {id} = req.body;
            await Post.destroy({where:{id}})
            res.redirect('/dashboard')
        } catch (error) {
            console.log('erro na exclusão',error)
            req.flash('message','ocorreu algum erro, tente novamente mais tarde')
            res.render('/posts/dashboard')
            return
        }
      
    }

    static async postDetails(req,res) {
        const {id} = req.params;
    
        const posts = await Post.findOne(
            {raw:true,
            where:{id},
            include:[User]})
        
        //ajustar a passagem dos posts e das tags
        const postData = [posts]           
        postData.forEach((post) =>{
                 post.tag = post.tag.split(',')
             })
        const postComments = await Comment.findAll({raw:true,where:{PostId:id}, include:User})
        console.log(postComments)
      
        // pull the comment model and include in posts model,  in comment model add author and comment fields
          
        
        if(postData.length == 0 ) {
            res.redirect('/')
            //i can add a flash messages in the body , but i'll think more about this
            return 
        }

        res.render('posts/details',{postData,postComments})
    }

    static async addComment(req,res) {
        
        const {id,title} = req.body;
        const UserId = req.session.userid
        console.log(id,title)
        const userComment = {
            UserId,
            title,
            PostId:id
        }
        console.log(userComment)
        await Comment.create(userComment)
        res.redirect(`/posts/details/${id}`)
        
    }

    static async deleteComment(req,res) {
        const {userid} = req.session
        const {id,UserId,PostId} = req.body;

        try {
            if(userid != UserId)
            {
                req.flash('message','nao é possivel deletar comentários de outros usuários')
                res.redirect(`/posts/details/${PostId}`)
                return
            }
            await Comment.destroy({where:{id}})
            res.redirect(`/posts/details/${PostId}`)
            
            
        } catch (error) {
            console.log('erro ao deletar comentário',error)
            res.redirect(`/posts/details/${PostId}`)
        }
    }
}