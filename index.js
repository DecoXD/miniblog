const express = require('express');
const exphbs = require('express-handlebars');
const app  = express();

//import conection with MySQL
const conn = require('./db/conn');

//initialize handlebars
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')


//initialize the styles
app.use(express.static('public'))

//allow json request
app.use(express.json())

//middlewares



//get routes
app.get('/',(req,res) => {
    res.render('home')
})


conn.sync({force:true}).then(() => {
    app.listen(3000)
})