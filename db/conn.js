const {Sequelize} = require('sequelize')
const conn = new Sequelize('miniblog','root','', {
    dialect: 'mysql',
    host: 'localhost'
})

conn.authenticate().then(() => {
    console.log('foi')
})

module.exports = conn