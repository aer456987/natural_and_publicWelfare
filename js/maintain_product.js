const productsListDom = document.querySelector('.js_productsList');
const productSelectDom = document.querySelector('.js_product_select');

const app = {
  data: {
    products: [],
  },
  getData() {
    axios.get(`${url}/api/${path_api}/admin/products`)
      .then(res => {
        if(res.data.success){
          this.data.products = res.data.products;
          this.render();
          productSelectDom.value = '全部商品';
        }
      })
  },
  renderHtmlStr(item) {  // 渲染得表單結構
    let online = '';
    if (item.is_enabled === 1){
      online = '上架';
    }else{
      online = '未上架';
    }
    return `
      <tr>
        <td data-title="分類">${item.category}</td>
        <td data-title="圖片">
          <img src="${item.imageUrl}" alt="${item.title} 圖片" class="review_img">
        </td>
        <td class="fz_14" data-title="產品ID">${item.id}</td>
        <td data-title="品名">${item.title}</td>
        <td title="補充說明：${item.content}" class="fz_14" data-title="描述">${item.description}</td>
        <td data-title="原價">${item.price}</td>
        <td data-title="售價">${item.origin_price}</td>
        <td data-title="庫存">${item.unit}</td>
        <td data-title="狀態">${online}</td>
        <td data-title="操作"><sapn>修改</sapn></td>
        <td data-title="刪除">
          <i class="far fa-trash-alt js_del_order del_order btn btn_red" data-id="${item.id}"></i>
        </td>
      </tr>
    `;
  },
  render() {             // 渲染畫面
    let renderStr = '';
    if(this.data.products.length === 0){
      renderStr = `
        <tr>
          <td colspan="10">目前無任何產品</td>
        </tr>`;

    }else{
      renderStr = this.data.products.map(item => this.renderHtmlStr(item)).join('');
    }
    productsListDom.innerHTML = renderStr;

    // 刪除單項-事件
    this.delClickEvent();
  },
  filterProduct(e) {     // 篩選商品
    if(e.target.value === '全部商品'){
      app.render();
    }
    let str = '';
    app.data.products.forEach(item => {
      if(item.category === e.target.value){
        str += app.renderHtmlStr(item);
        productsListDom.innerHTML = str;
        app.delClickEvent();
      }
    })
  },
  delClickEvent(){       // 刪除按鈕事件
    const delBtnsDom = document.querySelectorAll('.js_del_order');
    delBtnsDom.forEach(btn => {
      btn.addEventListener('click', this.delProductItme);
    });
  },
  delProductItme(e) {    // 刪除單樣商品
    const id = e.target.dataset.id;
    app.swal('success', '已刪除該筆資料', 2500);
    axios.delete(`${url}/api/${path_api}/admin/product/${id}`)
      .then(res => {
        app.getData();
      });
  },
  swal(status, title, times = 2000){
    swal({
      icon: status,
      title: title,
      button: false,
      timer: times,
    })
  },
  init() {
    const resetbtnDom = document.querySelector('.js_reset_btn');

    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common['Authorization'] = token;
    this.getData();

    // 篩選事件
    productSelectDom.addEventListener('change', this.filterProduct);
    // 重新整理
    resetbtnDom.addEventListener('click', e => {
      app.swal('info', '資料重整中', 1500);
      this.getData();
    });
    
  }
}
app.init();











// 缺 reset 功能
// 執行動作時的動畫

// const productTitle = document.querySelector('.js-productTitle');
// const productCategory = document.querySelector('.js-productCategory');
// const productOrigin_price = document.querySelector('.js-productOrigin_price');
// const productPrice = document.querySelector('.js-productPrice');
// const productUnit = document.querySelector('.js-productUnit');
// const productDescription = document.querySelector('.js-productDescription');
// const productContent = document.querySelector('.js-productContent');
// const productIsEnabled = document.querySelector('.js-productIsEnabled');
// const productImageUrl = document.querySelector('.js-productImageUrl');
// const inpurts = document.querySelectorAll('input[type=text]');
// const addProductBtn = document.querySelector('.js-addProductBtn');

// obj = {
//   title: '',
//   category: '',
//   origin_price: '',
//   price: '',
//   unit: '',
//   description: '',
//   content: '',
//   is_enabled: false,
//   imageUrl: '',
// }

// addProductBtn.addEventListener('click', (e)=> {
//   inpurts.forEach((item) => {
//     // console.log(item);

//     if(item.value === ''){
//       console.log(item);
//       console.log(`value: 沒有值`);
//     }else{
      
//       console.log(`value: ${item.value}`);
//     }
//   });
// })