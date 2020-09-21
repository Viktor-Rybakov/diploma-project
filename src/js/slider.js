(function () {

  'use strict'

  let slider = document.querySelector('.js-slider');
  let sliderList = slider.querySelector('.js-slider__list');
  const sliderButtonNext = slider.querySelector('.js-slider__next');
  const sliderButtonPrev = slider.querySelector('.js-slider__prev');
  let paginationButtons = slider.querySelectorAll('.js-pagination-button');
  let slidesAmount = sliderList.childNodes.length;
  let currentSlide = 0;
  let direction;
  let touchStartPageX;
  let clickPrev = moveRight;
  let clickNext = moveLeft;
  let slideWidth = sliderList.children[1].getBoundingClientRect().left - sliderList.children[0].getBoundingClientRect().left;

  setCurrentButton();

  window.addEventListener('resize', function(){
    slideWidth = sliderList.children[1].getBoundingClientRect().left - sliderList.children[0].getBoundingClientRect().left;
  });

  sliderButtonPrev.addEventListener('click', clickPrev);
  sliderButtonNext.addEventListener('click', clickNext);

  sliderList.addEventListener('transitionend', (event) => {
    if ( event.target.contains(sliderList) ) {
      removeSlide();
    }
  });

  sliderList.addEventListener('touchstart', (event) => {
    touchStartPageX = event.touches[0].pageX;
  }, {passive: true});

  sliderList.addEventListener('touchend', (event) => {
    let touchEndPageX = event.changedTouches[0].pageX;

    if (touchEndPageX < touchStartPageX) {
      moveLeft();
    } else if (touchEndPageX > touchStartPageX) {
      moveRight();
    }

    touchStartPageX = undefined;
  }, {passive: true});

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

      setCurrentSlide();
      setCurrentButton()
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

    setCurrentSlide();
    setCurrentButton()
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

  function setCurrentSlide() {
    switch (direction) {
      case 'left':
        if (currentSlide < slidesAmount - 1 ) {
          currentSlide++;
        } else {
          currentSlide = 0;
        }
        break;
      case 'right':
        if (currentSlide > 0) {
          currentSlide--;
        } else {
          currentSlide = slidesAmount - 1;
        }
        break;
    }
  }

  function setCurrentButton() {
    paginationButtons.forEach((item, i, button) => {
      button[i].classList.remove('pagination__button--active');

      if (i === currentSlide) {
        button[i].classList.add('pagination__button--active');
      }
    })
  }
  
}());