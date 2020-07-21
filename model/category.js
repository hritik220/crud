const mongoose = require('mongoose')

let schema = mongoose.Schema

let category_data = new schema({
     category_name : {
         type : String,
         required : true   
     },
     description : {
         type : String,
         required : true
     }
})

let category_model = mongoose.model("category",category_data)
module.exports = category_model
