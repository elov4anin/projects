import axios from "axios/index";
import Inputmask from "inputmask";/*Библеотека для AJAX запросов*/

/*Маски ввода*/
Inputmask({"mask": "+7(999) 999-9999"}).mask('callbackTel');

let messagePage= {
    header: document.getElementById('header'),
    messageText: document.getElementById('messageText'),
    setHeader: function (text) {
        this.header.innerText = 'Уважаемый, ' + text + '!';
    },
    setText: function (email, site) {
        this.messageText.innerHTML =
            "Вам на почту  <a href='https://"+ site +"' target='_blank' class='message__mail'>" + email + "</a> отправлено письмо<br>с кодом подтверждения";
    }
};

function getSiteOfMail(email) {
    return email.replace(/.*@/, "");

}
/*При загрузке страницы, если есть данный в хранилище браузера, то установить заголовок и текст*/
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('fullname') !='') {
        messagePage.setHeader(localStorage.getItem('fullname'));
    }
    if (localStorage.getItem('email') !='') {
        messagePage.setText(localStorage.getItem('email'), getSiteOfMail(localStorage.getItem('email')));
    }


}, false);

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
        }).then((response)=> {
            let data = response.data;
            if (data.error == 0) {
                enterForm.success(enterForm.login);
                enterForm.pass.focus();
            } else {
                modal.isShow = true;
                modal.action();
            }
        }).catch((err)=>{
            console.log('Нет связи с сервером', err);
        })
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
            console.log('Нет связи с сервером', err);
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
