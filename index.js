const express = require('express');
const exphbs = require('express-handlebars');
const app  = express();
const session = require('express-session');
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')
//import conection with MySQL
const conn = require('./db/conn');


//models
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');

//middleware to check authentication
const { checkAuth } = require('./helpers/checkAuth');
//User controllers
const AuthController = require('./controllers/AuthController');
const authRouter = require('./routes/AuthRoute');
//Post controller
const postRouter = require('./routes/PostRoute');



//initialize handlebars
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')


//initialize the styles
app.use(express.static('public'))

//allow json request
app.use(express.urlencoded({
    extends:true}))
app.use(express.json())

//cookies
app.use(session({
    name:'session',
    secret : 'our_secret',
    resave: false,
    saveUninitialized: false,
    store : new FileStore({
        logFn: function () {},
        path: require('path').join(require('os').tmpdir(), 'sessions')
    }),
    cookie: {
        secure: false,
        maxAge: 3600000,
        expires: new Date(Date.now() + this.maxAge),
        httpOnly: true
    }
}))
//flash messages
app.use(flash())

app.use((req,res,next) => {
    if(req.session.userid){
        res.locals.session = req.session
    }
    next()
})


app.use('/posts',postRouter)
app.use('/',authRouter)
//get routes
conn.sync({force:false}).then(() => {
    app.listen(3000)
})