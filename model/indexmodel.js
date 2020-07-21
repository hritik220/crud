const mongoose = require('mongoose')

let schema = mongoose.Schema

let registration_data = new schema({
     username : {
         type : String,
         required : true
     },
     email : {
         type : String,
         required : true
     },
     password : {
         type : String,
         required : true
     }
})

let registration_model = mongoose.model("register",registration_data)
module.exports = registration_model
