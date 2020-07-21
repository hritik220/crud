const express = require('express')
const {check, validationResult} = require('express-validator/check');
const router = express.Router()
var jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const path = require('path')
const multer = require("multer")
const createError = require('http-errors')
var bcrypt = require('bcryptjs');
const registration_value = require('../model/indexmodel')
const category_value = require('../model/category')
const product_value = require('../model/productmodel')
const product_detail = require('../model/GetDetail')

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }

var storage = multer.diskStorage({
    destination : (req,file,cb)=>{
          cb(null,'./public/upload/')
    },
    filename : (req,file,cb)=>{
         cb(null,file.fieldname+"-"+Date.now()+path.extname(file.originalname))
    }
}) 
var upload = multer({storage:storage}).single('file')

router.get('/',async(req,res,next)=>{
    try {
        
        var cdata = await category_value.find({},{})
        
        var pdata = await product_value.find({},{})
        var emp=[]
      
       product_value.find({},{},(err,info)=>{
           if (err) {
               next(new Error("found something wrong!"))
           } else {
            info.forEach((value)=>{
                var discount = value.discount
                var price =  value.price
                let pricevalue = (price*discount)/100
               price = price-pricevalue
              emp.push(price)   
           })
           res.render('home',{
            title : "home",
            category : cdata,
            product : pdata,
            msg : "",
            discount:emp
       
        })
           }
       })
      
    } catch (error) {
        throw next(new createError("Something got wrong while fetching!"))
    }
})

router.get('/login',(req,res,next)=>{
    var mdata = localStorage.getItem("username")
    if (mdata) {
    category_value.find({},(err,info)=>{
         if (err) {
             next(new Error("data not found!"))
         } else {
             if (info) {
                 product_value.count({},(err,infod)=>{
                      if (err) throw err
                      else{
                        res.render('dashboard',{
                            title : "dashboard",
                            data : mdata,
                            datum : info,
                            pdata : infod
                        })
                      }
                 })              
             } 
         }
    })
        
    } else {
        res.render('login',{
            error : ""
        })  
    }
    
})

function checkdata(req,res,next){
    var token = localStorage.getItem("mytoken")
  try {
      jwt.verify(token,'check')
  } catch (error) {
       return res.redirect('/abc/login')
  }
  next()
}

router.post('/login',(req,res,next)=>{
    username = req.body.username
    password = req.body.password
    registration_value.findOne({username:username},(err,info)=>{
        const data = req.body
         if(err){
              next(new createError('Detail not found!'))
         } else{ 
            if (!password || !username) {
                res.render('loginedit',{
                    title : "Error",
                    error:"Password as well as username should not be empty!",
                    data : data
                }) 
            } else {
                checkpassword = info.password
             let chk = bcrypt.compareSync(password,checkpassword)
             if(chk){

                var token = jwt.sign({userid:info._id }, 'check');
                localStorage.setItem("mytoken",token)
                localStorage.setItem("username",data.username)
                 var udata = localStorage.getItem("username")
                 category_value.find({},(err,info)=>{
                    if (err) {
                        next(new Error("data not found!"))
                    } else {
                        if (info) {
                           res.render('dashboard',{
                               title : "dashboard",
                               data : udata,
                               datum : info
                           })
                        } 
                    }
                })
             } else {
                res.render('loginedit',{
                    title : "Error",
                    error:"Password should be matched!",
                    data : data
                })      
             } 
            }
         }
    }) 
})

router.get('/register',(req,res)=>{
    res.render('register',{
        error : ""
    })
})

function checkmail(req,res,next){
    username = req.body.username
   email = req.body.email
   password = req.body.psw
   Repassword = req.body.rpsw
   data = req.body
    var string = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
   if (email!="" || email==null) {
    if (string.test(email)) {
        if (password.length>7) {
            if (Repassword==password) {
                next()
            } else {
             return res.render('editedregister',{
                 error : "password not match!",
                 data : data
             })  
            }
        } else {
         return res.render('editedregister',{
             error : "Password Too much short!",
             data : data
         })  
        }
     }
     else {
         return res.render('editedregister',{
             error : "Email found to be wrong!",
             data : data
         })
     }
   } else {
    return res.render('editedregister',{
        error : "Email Should not be Empty!",
        data : data
    })
   }
}

