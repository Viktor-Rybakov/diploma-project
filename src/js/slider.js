/* ------- Slider ------- */
slider();

function slider() {

  'use strict'

  const slider = document.querySelector('.js-slider');
  const sliderList = slider.querySelector('.js-slider__list');
  const sliderButtonNext = slider.querySelector('.js-slider__next');
  const sliderButtonPrev = slider.querySelector('.js-slider__prev');
  const paginationList = slider.querySelector('.js-pagination-list');
  const templatePaginationButton = slider.querySelector('#pagination__button-template');
  const slidesAmount = sliderList.childNodes.length;

  let currentSlide = 1;
  let touchStartPageX;
  let slideWidth = getSlideWidth();
  let frameSize = getFrameSizes();
  let paginationButtons;
  let windowWidth = window.innerWidth;
  let maxPosition = slidesAmount - frameSize + 1;

  createPaginationButtons();
  setActivePaginationButton();
  addListenerForButtons();
  updateControlButtons();

  window.addEventListener('resize', function() {
    setTimeout(() => {
      let newWindowWidth = window.innerWidth;

      if (windowWidth < 620 && newWindowWidth >= 620 ||
          windowWidth > 620 && newWindowWidth <= 620 ||
          windowWidth < 1280 && newWindowWidth >= 1280 ||
          windowWidth > 1280 && newWindowWidth <= 1280) {
        slideWidth = getSlideWidth();
        frameSize = getFrameSizes();
        maxPosition = slidesAmount - frameSize + 1;
        resetSliderPosition();
        removePaginationButtons();
        createPaginationButtons();
        setActivePaginationButton();
        addListenerForButtons();
        updateControlButtons();
      }

      windowWidth = newWindowWidth;
    }, 100);
  });

  sliderButtonPrev.addEventListener('click', () => {
    currentSlide = getNewPosition('prev', currentSlide, 1, maxPosition);
    translateSlider(currentSlide);
    updateControlButtons();
    setActivePaginationButton();
  });

  sliderButtonNext.addEventListener('click', () => {
    currentSlide = getNewPosition('next', currentSlide, 1, maxPosition);
    translateSlider(currentSlide);
    updateControlButtons();
    setActivePaginationButton();
  });

  sliderList.addEventListener('touchstart', (event) => {
    touchStartPageX = event.touches[0].pageX;
  });

  sliderList.addEventListener('touchmove', (event) => {
    let touchOffset = touchStartPageX - event.changedTouches[0].pageX;
    translateSlider(currentSlide, touchOffset);
    touchOffset = undefined;
  });

  sliderList.addEventListener('touchend', (event) => {
    let touchEndPageX = event.changedTouches[0].pageX;

    if (touchEndPageX < touchStartPageX) {
      currentSlide = getNewPosition('next', currentSlide, 1, maxPosition);
      translateSlider(currentSlide);
      updateControlButtons();
      setActivePaginationButton();
    } else if (touchEndPageX > touchStartPageX) {
      currentSlide = getNewPosition('prev', currentSlide, 1, maxPosition);
      translateSlider(currentSlide);
      updateControlButtons();
      setActivePaginationButton();
    }

    touchStartPageX = undefined;
  });

  function getSlideWidth() {
    return sliderList.children[1].getBoundingClientRect().left - sliderList.children[0].getBoundingClientRect().left;
  }

  function getFrameSizes() {
    if (window.innerWidth >= 1280) {
      return 3;
    }
    if (620 <= window.innerWidth && window.innerWidth < 1280) {
      return 2;
    }
    if (window.innerWidth < 620) {
      return 1;
    }
  }

  function resetSliderPosition() {
    currentSlide = 1;
    sliderList.style.transform = `translateX(0px)`;
  }

  function updateControlButtons() {
    if (currentSlide === 1) {
      sliderButtonPrev.setAttribute('disabled', 'disabled');
    } else {
      sliderButtonPrev.removeAttribute('disabled');
    }

    if (currentSlide === maxPosition) {
      sliderButtonNext.setAttribute('disabled', 'disabled');
    } else {
      sliderButtonNext.removeAttribute('disabled');
    }
  }

  function getNewPosition(direction, position, min, max) {
    switch(direction) {
      case 'next':
        if (position < max) {
          return ++position;
        }
        else {
          return position;
        }
        break;

      case 'prev':
        if (position > min) {
          return --position;
        }
        else {
          return position;
        }
        break;
    }
  }

  function translateSlider(position, offset = 0) {
    let translateWidht = (1 - position) * slideWidth - offset;
    sliderList.style.transform = `translateX(${translateWidht}px)`;
  }

  function createPaginationButtons() {
    for (let i = 1; i <= maxPosition; i++) {
      let newElement = document.createElement('li');
      newElement = templatePaginationButton.content.cloneNode(true);
      let newButton = newElement.querySelector('.js-pagination-button');
      newButton.setAttribute('aria-label', `Положение слайдера ${i}`);
      paginationList.appendChild(newElement);
    }

    paginationButtons = slider.querySelectorAll('.js-pagination-button');
  }

  function removePaginationButtons() {
    while (paginationList.firstChild) {
      paginationList.removeChild(paginationList.firstChild);
    }
  }

  function setActivePaginationButton() {
    for (let i = 1; i <= maxPosition; i++) {
      if (i === currentSlide) {
        paginationButtons[i-1].classList.add('pagination__button--active');
      }
      else {
        paginationButtons[i-1].classList.remove('pagination__button--active');
      }
    }
  }

  function addListenerForButtons() {
    for (let i = 1; i <= maxPosition; i++) {
      paginationButtons[i-1].addEventListener('click', () => {
        currentSlide = i;
        translateSlider(currentSlide);
        updateControlButtons();
        setActivePaginationButton();
      });
    }
  }
}
