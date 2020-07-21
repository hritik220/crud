const express = require('express')
const bodyParser = require('body-parser')
const createError = require('http-errors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const app = express()
const path = require('path')
const route  = require('./controller/indexcontroller')
app.set('view engine','ejs')
app.set('views','./views')
 let port = process.env.PORT || 4500
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(morgan("dev"))

mongoose.connect('mongodb+srv://babuhathua:1234567890@cluster0-kik5i.mongodb.net/Hritik?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("successfully database connected!")
}).catch((e)=>{
    console.log(e.message)
})

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.use('/abc',route)

app.use((req,res,next)=>{
    next(new createError(404,"Page not found!"))
})
app.use((err,req,res,next)=>{
   const status=err.status || 500
   res.json({
       status : status,
       message : err.message
   })
   
})


app.listen(port,()=>{
    console.log(`Successfully listening on port ${port}`)
})