/* ------- Dialog ------- */
dialog();

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
