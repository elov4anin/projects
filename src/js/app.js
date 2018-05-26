import Swiper from 'swiper';/*Библеотека для слайдера*/
import axios from 'axios'/*Библеотека для AJAX запросов*/
import Inputmask from "inputmask";

/*Маски ввода*/
Inputmask({"mask": "+7(999) 999-9999"}).mask('callbackTel');
/*Инициализация слайдера*/
let mySwiper = new Swiper('.swiper-container', {
    loop: true,
    pagination: {
        el: '.swiper-pagination',
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    scrollbar: {
        el: '.swiper-scrollbar',
    },
    autoplay: {
        delay: 5000,/*задержка при автопроигрывании сайдера должна быть равна или около таймеру загрузки прогрессбара loaderProgressBar*/
    }
});

let page = {
    body: document.getElementById("body"),
    class: "body--slide-",
    slides: document.querySelectorAll("swiper-slide"),
    loaderIndex: document.getElementById("loaderIndex"),
    loaderProgressBar: document.getElementById("loaderProgressBar"),
    clearBgSliders: function() {
        this.body.setAttribute("class", "");
    },
    changeBgContainer: function(activeSlide) {
        this.body.classList.add(this.class + activeSlide);
        this.loaderIndex.innerText = activeSlide + 1;
    },
    drawProgressBar: function () {
        //console.log(this.loaderProgressBar);
        this.loaderProgressBar.classList.add("loader__progress--animated");
        setTimeout(()=>this.loaderProgressBar.classList.remove("loader__progress--animated"), 5000);
    }

};
/*при изменении слайда - менять фон и отрисовывать прогресс бар*/
mySwiper.on('slideChange', () => {
    page.clearBgSliders();
    page.changeBgContainer(mySwiper.realIndex);
    page.drawProgressBar()

});
/* Форма входа */
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
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
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
            mySwiper.autoplay.stop();
            this.modal.classList.add(this.class);
            page.body.classList.add(this.overlay);
        } else {
            this.modal.classList.remove(this.class);
            page.body.classList.remove(this.overlay);
            mySwiper.autoplay.start();
        }
    }
};
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
            mySwiper.autoplay.stop();
            this.modal.classList.add(this.class);
            page.body.classList.add(this.overlay);
        } else {
            this.modal.classList.remove(this.class);
            page.body.classList.remove(this.overlay);
            mySwiper.autoplay.start();
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
});

modal.btn.addEventListener('click', ()=> {
    modal.isShow = false;
    modal.action();
});




