//  This file will be loaded on settings pages, regardless of theme.

import escapeTextContentForBrowser from 'escape-html';
const { delegate } = require('rails-ujs');
import emojify from '../mastodon/features/emoji/emoji';

delegate(document, '#account_display_name', 'input', ({ target }) => {
  const name = document.querySelector('.card .display-name strong');
  if (name) {
    if (target.value) {
      name.innerHTML = emojify(escapeTextContentForBrowser(target.value));
    } else {
      name.textContent = document.querySelector('#default_account_display_name').textContent;
    }
  }
});

delegate(document, '#account_avatar', 'change', ({ target }) => {
  const avatar = document.querySelector('.card .avatar img');
  const [file] = target.files || [];
  const url = file ? URL.createObjectURL(file) : avatar.dataset.originalSrc;

  avatar.src = url;
});

delegate(document, '#account_header', 'change', ({ target }) => {
  const header = document.querySelector('.card .card__img img');
  const [file] = target.files || [];
  const url = file ? URL.createObjectURL(file) : header.dataset.originalSrc;

  header.src = url;
});

delegate(document, '#account_locked', 'change', ({ target }) => {
  const lock = document.querySelector('.card .display-name i');

  if (target.checked) {
    lock.style.display = 'inline';
  } else {
    lock.style.display = 'none';
  }
});

delegate(document, '.input-copy input', 'click', ({ target }) => {
  target.focus();
  target.select();
  target.setSelectionRange(0, target.value.length);
});

delegate(document, '.input-copy button', 'click', ({ target }) => {
  const input = target.parentNode.querySelector('.input-copy__wrapper input');

  const oldReadOnly = input.readonly;

  input.readonly = false;
  input.focus();
  input.select();
  input.setSelectionRange(0, input.value.length);

  try {
    if (document.execCommand('copy')) {
      input.blur();
      target.parentNode.classList.add('copied');

    setTimeout(() => {
        target.parentNode.classList.remove('copied');
      }, 700);
    }
  } catch (err) {
    console.error(err);
  }

  input.readonly = oldReadOnly;
});