function username(req,res,next){
    username = req.body.username
   if(username!=""){
       console.log(username)
     next()
   }else{
    return res.render('register',{
        error : "Username Should not be empty!"
    })
   }
}

router.post('/register',username,checkmail,(req,res,next)=>{
 
      let username = req.body.username
      let email = req.body.email
      let password = req.body.psw
        password = bcrypt.hashSync(password,10)
      let registration_input = new registration_value({
          username : username,
          email : email,
          password : password
      })
      registration_input.save((err,data)=>{
            if(err){
                console.log(err)
            } else{
                return res.render('register',{
                    error : "Successfully Registered!"
                })
            }
      })
})

router.get('/logout',(req,res)=>{
   localStorage.removeItem("username")
   localStorage.removeItem("mytoken")
   res.redirect('/abc/login')
})

router.post('/category',(req,res,next)=>{

    let category_input = new category_value({
        category_name : req.body.cat,
        description : req.body.desc  
    })
    category_input.save((err,info)=>{
      if (err) {
          next(new Error("Not saved!"))
      } else {
          return res.redirect('/abc/login')
      }
    })
})

router.post('/product',upload,(req,res,next)=>{
     const file = req.file

     let product_input = new product_value({
        title : req.body.ptitle,
        description : req.body.pdesc,
        price : req.body.pprice,
        discount : req.body.pdiscount,
        quality : req.body.pquality,
        category : req.body.pcategory,
        image : file.filename
     })
    product_input.save((err,info)=>{
        if (err) {
            next(new Error("found something wrong!"))
        } else {
            return res.redirect('/abc/login')
        }
    })
})

router.get('/:category?',checkdata,async(req,res,next)=>{
    console.log(req.params)
    const category = req.params.category   
    try {
        var catdata = await category_value.find({},{})
        if (category=="cart") {
            var scategory = await product_value.find({},{})
            var data = localStorage.getItem("username")
   var catdata = await category_value.find({},{})
   var scategory = await product_value.find({},{})
   if (data) {
    category_value.find({},(err,info)=>{
        if (err) {
            next(new Error("data not found!"))
        } else {
            if (info) {
                var emp=[]
                scategory.forEach((value)=>{
                     var discount = value.discount
                     var price =  value.price
                     let pricevalue = (price*discount)/100
                    price = price-pricevalue
                   emp.push(price)
                })
               res.render('add_to_cart',{
                   title : "add_to_cart",
                   data : data,
                   category:catdata,
                   product:scategory,
                   discount : emp,
                   msg : ""
               })
            } 
            else{
                //if category_value is empty!!!!
            }
        }
   })
   } else {
        res.redirect('/abc/login')
   }

        } else {
           if (category=="find") {
                res.render("Collection")
           }
           else if(category=="address"){
                res.render("Address")
           }
           else {
            var scategory = await product_value.find({category:category},{})
            var emp=[]
            scategory.forEach((value)=>{
                 var discount = value.discount
                 var price =  value.price
                 let pricevalue = (price*discount)/100
                price = price-pricevalue
               emp.push(price)
            })
            if (scategory!="") {
                res.render('home',{
                    title : "home",
                    category : catdata,
                    product : scategory,
                    discount : emp  , 
                    msg : "" 
                })  
              } else {
                res.render('home',{
                    title : "home",
                    category : catdata,
                    product : scategory,    
                   discount : "",
                    msg : "Don't find any data regarding this field!"
                }) 
              }
             
        }
           }
        }
        catch (error) {
        throw next(new createError("Something got wrong while fetching!"))
    }
})

router.get('/add/pqr',checkdata,(req,res)=>{
    res.redirect('/abc/cart')
})

router.get('/data/find',checkdata,(req,res)=>{
       res.render("Collection")
})

router.post("/display",(req,res)=>{
     res.render("payment",{
         title:"payment"
     })
})

router.get('/payment/success',checkdata,(req,res)=>{
   res.render("paid")
})

router.post("/email",(req,res,next)=>{
     let data = req.body.title
     data.forEach((value)=>{
      
         let pdata = new product_detail({
    product_name : value.title,
    product_price : value.price,
    product_quantity : value.quantity
 })
   pdata.save((err,info)=>{
         if (err) {
             next(new createError("Found some Error!"))
         } else {
           
         }
      
   })

     })
 
})


module.exports = router