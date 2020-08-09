'use strict'

let slider = document.querySelector('.js-slider');
let sliderList = slider.querySelector('.js-slider__list');
const slider_BUTTON_NEXT = slider.querySelector('.js-slider__next');
const slider_BUTTON_PREV = slider.querySelector('.js-slider__prev');

let direction;
let clickPrev = prev;
let clickNext = next;
let slideWidth = sliderList.children[1].getBoundingClientRect().left - sliderList.children[0].getBoundingClientRect().left;

window.addEventListener('resize', function(){
  slideWidth = sliderList.children[1].getBoundingClientRect().left - sliderList.children[0].getBoundingClientRect().left;
});

slider_BUTTON_PREV.addEventListener('click', clickPrev);
slider_BUTTON_NEXT.addEventListener('click', clickNext);
sliderList.addEventListener('transitionend', removeSlide);

function prev() {
  direction = 1;
  if (clickPrev == null) {
    return
  } else {
    clickPrev = null;
    sliderList.style.transition = 'none';
    sliderList.style.transform = `translateX(-${slideWidth}px)`;

    let nextSlide = sliderList.lastElementChild.cloneNode(true);

    sliderList.prepend(nextSlide);

    setTimeout(() => {
      sliderList.style.transition = '0.2s';
      sliderList.style.transform = 'translateX(0)';
    }, 50);

    sliderList = slider.querySelector('.js-slider__list');
  }
}

function next() {
  direction = -1;
  if (clickNext == null) {
    return
  } else {
    let nextSlide = sliderList.firstElementChild.cloneNode(true);

    sliderList.append(nextSlide);
    sliderList.style.transform = `translateX(-${slideWidth}px)`;

    sliderList = slider.querySelector('.js-slider__list');
    clickNext = null;
  }
}

function removeSlide() {
  if (direction === -1) {
    sliderList.firstElementChild.remove();

    sliderList.style.transition = 'none';
    sliderList.style.transform = 'translateX(0)';
    setTimeout(function(){
      sliderList.style.transition = '0.2s';
      clickNext = next;
    }, 50);

  } else if (direction === 1) {
    sliderList.lastElementChild.remove();
    clickPrev = prev;
  }

  sliderList = slider.querySelector('.js-slider__list');
}