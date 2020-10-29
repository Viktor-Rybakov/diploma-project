/* ------- Header ------- */
header();

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
