const mongoose = require('mongoose')

let product_detail = mongoose.Schema

let product_data = new product_detail({
      product_name : {
          type:String,
          required:true
      },
      product_price : {
          type : Number,
          required:true
      },
      product_quantity : {
          type : Number,
          required :true
      }
})
let productmodel = mongoose.model("Detail",product_data)
module.exports = productmodel