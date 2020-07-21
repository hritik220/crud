
$('document').ready(() => {
    $('#show').hide(12000)
    chk()
})

function getproductdata(){
    var str_data = JSON.parse(localStorage.getItem('cart'))
   let emparr=[]
   let cost = 0;
   str_data.map((value)=>{
        let price = value.price
        let quantity = value.quantity
        cost = cost+price*quantity
        cost = Math.floor(cost)
        emparr.push(value)  
   })
  let data = {
      title : emparr,
      tcost:cost
  }
    $.ajax({
        type:'POST',
         url: '/abc/email',
         data:data , //it will convert array to string
    }).then((data)=>{
       console.log(data)
    })
}

function local(){
    var count = JSON.parse(localStorage.getItem("cart"))
  if (count==null) {
    document.getElementById("spn").innerText='0'
  } else {
    var num=0
    for(let i=0;i<count.length;i++){
        var num  = num+count[i].quantity
    } 
        document.getElementById("spn").innerText=num
  }
}

var emp = []
var num=1
function add_to_cart(i, j, k) {

    var obj = {
        _id: i,
        title: j,
        price: k,
        quantity: 1
    }
    var cart = localStorage.getItem("cart")
    if (cart == null) {
        emp.push(obj)
        localStorage.setItem("cart", JSON.stringify(emp))
    } else {
        var index = 0
        var ecart = JSON.parse(localStorage.getItem("cart"))
        for (var q = 0; q < ecart.length; q++) {
            if (ecart[q]._id == i) {
                index++;
            }
        }
        if (index != 0) {
           num++
            for (var t = 0; t < ecart.length; t++) {
                if (ecart[t]._id == i) {
                    ecart[t].quantity = ecart[t].quantity+1
                }
            }
            localStorage.setItem("cart", JSON.stringify(ecart))
        }
        else {
            ecart.push(obj)
            localStorage.setItem("cart", JSON.stringify(ecart))

        }
    }
local()
price()
}

function update(){
    $('document').ready(()=>{
     
        var cart_doc = JSON.parse(localStorage.getItem("cart"))  
         if (cart_doc==null || cart_doc.length==0) {
           $(".modal-body").html("<h3>Cart Empty!</h3>")
         } else {
            var table = `
            <table class="table">
            <thead>
                <tr>
                    <th>Sr.No</th>
                    <th>Product name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Action</th>
                    
                </tr>
            </thead>
           `;
         cart_doc.map((value,index)=>{
             let data= value.quantity
             let cost = value.price
             let totalCost=Math.floor(data*cost)
              table = table+`
               <tbody>
                      <tr>
                        <td>${index+1}</td>
                        <td>${value.title}</td>
                        <td>${value.quantity}</td>
                        <td>${totalCost}</td>
                        <td> 
                        <button class="btn btn-danger" onclick=" del('${value._id}')" id="btn">Remove</button>
                        </td>
                      </tr>
                 </tbody>
              `
         })
            $(".modal-body").html(table)
         }
    
    })
    price()
}
 
function del(i){
     var id = i;
   var eKart = JSON.parse(localStorage.getItem("cart"))
    for(var j=0;j<eKart.length;j++){
         if(eKart[j]._id==id){
             
              if (eKart[j].quantity!=1) {
                  eKart[j].quantity = eKart[j].quantity-1
                 
              } 
              else {
                  var a = confirm("are u sure!")
                  if (a) {
                    console.log(eKart)
                     eKart.splice(j,1)
                    
                  } else {
                    update() 

                  }
              }
         }
     }
     localStorage.setItem('cart',JSON.stringify(eKart));
     chk()
     update()
     price()
     local()
     
}

function price(){
    var cost = 0
    var Kart = JSON.parse(localStorage.getItem("cart"))
    Kart.map((val)=>{
      let price = val.price
      let quantity = val.quantity
      cost = cost+price*quantity
      cost = Math.floor(cost)
    })
  if (cost==0) {
    document.getElementById('price').innerHTML=""
    document.getElementById('dis').innerHTML=`
    <input type="button"  value="Checkout" class="btn btn-primary" disabled>
    `
   
    
  } else {
    document.getElementById('price').innerHTML=
    `<div class="row">
    <div class="col-sm-7" style="margin-left:72px">
        Total Cost : ${cost}
    </div>
 </div>`

 document.getElementById('dis').innerHTML=`
 <a  href="/abc/find" onclick="get()" style="padding-right:30px" class="btn btn-primary">Checkout</a>
 `
  }
}

//for checkout
function chk(){
$('document').ready(()=>{
   
    var cart_doc = JSON.parse(localStorage.getItem("cart"))  
    if (cart_doc==null || cart_doc.length==0) {
      $(".modal-body").html("<h3>Cart Empty!</h3>")
    } else {
       var table = `
       <table class="table">
       <thead>
           <tr>
               <th>Sr.No</th>
               <th>Product name</th>
               <th>Quantity</th>
               <th>Price</th>
               <th>Action</th>
               
           </tr>
       </thead>
      `;
    cart_doc.map((value,index)=>{
        let data= value.quantity
        let cost = value.price
        let totalCost=Math.floor(data*cost)
         table = table+`
          <tbody>
                 <tr>
                   <td>${index+1}</td>
                   <td>${value.title}</td>
                   <td>${value.quantity}</td>
                   <td>${totalCost}</td>
                   <td> 
                   <button class="btn btn-danger" onclick=" del('${value._id}')" id="btn">Remove</button>
                   </td>
                 </tr>
            </tbody>
         `
    })
       $(".modal-body").html(table)
    }
    var cost = 0
    var Kart = JSON.parse(localStorage.getItem("cart"))
    Kart.map((val)=>{
      let price = val.price
      let quantity = val.quantity
      cost = cost+price*quantity
      cost = Math.floor(cost)
    })
  if (cost==0) {
    document.getElementById('price').innerHTML=""
    document.getElementById("check").innerHTML=""
  }
   else {
   
    document.getElementById('price').innerHTML=
    `<div class="row">
    <div class="col-sm-7" style="margin-left:72px">
        Total Cost : ${cost}
    </div>
 </div>`
 document.getElementById("check").innerHTML=`<a href="/abc/address" class="btn btn-info">proceed</a>`
  }  
})
}
