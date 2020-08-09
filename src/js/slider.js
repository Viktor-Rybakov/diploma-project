'use strict'

let slider = document.querySelector('.js-slider');
let sliderList = slider.querySelector('.js-slider__list');
const SLIDER_BUTTON_NEXT = slider.querySelector('.js-slider__next');
const SLIDER_BUTTON_PREV = slider.querySelector('.js-slider__prev');

let direction;
let touchStartPageX;
let clickPrev = moveRight;
let clickNext = moveLeft;
let slideWidth = sliderList.children[1].getBoundingClientRect().left - sliderList.children[0].getBoundingClientRect().left;

window.addEventListener('resize', function(){
  slideWidth = sliderList.children[1].getBoundingClientRect().left - sliderList.children[0].getBoundingClientRect().left;
});

SLIDER_BUTTON_PREV.addEventListener('click', clickPrev);
SLIDER_BUTTON_NEXT.addEventListener('click', clickNext);

sliderList.addEventListener('transitionend', (event) => {
  if ( event.target.contains(sliderList) ) {
    removeSlide();
  }
});

sliderList.addEventListener('touchstart', (event) => {
  touchStartPageX = event.touches[0].pageX;
});

sliderList.addEventListener('touchend', (event) => {
  let touchEndPageX = event.changedTouches[0].pageX;

  if (touchEndPageX < touchStartPageX) {
    moveLeft();
  } else if (touchEndPageX > touchStartPageX) {
    moveRight();
  }

  touchStartPageX = undefined;
});

function moveRight() {
  direction = 'right';
  if (clickPrev == null) {
    return false;
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

function moveLeft() {
  direction = 'left';
  if (clickNext == null) {
    return false;
  } else {
    let nextSlide = sliderList.firstElementChild.cloneNode(true);

    sliderList.append(nextSlide);
    sliderList.style.transform = `translateX(-${slideWidth}px)`;

    sliderList = slider.querySelector('.js-slider__list');
    clickNext = null;
  }
}

function removeSlide() {
  if (direction === 'left') {
    sliderList.firstElementChild.remove();

    sliderList.style.transition = 'none';
    sliderList.style.transform = 'translateX(0)';
    setTimeout(function(){
      sliderList.style.transition = '0.2s';
      clickNext = moveLeft;
    }, 50);

  } else if (direction === 'right') {
    sliderList.lastElementChild.remove();
    clickPrev = moveRight;
  }

  sliderList = slider.querySelector('.js-slider__list');
}