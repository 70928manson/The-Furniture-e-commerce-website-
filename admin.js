//自己的網址路徑
const api_path = "70928manson";
const token = "KUF0FVQiozV0N70IPnaxWELvZeM2";

const order_list = document.querySelector('.order-list');

let orderData = [];

init();

function init(){
    getOrder();
}

function getOrder(){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`, {
        headers: {
            'Authorization': `${token}`,
        }
    })
    .then(function (response){
        //console.log(response.data.orders);
        orderData = response.data.orders;
        renderOrder();
    }).catch(function (error){
        console.log(error.message);
    })
    
}

function renderOrder(){
    let str = '';

    orderData.forEach(function (item, index){
      // 組時間字串
      const timeStamp = new Date(item.createdAt*1000);
      const orderTime = `${timeStamp.getFullYear()}/${timeStamp.getMonth()+1}/${timeStamp.getDate()}`;
      
      // 組產品字串
      let productStr = "";
      item.products.forEach(function (productItem){
        productStr += `
        <p>${productItem.title}</p>
        <p>$${productItem.price} x ${productItem.quantity}</p>`
      })
    // 判斷訂單處理狀態
    let orderStatus = "";
    if(item.paid == true){
      orderStatus = "已處理"
    }else{
      orderStatus = "未處理"
    }

        str += `
    <tr>
        <td>${item.id}</td>
        <td>
          <p>${item.user.name}</p>
          <p>${item.user.tel}</p>
        </td>
        <td>${item.user.address}</td>
        <td>${item.user.email}</td>
        <td>
          <p>${productStr}</p>    
        </td>
        <td>${orderTime}</td>
        <td class="orderStatus">
          <a href="#" data-status="${item.paid}" class="orderStatus" data-id="${item.id}">${orderStatus}</a>
        </td>
        <td>
          <input type="button" class="delSingleOrder-Btn js-orderDelete" data-id="${item.id}" value="刪除">
        </td>
    </tr>`
    })
    order_list.innerHTML = str;
    renderC3(); 
}

function renderC3(){
  let obj = {};
  orderData.forEach(function (item){
    item.products.forEach(function(productItem ){  //productItem = item.products
      if(obj[productItem.title] === undefined){
        obj[productItem.title] = productItem.quantity * productItem.price;
      }else{
        obj[productItem.title] += productItem.quantity * productItem.price;
      }
    })
  })
  //console.log(obj);

  //c3要得格式[ ['產品A名稱', A占比],  ['產品B名稱', B占比...] ]
  let orignAry = Object.keys(obj); //先把所有產品名稱抓出來
  //console.log(orignAry);
    //透過originAry得到名稱，再用obj[originAry]得到值 整理成 C3 格式
  let c3OrderAry = [];
  orignAry.forEach(function (item){
    let ary = [];
    ary.push(item);
    ary.push(obj[item]);
    c3OrderAry.push(ary);
  });
  //console.log(c3OrderAry);

  // 比大小，降冪排列（目的：取營收前三高的品項當主要色塊，把其餘的品項加總起來當成一個色塊）
  // sort: https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  c3OrderAry.sort(function (a, b) {
    return b[1] - a[1];
  })

  //若產品超過4項，將第四名之後歸類於['其他',otherTotal]並push上去
  if(c3OrderAry.length > 3){
    let ortherTotal = 0;
    c3OrderAry.forEach(function (item, index){
      if(index > 2){
        ortherTotal += c3OrderAry[index][1];  //抓出其他項的價錢
      }
    })
    c3OrderAry.splice(3, c3OrderAry.length - 1);
    c3OrderAry.push(['其他', ortherTotal]);  // 超過三筆後將第四名之後的價格加總起來放在 otherTotal
  }

  //c3
  c3.generate({
    bindto: '#chart',
    data:{
      columns: c3OrderAry,
      type: 'pie',
    },
    color: {
      pattern: ["#8A2BE2", "#5434A7", "#9D7FEA", "#DACBFF"] // #301E5F
      //前三大&其他
    }
  });
}

//刪除全部
const discardAllBtn = document.querySelector('.discardAllBtn');
discardAllBtn.addEventListener('click', function(e){
  e.preventDefault();
  console.log(e.target);
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`, {
        headers: {
            'Authorization': `${token}`,
        }
    })
    .then(function (response){
      alert('訂單全數刪除成功~');
      getOrder();
    })
})

//大範圍監聽
order_list.addEventListener('click', function(e){
  e.preventDefault();
  //console.log(e.target);
  let targetClass = e.target.getAttribute('class');
  let id = e.target.getAttribute("data-id");

  if(targetClass === "delSingleOrder-Btn js-orderDelete"){
    //刪除特定訂單
    deleteOrderItem(id);
    return;
  }
  if(targetClass === "orderStatus"){
    let status = e.target.getAttribute('data-status');
    changeOrderStatus(status, id);
  }
});

//刪除特定訂單
function deleteOrderItem(id){
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${id}`, {
    headers: {
        'Authorization': `${token}`,
    }
  }).then(function (response){
    alert('該筆訂單刪除成功囉~');
    getOrder();
  })
}

//修改狀態

function changeOrderStatus(status,id){
  console.log(status,id);

  let newStatus;

  //把未處理變成已處理           //已處理變成未處理?
  if(status == true){
    newStatus = false;
  }else{
    newStatus = true;
  }

  console.log(`status:${status}, change ${newStatus}`);

  //put 修改訂單狀態
  axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,{
    "data": {
      "id": id,
      "paid": newStatus,
    }
  } ,{
    headers: {
      'Authorization': token,
    }
  })
  .then(function(response){
    alert("修改訂單成功");
    console.log(response.data);
    getOrder();
  }).catch(function (error){
    console.log(error.message);
  })
}