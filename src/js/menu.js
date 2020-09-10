(function () {

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
  });

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
  
}());