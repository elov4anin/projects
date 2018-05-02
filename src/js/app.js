import Swiper from 'swiper';


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
        delay: 5000,
    }

});

let page = {
    body: document.getElementById("body"),
    class: "body--slide-",
    slides: document.querySelectorAll("swiper-slide"),
    clearBgSliders: function() {
        this.body.setAttribute("class", "");

    },
    changeBgContainer: function(activeSlide) {
        console.log(activeSlide);

        this.body.classList.add(this.class + activeSlide);
    },

};

mySwiper.on('slideChange', () => {
    page.clearBgSliders();
    page.changeBgContainer(mySwiper.realIndex);
});




