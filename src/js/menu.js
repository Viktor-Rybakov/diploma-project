'use strict'

const HEADER = document.querySelector('.js-header');
const MENU = document.querySelector('.js-menu');
const MENU_BUTTON = document.querySelector('.js-menu-button');
const MAIN = document.querySelector('.js-main');
const SECTION = document.querySelectorAll('.js-section');
const WHAT_I_DO_SECTION = document.querySelector('.js-what-i-do-section');

window.addEventListener('click', function(event) {
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

window.addEventListener('scroll', function(){
  let currentScroll = window.pageYOffset;
  let headerHeight = HEADER.getBoundingClientRect().height;

  if ( window.innerWidth <= 1024 && currentScroll > headerHeight + 600 ) {
    fixHeader();
  } else if ( window.innerWidth <= 1024 && currentScroll < headerHeight + 600 ) {
    freeHeader();
  }
  if ( MENU_BUTTON.getAttribute('aria-expanded') === 'true' ) {
    closeMenu();
  }
});

window.addEventListener('resize', function(){
  closeMenu();

  if (window.innerWidth > 1024) {
    freeHeader();
    closeMenu();
  }
});

function openMenu() {
  MENU.classList.add('menu_open');
  MENU_BUTTON.setAttribute('aria-expanded', 'true');
  MENU_BUTTON.setAttribute('aria-label', 'Закрыть меню');
  MENU_BUTTON.classList.add('menu-button_open');
}

function closeMenu() {
  MENU.classList.remove('menu_open');
  MENU_BUTTON.setAttribute('aria-expanded', 'false');
  MENU_BUTTON.setAttribute('aria-label', 'Открыть меню');
  MENU_BUTTON.classList.remove('menu-button_open');
}

function fixHeader() {
  let headerHeight = HEADER.getBoundingClientRect().height;

  HEADER.classList.add('header_fixed');
  MAIN.style.marginTop = headerHeight + 'px';
  SECTION.forEach( element => element.style.scrollMarginTop = headerHeight + 'px' );
  WHAT_I_DO_SECTION.style.scrollSnapAlign = 'none';
}

function freeHeader() {
  HEADER.classList.remove('header_fixed');
  MAIN.removeAttribute('style');
  SECTION.removeAttribute('style');
  WHAT_I_DO_SECTION.removeAttribute('style');
}