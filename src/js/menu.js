'use strict'

const MENU = document.querySelector('.js-menu');
const MENU_BUTTON = document.querySelector('.js-menu-button');

window.addEventListener('click', (event) => {
  let target = event.target;

  if ( MENU_BUTTON.contains(target) && ( MENU_BUTTON.getAttribute('aria-expanded') === 'false') ) {
    openMenu();
  } else if ( MENU_BUTTON.getAttribute('aria-expanded') === 'true' ) {

    if ( MENU_BUTTON.contains(target) ) {
      closeMenu();
    } else if ( !MENU.contains(target) ) {
      closeMenu();
    } else if ( MENU.contains(target) && target.closest('.menu__link') ) {
      closeMenu();
    }
  }
});

window.addEventListener('scroll', () => {
  if ( MENU_BUTTON.getAttribute('aria-expanded') === 'true' ) {
    closeMenu();
  }
});

window.addEventListener('resize', () => {
  if ( MENU_BUTTON.getAttribute('aria-expanded') === 'true' ) {
    closeMenu();
  }
});

function openMenu() {
  MENU.classList.add('menu--open');
  MENU_BUTTON.setAttribute('aria-expanded', 'true');
  MENU_BUTTON.setAttribute('aria-label', 'Закрыть меню');
  MENU_BUTTON.classList.add('menu-button--open');
}

function closeMenu() {
  MENU.classList.remove('menu--open');
  MENU_BUTTON.setAttribute('aria-expanded', 'false');
  MENU_BUTTON.setAttribute('aria-label', 'Открыть меню');
  MENU_BUTTON.classList.remove('menu-button--open');
}