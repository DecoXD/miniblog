const {DataTypes} = require('sequelize');
const conn = require('../db/conn');
const Post = require('./Post');
const User = require('./User');

const Comment = conn.define('Comments',{
    title:{
        type: DataTypes.STRING,
        required:true
    }
})
Comment.belongsTo(Post)
Post.hasMany(Comment)

Comment.belongsTo(User)
User.hasMany(Comment)

module.exports = Comment