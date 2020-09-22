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