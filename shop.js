//自己的網址路徑
const api_path = "70928manson";
const token = "KUF0FVQiozV0N70IPnaxWELvZeM2";
//DOM
const list = document.querySelector('.productWrap')

const addBtn = document.querySelector('.addCardBtn');

let productData = [];

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
  
}
