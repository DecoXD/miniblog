const {DataTypes} = require('sequelize');
const conn = require('../db/conn');
const User = require('./User');

const Post = conn.define('Posts',{
    title:{
        type:DataTypes.STRING,
        required:true
    },
    tag:{
        type:DataTypes.STRING,
        required:true
    },
    image:{
        type:DataTypes.STRING,
        required:true
    }
  
})

Post.belongsTo(User)
User.hasMany(Post)


module.exports = Post