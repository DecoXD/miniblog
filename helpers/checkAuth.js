module.exports.checkAuth = function (req,res,next) {
   const {userid} = req.session;
   if(!userid){
    res.redirect('/login')
   }
    next()
}