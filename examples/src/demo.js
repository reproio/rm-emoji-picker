import $ from 'jquery';
import EmojiPicker from './../../src/js/EmojiPicker';

const setupPicker = function(container) {
  const input = container.querySelector('.input');
  const icon = container.querySelector('.icon');

  const picker = new EmojiPicker({
    sheets: {
      apple: './../sheets/sheet_apple_64_indexed_128.png',
      google: './../sheets/sheet_google_64_indexed_128.png',
      twitter: './../sheets/sheet_twitter_64_indexed_128.png',
      emojione: './../sheets/sheet_emojione_64_indexed_128.png'
    },
    positioning: 'vertical'
  });

  picker.listenOn(icon, container, input);
  $(input).on('change', (event) => {
    console.log('input:val',event.target.value );
  });

  return picker;
};

$(document).ready(() => {

  const contentEdit = document.getElementById('content-edit');
  const contentPicker = setupPicker(contentEdit);

  const contentInput = document.getElementById('content-input');
  const inputPicker = setupPicker(contentInput);

  setInterval(() => {
    console.log(contentPicker.getText());
    console.log(inputPicker.getText());
  }, 3000);

})