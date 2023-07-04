const {DataTypes} = require('sequelize');
const conn = require('../db/conn');
const Post = require('./Post');
const Comment = conn.define('comments',{
    title:{
        type: DataTypes.STRING,
        required:true
    },
    authorId:{
        type:DataTypes.STRING,
        required:true
    }
})
Comment.belongsTo(Post)
Post.hasMany(Comment)

module.exports = Comment