// 開啟/關閉登入視窗
const loginOpenBtn = document.querySelector('.js_loginPage_btn');
const loginCloseBtn = document.querySelector('.js_close_login');
const hiddenDiv = document.querySelector('.js_hidden');
// 帳號登入
const emailInput = document.querySelector('.js-emailInput');
const passwordInput = document.querySelector('.js-passwordInput');
const loginErrorText = document.querySelector('.js_login_text');
const loginBtn = document.querySelector('.js_loginBtn');



// 開啟/關閉登入視窗
let loginStatus = false;
loginOpenBtn.addEventListener('click', changeLoginPage);
loginCloseBtn.addEventListener('click', changeLoginPage);
function changeLoginPage(){
  if(loginStatus){
    loginStatus = false;
    hiddenDiv.setAttribute('class', 'hidden')
  }else{
    loginStatus = true;
    hiddenDiv.removeAttribute('class', 'hidden')
  }
};

loginBtn.addEventListener('click', login)

// 帳號登入
function login(){
  const username = emailInput.value;
  const password = passwordInput.value;
  const user = { username, password }
  loginErrorText.textContent = '';

  if(username === '' || password === ''){
    loginErrorText.textContent = '資料填寫不完全';
    return;
  }

  loginErrorText.textContent = '資料驗證中，請稍後';

  axios.post(`${url}/admin/signin`, user)
    .then(res => {
      const resData = res.data;
      const message = res.data.message;

      if(resData.success){
        const { token, expired } = resData;
        document.cookie = `hexToken=${token}; expired=${new Date(expired)}`;
        loginErrorText.textContent = '登入成功';
        window.location = 'backstage_products.html';
      }else{
        verificationLogin(resData, message);
      }
    })
    .catch(function(error){
      console.log(error)
    })

  username = '';
  password = '';
  }

// 登入資料驗證
function verificationLogin(resData, message){
  let showTxt = '';

  if(message === '登入失敗'){
    const error = resData.error.message;

    if(error === 'The email address is badly formatted.'){
      showTxt = '帳號輸入錯誤';
    }else if(error === 'The password is invalid or the user does not have a password.'){
      showTxt = '密碼輸入錯誤';
    }else{
      showTxt = '請輸入正確的帳號密碼';
    }
  }

  loginErrorText.textContent = `${showTxt}`;
  return;
}