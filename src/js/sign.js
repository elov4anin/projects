import Inputmask from "inputmask";
import axios from 'axios'/*Библеотека для AJAX запросов*/

/*Маски ввода*/
Inputmask({
    "mask": "+7(999) 999-9999",
    "oncomplete": ()=>{
    regForm.success(regForm.tel);
    regForm.labelTel.classList.remove('sign__placeholder--focused');
    regForm.labelTel.classList.remove('sign__placeholder--error');
    regForm.labelTel.classList.add('sign__placeholder--success');
    regForm.isTelValid = true;
    regForm.email.focus();
    },
    "oncleared":()=>{
        regForm.labelTel.classList.remove('sign__placeholder--focused');
        regForm.labelTel.classList.remove('sign__placeholder--success');
        regForm.labelTel.classList.add('sign__placeholder--error');
        regForm.isTelValid = false;
        regForm.error(regForm.tel);
    }
}).mask('tel');

Inputmask({"mask": "+7(999) 999-9999"}).mask('callbackTel');

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
/*Обработка ввода логина, с проверкой наличия его в БД ЛК*/
enterForm.login.addEventListener('keyup', (e)=>{
    enterForm.active(enterForm.login);
    if ((e.target.value.length > 5) && (enterForm.validateLogin(e.target.value))) {
        axios.post('http://j90264wh.beget.tech/php/enter.php', {
            email: enterForm.login.value
        }).then((response) => {
            /*Успех*/
            let data = response.data;
            if (data.error == 0) {
                enterForm.success(enterForm.login);
                enterForm.pass.focus();
            } else {
                modal.isShow = true;
                modal.action();
            }
        }).catch((err) => {
            /*Обработка ошибок*/
            console.log(err);
        });
    } else {
        enterForm.error(enterForm.login);
    }
});
/*Обработка ввода пароля на вход*/
enterForm.pass.addEventListener('keyup', (e)=>{
    enterForm.active(enterForm.pass);
    if ((e.target.value.length > 4)) {
        enterForm.success(enterForm.pass);
        enterForm.btn.removeAttribute('disabled');
    } else {
        enterForm.error(enterForm.pass);
    }
});
/*Обработка клика на кнопке вход*/
enterForm.btn.addEventListener('click', (e)=> {
    if ((enterForm.pass.value.length > 4) && (enterForm.validateLogin(enterForm.login.value))) {
        axios.post('http://j90264wh.beget.tech/php/enter.php', {
            email: enterForm.login.value,
            pass: enterForm.pass.value
        }).then((response)=> {
            let data = response.data;
            if (data.error == 0) {
                alert("Успех");
            } else {
                alert("Ошибка");
            }
        }).catch((err)=>{
            console.log(err);
        })
    } else if (!enterForm.validateLogin(enterForm.login.value)){
        enterForm.error(enterForm.login);
        enterForm.login.focus();
    } else if (!enterForm.pass.value.length > 4){
        enterForm.error(enterForm.pass);
        enterForm.pass.focus();
    }
   /* modal.isShow = true;
    modal.action();*/
});

/* Форма регистрации*/

let regForm = {
    fullname: document.getElementById('fullname'),
    labelFullname: document.getElementById('labelFullname'),
    tel: document.getElementById('tel'),
    labelTel: document.getElementById('labelTel'),
    email: document.getElementById('email'),
    labelEmail: document.getElementById('labelEmail'),
    accept: document.getElementById('accept'),
    btn: document.getElementById('submitSign'),
    isTelValid: false,
    isFullNameValid: false,
    isEmailValid: false,
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
        return /^[А-Яа-я ]{0,50}$/.test(fullname);
    },
    validateEmail(email) {
        return pattern.test(email);
    },
    validateTel(dir) {
        this.isTelValid(dir);
        /*return /^((8|\+7)[\-]?)?(\(?\d{3}\)?[\-]?)?[\d\-]{7,10}$/.test(tel);*/
    }
};
/*Обработка ввода ФИО*/
regForm.fullname.addEventListener('keyup', (e)=>{
    regForm.labelFullname.classList.remove('sign__placeholder--success');
    regForm.labelFullname.classList.remove('sign__placeholder--error');
    regForm.labelFullname.classList.add('sign__placeholder--focused');
    //regForm.active(regForm.login);
    if (regForm.validateFullname(e.target.value)) {
        regForm.labelFullname.classList.remove('sign__placeholder--focused');
        regForm.labelFullname.classList.remove('sign__placeholder--error');
        regForm.labelFullname.classList.add('sign__placeholder--success');
        regForm.isFullNameValid = true;
        regForm.success(regForm.fullname);

    } else if (e.target.value.length >10) {
        regForm.labelFullname.classList.remove('sign__placeholder--focused');
        regForm.labelFullname.classList.remove('sign__placeholder--success');
        regForm.labelFullname.classList.add('sign__placeholder--error');
        regForm.isFullNameValid = false;
        regForm.error(regForm.fullname);
    }
});

