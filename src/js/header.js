'use strict'

const HEADER = document.querySelector('.js-header');
const HTML = document.querySelector('.js-page');

let headerHeight;

if ( window.innerWidth <= 1024 ) {
  headerHeight = HEADER.getBoundingClientRect().height;
  addScrollPadding(headerHeight);
}

window.addEventListener('resize', () => {
  if ( window.innerWidth <= 1024 ) {
    headerHeight = HEADER.getBoundingClientRect().height;
    addScrollPadding(headerHeight);
  } else {
    removeScrollPadding();
  }
});

function addScrollPadding(height) {
  HTML.style.scrollPaddingTop = height + 'px';
}

function removeScrollPadding() {
  HTML.removeAttribute('style');
}