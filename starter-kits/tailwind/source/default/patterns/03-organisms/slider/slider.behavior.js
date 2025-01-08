// Use once after https://www.drupal.org/project/once/issues/3466026 is fixed.
// import once from '@drupal/once';
import Splide from '@splidejs/splide';

Drupal.behaviors.slider = {
  attach() {
    const sliders = Array.from(document.getElementsByClassName('splide'));
    // Switch back to once.
    // const sliders = once('splide-slider', '.splide');
    sliders.forEach((slider) => {
      if (slider.classList.contains('splide--processed') === false) {
        const autoplay = slider.attributes['data-autoplay'].value;
        const slidesPerView = slider.attributes['data-slides-per-view'].value;
        const splide = new Splide(slider, {
          type: 'slide',
          arrows: true,
          perPage: slidesPerView,
          perMove: slidesPerView,
          autoplay: autoplay === '1',
          interval: 5000,
          rewind: autoplay === '1',
          gap: 30,
          breakpoints: {
            640: {
              perPage: 1,
              perMove: 1,
            },
            768: {
              perPage: slidesPerView === '4' ? 2 : 1,
              perMove: slidesPerView === '4' ? 2 : 1,
            },
          },
        });
        splide.mount();
        slider.classList.add('splide--processed');
      }
    });
  },
};
