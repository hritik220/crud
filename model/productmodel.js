const mongoose = require('mongoose')

let schema = mongoose.Schema

let product_data = new schema({
    
    title : String,
    description : String,
    price : Number,
    discount : String,
    quality : String,
    category : String,
    image : String,
    date : {
        type : Date,
        default : Date.now()
    }

})

let product_model = mongoose.model("product",product_data)
module.exports = product_model