/*regForm.tel.addEventListener('keyup', (e)=>{
    //regForm.active(regForm.login);
    if ((e.target.value.length > 5) && (regForm.validateTel(e.target.value))) {
        regForm.success(regForm.tel);
        regForm.email.focus();

    } else {
        regForm.error(regForm.tel);
    }
});*/
/*Обработка ввода почты*/
regForm.email.addEventListener('keyup', (e)=>{
    regForm.labelEmail.classList.remove('sign__placeholder--success');
    regForm.labelEmail.classList.remove('sign__placeholder--error');
    regForm.labelEmail.classList.add('sign__placeholder--focused');
    //regForm.active(regForm.login);
    if ((e.target.value.length > 5) && (regForm.validateEmail(e.target.value))) {
        regForm.labelEmail.classList.remove('sign__placeholder--focused');
        regForm.labelEmail.classList.remove('sign__placeholder--error');
        regForm.labelEmail.classList.add('sign__placeholder--success');
        regForm.success(regForm.accept);
        regForm.isEmailValid = true;
        regForm.success(regForm.email);

    } else  if (e.target.value.length >5) {
        regForm.labelEmail.classList.remove('sign__placeholder--focused');
        regForm.labelEmail.classList.remove('sign__placeholder--success');
        regForm.labelEmail.classList.add('sign__placeholder--error');
        regForm.isEmailValid = false;
        regForm.error(regForm.email);
    }
});
/*Обработка согласия*/
regForm.accept.addEventListener('click', (e)=>{
    if (!e.target.checked) {
        regForm.btn.setAttribute('disabled', 'disabled');

    } else if (regForm.isFullNameValid && regForm.isTelValid && regForm.isEmailValid) {
        regForm.btn.removeAttribute('disabled');
    }
});
/*Обработка клике по кнопке*/
regForm.btn.addEventListener('click', (e)=>{
    if (!regForm.isFullNameValid) {
        regForm.fullname.focus();
        return
    }
    if (!regForm.isTelValid) {
        regForm.tel.focus();
        return
    }
    if (!regForm.isEmailValid) {
        regForm.email.focus();
        return
    }
    e.preventDefault();
    /*Сохранить почту и фио в локальном хранилище браузера для вывода на странице с результутатом*/
    localStorage.setItem('email', regForm.email.value);
    localStorage.setItem('fullname', regForm.fullname.value);

    axios.post('http://j90264wh.beget.tech/php/index.php', {
        email: regForm.email.value,
        fullname:  regForm.fullname.value,
        tel:  regForm.tel.value
    }).then((response)=> {
        let data = response.data;
        if (data.error == 0) {
            window.location.href = 'message.html';
        } else {
            console.log(data.error);
        }
    }).catch((err)=>{
        console.log(err);
    })
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
/*Модалка обратный звонок*/
let callback = {
    callback: document.getElementById("callback"),
    modal: document.getElementById("callbackModal"),
    close: document.getElementById("backcallClose"),
    btn: document.getElementById("backcallBtn"),
    class: "backcall-window--show",
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

callback.callback.addEventListener('click', ()=> {
    callback.isShow = true;
    callback.action();
});

callback.close.addEventListener('click', ()=> {
    callback.isShow = false;
    callback.action();
});

callback.btn.addEventListener('click', (e)=> {
    e.preventDefault();
    callback.isShow = false;
    callback.action();

    //@todo дописать отправку данных на callback.php
});