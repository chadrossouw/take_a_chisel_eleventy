import Swiper from "swiper";



const swiper_init = () => {
    const swiperCarousel = document.querySelectorAll(".carousel");
    if (swiperCarousel.length > 0) {
      swiperCarousel.forEach((carousel) => {
        
        if (carousel.classList.contains('carousel--zoomer')) return;
        let slides = carousel.querySelectorAll(".swiper-slide");
        if (slides.length > 1) {
          let options = {
            loop: true,
            navigation: {
              nextEl: ".button--next",
              prevEl: ".button--prev",
            },
            simulateTouch: true,
            centeredSlides: true,
            slidesPerView: 1,
            spaceBetween: 0,
            on: {
              init: function () {
                const event = new Event("swiper-ready");
                window.dispatchEvent(event);
              },
            },
          };
          if(carousel.classList.contains('carousel--highlights')){
            options.slidesPerView="auto";
            options.spaceBetween = 32;
            options.centeredSlides = false;
            if(slides.length<5){
              options.loop = false;
            }
            carousel.querySelectorAll('.container').forEach((img)=>{
              width = img.getBoundingClientRect().width;
              if(img.nextElementSibling){
                img.nextElementSibling.style.maxWidth = `${width}px`;
              }
            });
            let titleHeight = carousel.previousElementSibling.getBoundingClientRect().height;
            let titleMargin = window.getComputedStyle(carousel.previousElementSibling).marginBottom;
            let buttons = carousel.querySelectorAll('.button--prev,.button--next');
            buttons.forEach(button=>button.style.top=`${-parseInt(titleMargin) - titleHeight}px`);
          }
          
          carousel.carouselInstance = new Swiper(carousel, options);
          
        }
      });
    }
  }

  export default swiper_init;