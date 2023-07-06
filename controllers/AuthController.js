const User = require("../models/User")
const Post = require("../models/Post");
const bcrypt = require('bcrypt');
module.exports = class AuthController {

    static async createProfileImage() {
        try {
            const url = 'https://dog.ceo/api/breeds/image/random'
            const dogImage = await fetch(url)
            const {message:image} = await dogImage.json()
            return image
            
        } catch (error) {
            console.log('error na foto de perfil')
            return null
        }

    }

    static async homePage (req,res) {
        const posts = await Post.findAll({raw:true})
       //ajustar a passagem dos posts e das tags
        const postData = [...posts] 
        if(posts.length > 0){
            postData.forEach((post) =>{
                post.tag = post.tag.split(',')
            })

        }
        
        res.render('auth/home',{postData})
    }

    static login (req,res) {
        const {userid} = req.session;
        if(userid){
            res.redirect('/')
            return
        }
        res.render('auth/login')
    }

    static async loginPost (req,res) {
        try {
            const {login, password} = req.body;

            //checkar se usuario existe e se a senha foi inserida corretamente
            const user = await User.findOne({raw:true,where:{login}});
            const comparePassword  = await bcrypt.compareSync(password,user? user.password : '');
            if(!user || !comparePassword){
                req.flash('message','dados incorretos');
                res.render('auth/login');
                return
            }
            req.session.userid = user.id 
            req.session.save(() => {
            res.redirect('/')
        })
        } catch (error) {
            console.log('error no loginPost',error)
            res.render('auth/login');
            return
        }
    }

    static register (req,res) {
        const {userid} = req.session;
        if(userid){
            res.redirect('/')
            return
        }
        res.render('auth/register')
    }

    static async registerPost (req,res) {
        try {
            
            const{name,login,password,confirmPassword} = req.body;
            
            //checar password e confirm
            if(password != confirmPassword){
                req.flash('message','confirme a senha corretamente')
                res.render('auth/register')
                return
            }
            //checar se usuário existe
            const exists = await User.findOne({where:{login}})
            if(exists){
                req.flash('message','usuário existente')
                res.render('auth/register')
                return
            }
            //minimo 6 letras login e senha
            if(password.length < 6  || login.length < 6) {
                req.flash('message','login e senha devem conter no mínimo 6 caracteres')
                res.render('auth/register')
                return
            }
            //criptografar senha e mandar para o banco de dados
            const salt = bcrypt.genSaltSync(10)
            const hashPassword = bcrypt.hashSync(password,salt)
            
            //buscar imagem de perfil aleatória
            const profileImage = await AuthController.createProfileImage()

            //checar se a imagem veio
            if(!profileImage) {
                req.flash('message','ocorreu um erro tente novamente ')
                res.render('auth/register')
                return
            }
            //criar usuário
            const userData = {
                name,
                login,
                password:hashPassword,
                profileImage
            } 
            const user = await User.create(userData)
            // altera a sessão para o id do usuário e redireciona para home 
            req.session.userid = user.id
            req.session.save(() => {
                res.redirect('/')
            }) 
       } catch (error) {
            console.log('error no register',error)
            res.render('auth/register')
            return
       }
    }

    static async logout (req,res) {
        await req.session.destroy()
        res.redirect('/')
    }

    static async dashboard (req,res) {
       res.render('auth/dashboard')
    }

}