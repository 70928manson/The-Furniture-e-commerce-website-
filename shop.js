//自己的網址路徑
const api_path = "70928manson";
const token = "KUF0FVQiozV0N70IPnaxWELvZeM2";
//DOM
const list = document.querySelector('.productWrap')

const addBtn = document.querySelector('.addCardBtn');
const cartList = document.querySelector('.cartList');
const cartTotal = document.querySelector('.cartTotal')

let productData = [];
let cartData = [];
let cartTotalPrice;

init();

//初始化
function init(){
  getProductList();
  getCartList();
}
function getProductList(){
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`)
    .then(function(response){
    // console.log(response.data.products);
    productData = response.data.products;
    renderProductList();
  }).catch(function (error){
    console.log(error);
  })
}
function renderProductList(){
  let str = "";
  productData.forEach(function(item){
    str += `<li class="productCard">
                <h4 class="productType">新品</h4>
                <img src="${item.images}" alt="">
                <a href="#" class="addCardBtn">加入購物車</a>
                <h3>${item.title}</h3>
                <del class="originPrice">NT$${item.origin_price}</del>
                <p class="nowPrice">NT${item.price}</p>
            </li>`;
  })
  list.innerHTML = str;
}
function getCartList(){
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
  .then(function (response){
    cartData = response.data.carts;

    cartTotalPrice = response.data.finalTotal;

    renderCartList();
    renderCartTotalPrice();
  })
}
function renderCartList(){
  let str = "";
  cartData.forEach(function (item){
    str += `
    <td>
        <div class="cardItem-title">
            <img src="${item.product.images}" alt="" referrerpolicy="no-referrer">
            <p>${item.product.title}</p>
         </div>
    </td>
         <td>NT$${item.product.price}</td>
        <td>${item.quantity}</td>
        <td>NT$${item.product.price * item.quantity}</td>
         <td class="discardBtn">
         <a href="#" class="material-icons">
            clear
         </a>
    </td>
    `
  })

  cartList.innerHTML = str;
 
}

function renderCartTotalPrice(){
  cartTotal.innerHTML = `NT$${cartTotalPrice}`;
}

function addCartItem(){
  ;
}