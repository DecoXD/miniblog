const {DataTypes} = require('sequelize');
const conn = require('../db/conn');
const User = conn.define('Users',{
    name:{
        type:DataTypes.STRING,
        required:true
    },
    login:{
        type:DataTypes.STRING,
        required:true
    },
    profileImage:{
        type:DataTypes.STRING,
        required:true
    },
    password:{
        type:DataTypes.STRING,
        required:true
    }
})

module.exports = User