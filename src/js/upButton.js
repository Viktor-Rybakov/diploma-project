/* ------- UpButton ------- */
upButton();

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
