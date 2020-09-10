(function () {

  'use strict';

  const buttons = document.querySelectorAll('.js-popup-button');
  const body = document.querySelector('.js-body');
  const orderDialog = document.querySelector(('.js-order-dialog'));
  const overlay = document.querySelector('.js-dialog-backdrop');
  const closeButton = document.querySelector('.js-modal-close');

  buttons.forEach((item, i, buttons) => {
    buttons[i].addEventListener('click', () => {
      toggleOrderDialog();
      toggleOverlay();
      toggleFixBodyScroll();
    })
  })

  closeButton.addEventListener('click', () => {
    toggleOrderDialog();
    toggleOverlay();
    toggleFixBodyScroll();
  })

  body.addEventListener('keydown', (event) => {
    let keyCode = event.key;
    if (keyCode === 'Escape' && !orderDialog.classList.contains('closed')) {
      toggleOrderDialog();
      toggleOverlay();
      toggleFixBodyScroll();
      }
  });

  function toggleOrderDialog() {
    orderDialog.classList.toggle('hidden');
  }

  function toggleOverlay() {
    overlay.classList.toggle('active');
  }

  function toggleFixBodyScroll() {
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

}());