import Swiper from 'swiper';
import { Navigation, Pagination, EffectCoverflow  } from 'swiper/modules';

export function initMainHero ():void {

const heroSwiper = new Swiper('.main-hero__swiper', {
    modules: [Navigation, Pagination, EffectCoverflow],

    effect: 'coverflow',
    // centeredSlides: true,
    slidesPerView: 'auto',
    speed: 1000,
    loop: true,
    preventInteractionOnTransition: true,
    coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: false,
    },

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    pagination: {
        el: '.main-hero__swiper-navigation',
        clickable: true,
        bulletClass: 'main-hero__swiper-navigation-item',
        bulletActiveClass: 'active',
    },
});


heroSwiper.on('slideChangeTransitionStart', () => {
  const leavingSlide = heroSwiper.slides[heroSwiper.previousIndex] as HTMLElement;
  const activeSlide = heroSwiper.slides[heroSwiper.activeIndex] as HTMLElement;
  const nextSlide = heroSwiper.slides[(heroSwiper.activeIndex + 1) % heroSwiper.slides.length] as HTMLElement;

    leavingSlide.style.setProperty('transform', 'translate3d(-150px,50px,-5px) rotateX(-20deg) scale(0.8)', 'important');
    leavingSlide.style.setProperty('opacity', '0.5', 'important');
    leavingSlide.style.setProperty('z-index', '5', 'important');

    activeSlide.style.setProperty('transform', 'translate3d(0,0,5px) scale(1)', 'important');
    activeSlide.style.setProperty('opacity', '1', 'important');
    activeSlide.style.setProperty('z-index', '10', 'important');

    nextSlide.style.setProperty('z-index', '15', 'important');
    nextSlide.style.setProperty('transform', 'translate3d(0,0,100px) scale(1)', 'important'); 

});

heroSwiper.on('slideChangeTransitionEnd', () => {
  const leavingSlide = heroSwiper.slides[heroSwiper.previousIndex] as HTMLElement;
  const activeSlide = heroSwiper.slides[heroSwiper.activeIndex] as HTMLElement;
  const nextSlide = heroSwiper.slides[(heroSwiper.activeIndex + 1) % heroSwiper.slides.length] as HTMLElement;

    leavingSlide.style.setProperty('transform', '', 'important');
    leavingSlide.style.setProperty('opacity', '', 'important');
    leavingSlide.style.setProperty('z-index', '', 'important');


    nextSlide.style.setProperty('z-index', '', 'important');
    nextSlide.style.setProperty('transform', '', 'important');
    nextSlide.style.setProperty('opacity', '', 'important');

    activeSlide.style.setProperty('z-index', '10', 'important');
    activeSlide.style.setProperty('transform', 'translate3d(0,0,5px) scale(1)', 'important');
    activeSlide.style.setProperty('opacity', '1', 'important');


});




}

