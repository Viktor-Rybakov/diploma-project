menu();
dialog();
header();
slider();
upButton();


/* ------- Menu ------- */

function menu() {

  'use strict'

  const menu = document.querySelector('.js-menu');
  const menuButton = document.querySelector('.js-menu-button');

  window.addEventListener('click', (event) => {
    let target = event.target;

    if ( menuButton.contains(target) && ( menuButton.getAttribute('aria-expanded') === 'false') ) {
      openMenu();
    } else if ( menuButton.getAttribute('aria-expanded') === 'true' ) {

      if ( menuButton.contains(target) ) {
        closeMenu();
      } else if ( !menu.contains(target) ) {
        closeMenu();
      } else if ( menu.contains(target) && target.closest('.menu__link') ) {
        closeMenu();
      }
    }
  });

  window.addEventListener('scroll', () => {
    if ( menuButton.getAttribute('aria-expanded') === 'true' ) {
      closeMenu();
    }
  }, {passive: true});

  window.addEventListener('resize', () => {
    if ( menuButton.getAttribute('aria-expanded') === 'true' ) {
      closeMenu();
    }
  });

  function openMenu() {
    menu.classList.add('menu--open');
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Закрыть меню');
    menuButton.classList.add('menu-button--open');
  }

  function closeMenu() {
    menu.classList.remove('menu--open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Открыть меню');
    menuButton.classList.remove('menu-button--open');
  }
}


/* ------- Dialog ------- */

function dialog() {

  'use strict';

  const openButtons = document.querySelectorAll('.js-popup-button');
  const body = document.querySelector('.js-body');
  const dialog = document.querySelector(('.js-order-dialog'));
  const form = document.querySelector('.js-form');
  const overlay = document.querySelector('.js-dialog-backdrop');
  const closeButton = document.querySelector('.js-modal-close');
  const firstFocusElement = document.querySelector('.js-first-focus');
  const lastFocusElement = document.querySelector('.js-last-focus');

  let focusAfterClose;
  let preDiv;
  let postDiv;



  body.addEventListener('keydown', (event) => {
    let keyCode = event.key;
    if (keyCode === 'Escape' && !dialog.classList.contains('hidden')) {
      closeDialog(dialog, form, overlay, body, focusAfterClose);
      }
  });

  body.addEventListener('click', (event) => {
    if ( !dialog.classList.contains('hidden') && !event.target.classList.contains('js-popup-button')) {

      if ( closeButton.contains(event.target) || !dialog.contains(event.target) ) {
        closeDialog(dialog, form, overlay, body, focusAfterClose);
      }
    }
  });

  openButtons.forEach((item, i, buttons) => {
    buttons[i].addEventListener( 'click', (event) => {
      event.preventDefault();
      openDialog(dialog, overlay, body, firstFocusElement, lastFocusElement);
      focusAfterClose = event.target;
    });
  });

  function openDialog(dialog, overlay, body, firstFocusElement, lastFocusElement) {
    toggleDialog(dialog);
    toggleOverlay(overlay);
    toggleBodyScroll(body);
    setFocus(firstFocusElement);
    setTrapFocus(dialog, firstFocusElement, lastFocusElement);
  }

  function closeDialog(dialog, form, overlay, body, focusAfterClose) {
    form.reset();
    toggleDialog(dialog);
    toggleOverlay(overlay);
    toggleBodyScroll(body);
    removeTrapFocus();
    setFocus(focusAfterClose);

    focusAfterClose = undefined;
  }

  function toggleDialog(dialog) {
    dialog.classList.toggle('hidden');
  }

  function toggleOverlay(overlay) {
    overlay.classList.toggle('active');
  }

  function toggleBodyScroll(body) {
    body.classList.toggle('has-dialog');

    if ( body.hasAttribute('style') ) {
        body.removeAttribute('style');
    } else {
        body.style.paddingRight = getScrollWidth() + 'px';
    }
  }

  function getScrollWidth() {
    let div = document.createElement('div');

    div.style.overflowY = 'scroll';
    div.style.width = '50px';
    div.style.height = '50px';

    document.body.append(div);
    let scrollWidth = div.offsetWidth - div.clientWidth;

    div.remove();

    return scrollWidth;
  }

  function setFocus(element) {
    element.focus();
  }

  function setTrapFocus(dialog, firstFocusElement, lastFocusElement) {
    preDiv = document.createElement('div');
    postDiv = document.createElement('div');
    preDiv.tabIndex = 0;
    postDiv.tabIndex = 0;
    dialog.prepend(preDiv);
    dialog.append(postDiv);

    preDiv.addEventListener('focus', () => {
      setFocus(lastFocusElement);
    });

    postDiv.addEventListener('focus', () => {
      setFocus(firstFocusElement);
    });
  }

  function removeTrapFocus() {
    preDiv.remove();
    postDiv.remove();
  };

  form.onsubmit = async (event) => {
    event.preventDefault();

    fetch('mail.php', {
      method: 'POST',
      body: new FormData(form)
    });

    setTimeout(() => {
      closeDialog(dialog, form, overlay, body, focusAfterClose);
    }, 500);
  };
}


/* ------- Header ------- */

function header() {

  'use strict'

  const header = document.querySelector('.js-header');
  const html = document.querySelector('.js-page');

  let headerHeight;

  if ( window.innerWidth <= 1024 ) {
    headerHeight = header.getBoundingClientRect().height;
    addScrollPadding(headerHeight);
  }

  window.addEventListener('resize', () => {
    if ( window.innerWidth <= 1024 ) {
      headerHeight = header.getBoundingClientRect().height;
      addScrollPadding(headerHeight);
    } else {
      removeScrollPadding();
    }
  });

  function addScrollPadding(height) {
    html.style.scrollPaddingTop = height + 'px';
  }

  function removeScrollPadding() {
    html.removeAttribute('style');
  }
}


/* ------- Slider ------- */

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
      let newElement = templatePaginationButton.content.cloneNode(true);
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


/* ------- UpButton ------- */

function upButton() {

  'use strict';

  const upButton = document.querySelector('.js-up-button');

  window.addEventListener('scroll', () => {
    if ( window.pageYOffset >= document.documentElement.clientHeight ) {
      upButton.classList.remove('up-button--hidden');
    }

    if ( window.pageYOffset < document.documentElement.clientHeight ) {
      upButton.classList.add('up-button--hidden');
    }
  });

  upButton.addEventListener('click', () => {
    window.scrollTo(0,0);
  });
}
