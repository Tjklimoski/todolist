
const date = new Date();
let title = '';

const options = {
  weekday: 'long',
  day: 'numeric',
  month: 'long'
};

// first argument is locale, undefined will use the users default locale
title = date.toLocaleDateString(undefined, options);