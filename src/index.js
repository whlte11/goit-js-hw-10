import { fetchCountries } from './js/fetchCountries.js';
import { createMarkup } from './js/createMarkup';
import { createCountryMarkup } from './js/createCountryMarkup';
import { cleanMarkup } from './js/cleanMarkup';

import './css/styles.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  about: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
  const name = refs.input.value.trim();

  if (name === '') {
    cleanMarkup(refs.list);
    cleanMarkup(refs.about);
    return;
  }

  fetchCountries(name)
    .then(countries => {
      cleanMarkup(refs.list);
      cleanMarkup(refs.about);
      if (countries.length === 1) {
        refs.about.innerHTML = createCountryMarkup(countries);
      } else if (countries.length <= 10) {
        refs.list.innerHTML = createMarkup(countries);
      } else {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(error => {
      if (error.message === '404') {
        Notify.failure('Oops, there is no country with that name');
      }
      cleanMarkup(refs.list);
      cleanMarkup(refs.about);
    });
}