'use strict';

const BUTTONS = document.querySelectorAll('.js-popup-button');
const BODY = document.querySelector('.js-body');
const ORDER_DIALOG = document.querySelector(('.js-order-dialog'));
const OVERLAY = document.querySelector('.js-modal-overlay');
const CLOSE_BUTTON = document.querySelector('.js-modal-close');

BUTTONS.forEach((item, i, BUTTONS) => {
    BUTTONS[i].addEventListener('click', () => {
        toggleOrderDialog();
        toggleOverlay();
        toggleFixBodyScroll();
    })
})

CLOSE_BUTTON.addEventListener('click', () => {
    toggleOrderDialog();
    toggleOverlay();
    toggleFixBodyScroll();
})

BODY.addEventListener('keydown', (event) => {
    let keyCode = event.key;
    if (keyCode === 'Escape' && !ORDER_DIALOG.classList.contains('closed')) {
        toggleOrderDialog();
        toggleOverlay();
        toggleFixBodyScroll();
    }
});

function toggleOrderDialog() {
    ORDER_DIALOG.classList.toggle('closed');
}

function toggleOverlay() {
  OVERLAY.classList.toggle('closed');
}

function toggleFixBodyScroll() {
    BODY.classList.toggle('modal-active');

    if ( BODY.hasAttribute('style') ) {
        BODY.removeAttribute('style');
    } else {
        BODY.style.paddingRight = getScrollWidth() + 'px';
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