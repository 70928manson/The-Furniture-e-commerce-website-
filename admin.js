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
        console.log(response.data.orders);
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
      item.products.forEach(function(productItem){
        productStr += `
        <p>${productItem.title}</p>
        <p>x ${productItem.quantity}</p>`
      })
    // 判斷訂單處理狀態
    let orderStatus = "";
    if(item.paid == true){
      orderStatus = "已處理"
    }else{
      orderStatus = "未處理"
    }
    // 組訂單字串

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
          <a href="#" data-status="${item.paid}" class="orderStatus">${orderStatus}</a>
        </td>
        <td>
          <input type="button" class="delSingleOrder-Btn" value="刪除">
        </td>
    </tr>`
    })
    order_list.innerHTML = str;
    renderC3(); //待動工
}

// C3.js
let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
        type: "pie",
        columns: [
        ['Louvre 雙人床架', 1],
        ['Antony 雙人床架', 2],
        ['Anty 雙人床架', 3],
        ['其他', 4],
        ],
        colors:{
            "Louvre 雙人床架":"#DACBFF",
            "Antony 雙人床架":"#9D7FEA",
            "Anty 雙人床架": "#5434A7",
            "其他": "#301E5F",
        }
    },
});