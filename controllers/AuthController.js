const User = require("../models/User")
const bcrypt = require('bcrypt')
module.exports = class AuthController {

    static homePage (req,res) {
        res.render('auth/home')
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
        res.redirect('/')
        

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
        
        //criar usuário
        const userData = {
            name,
            login,
            password:hashPassword
        } 
        const user = await User.create(userData)
        // altera a sessão para o id do usuário e redireciona para home 
        req.session.userid = user.id
        req.session.save(() => {
            res.redirect('/')
        }) 
    }
    static async logout (req,res) {
        await req.session.destroy()
        res.redirect('/')
    }
    static async dashboard (req,res) {
       res.render('auth/dashboard')
    }

}