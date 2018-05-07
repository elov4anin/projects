/* Форма входа */
let page = {
    body: document.getElementById("body")
};
let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

let enterForm  = {
    login: document.getElementById("login"),
    pass: document.getElementById('pass'),
    btn: document.getElementById('submitLogin'),
    active: function (wrap) {
        wrap.parentNode.classList.add('login__input-wrap--active');
    },
    error:  function (wrap) {
        wrap.parentNode.classList.remove('login__input-wrap--active');
        wrap.parentNode.classList.remove('login__input-wrap--success');
        wrap.parentNode.classList.add('login__input-wrap--error');
    },
    success:  function (wrap) {
        wrap.parentNode.classList.remove('login__input-wrap--active');
        wrap.parentNode.classList.remove('login__input-wrap--error');
        wrap.parentNode.classList.add('login__input-wrap--success');
    },
    validateLogin(email) {
        return pattern.test(email);
    }
};

enterForm.login.addEventListener('keyup', (e)=>{
    enterForm.active(enterForm.login);
    if ((e.target.value.length > 5) && (enterForm.validateLogin(e.target.value))) {
        enterForm.success(enterForm.login);
        enterForm.pass.focus();
    } else {
        enterForm.error(enterForm.login);
    }
});

enterForm.pass.addEventListener('keyup', (e)=>{
    enterForm.active(enterForm.pass);
    if ((e.target.value.length > 4)) {
        enterForm.success(enterForm.pass);
        enterForm.btn.removeAttribute('disabled');
    } else {
        enterForm.error(enterForm.pass);
    }
});

enterForm.btn.addEventListener('click', (e)=> {
    modal.isShow = true;
    modal.action();

});

/* Форма регистрации*/

let regForm = {
    fullname: document.getElementById('fullname'),
    tel: document.getElementById('tel'),
    email: document.getElementById('email'),
    accept: document.getElementById('accept'),
    btn: document.getElementById('submitSign'),
    error:  function (wrap) {
        wrap.parentNode.classList.remove('sign__input-wrap--active');
        wrap.parentNode.classList.remove('sign__input-wrap--success');
        wrap.parentNode.classList.add('sign__input-wrap--error');
    },
    success:  function (wrap) {
        wrap.parentNode.classList.remove('sign__input-wrap--active');
        wrap.parentNode.classList.remove('sign__input-wrap--error');
        wrap.parentNode.classList.add('sign__input-wrap--success');
    },
    validateFullname(fullname) {
        return /^[А-ЯЁ][а-яё]+(-[А-ЯЁ][а-яё]+)? [А-ЯЁ][а-яё]+( [А-ЯЁ][а-яё]+)?$/.test(fullname);
    },
    validateEmail(email) {
        return pattern.test(email);
    },
    validateTel(tel) {
        return /^((8|\+7)[\-]?)?(\(?\d{3}\)?[\-]?)?[\d\-]{7,10}$/.test(tel);
    }
};

regForm.fullname.addEventListener('keyup', (e)=>{
    //regForm.active(regForm.login);
    if ((e.target.value.length > 3) && (regForm.validateFullname(e.target.value))) {
        regForm.success(regForm.fullname);
        regForm.tel.focus();

    } else {
        regForm.error(regForm.fullname);
    }
});

regForm.tel.addEventListener('keyup', (e)=>{
    //regForm.active(regForm.login);
    if ((e.target.value.length > 5) && (regForm.validateTel(e.target.value))) {
        regForm.success(regForm.tel);
        regForm.email.focus();

    } else {
        regForm.error(regForm.tel);
    }
});

regForm.email.addEventListener('keyup', (e)=>{
    //regForm.active(regForm.login);
    if ((e.target.value.length > 5) && (regForm.validateEmail(e.target.value))) {
        regForm.success(regForm.accept);
        regForm.success(regForm.email);

    } else {
        regForm.error(regForm.email);
    }
});

regForm.accept.addEventListener('click', (e)=>{
    if (!e.target.checked) {
        regForm.btn.setAttribute('disabled', 'disabled');

    } else {
        regForm.btn.removeAttribute('disabled');
    }
});

regForm.btn.addEventListener('click', (e)=>{
    e.preventDefault();
    localStorage.setItem('email', regForm.email.value);
    localStorage.setItem('fullname', regForm.fullname.value);
    window.location.href = 'message.html';



});


/* Модалка */
let modal = {
    modal: document.getElementById('modal'),
    btn: document.getElementById('modalBtn'),
    class: 'modal--show',
    overlay: 'overlay',
    isShow: false,
    action: function () {
        if (this.isShow) {
            this.modal.classList.add(this.class);
            page.body.classList.add(this.overlay);
        } else {
            this.modal.classList.remove(this.class);
            page.body.classList.remove(this.overlay);
        }
    }
};

modal.btn.addEventListener('click', ()=> {
    modal.isShow = false;
    modal.action();
});