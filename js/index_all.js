const app = {
  data() {
    return {
      url: 'https://vue3-course-api.hexschool.io',
      path_api: 'toriha_vuetestapi',
      loginStatus: false,
      loginDatas: {
        userData: {
          username: '',
          password: '',
        },
        constraints: {
          'email':{
            presence: {
              message: "是必填欄位"
            },
            email: {
              message: "格式輸入錯誤"
            },
          },
          'password':{
            presence: {
              message: "是必填欄位"
            },
          },
        },
        error: '',
        isFill: true,
      },

    }
  },
  methods: {
    fromValidateFn(){       // 驗證輸入
      const form = document.querySelector("form.js_login_form");
      const inputs = document.querySelectorAll("input[type=email], input[type=password]");
      this.loginDatas.error = '';

      inputs.forEach(item => {
        item.addEventListener("blur", () => {
          item.nextElementSibling.textContent = "";
          let errors = validate(form, this.loginDatas.constraints);
          //呈現在畫面上
          if(errors){
            this.loginDatas.isFill = true;
            Object.keys(errors).forEach(keys => {
              document.querySelector(`.${keys}`).textContent = errors[keys];
              })
              return;
          }else{
            this.loginDatas.isFill = false
          }
        });
      });
    },
    loginFn() {             // 登入事件
      this.loginDatas.error = '資料驗證中，請稍後';
      axios.post(`${this.url}/admin/signin`, this.loginDatas.userData)
      .then(res => {
        console.log('登入(成功)', res);
        if(!res.data.success){
          console.log(res.data);
          this.loginDatas.error = `${res.data.message}, 請檢察帳號密碼`;
          return;
        }else{ 
          this.loginDatas.error = '登入成功';
        }
        const {token, expired} = res.data;
        document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
        this.loginStatus = true;
        })
        .catch(err => {
          console.dir('登入(失敗)', err);
        })
    },
    checkLogin() {          // axios check 確認登入狀態
      axios.post(`${this.url}/api/user/check`)
        .then(res => {
          console.log('前台帳號認證(成功)', res);
          this.loginStatus = true;

          if(!res.data.success){
            this.loginStatus = false;
          }

        })
        .catch(err => {
          console.dir('前台帳號認證(失敗)', err);
        })
    },
    swalFn(title, icon, timer = 2000, text, button = false) {     // 一般提示視窗
      const txt = { title, text, icon, button, timer };
      swal(txt);
    }
  },
  mounted() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;
    this.checkLogin();
  }
}
Vue.createApp(app).mount('.js_index');