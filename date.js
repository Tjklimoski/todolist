
function dateAsString() {
  const date = new Date();
  let day = '';

  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };

  // first argument is locale, undefined will use the users default locale
  day = date.toLocaleDateString(undefined, options);

  return day;
}

export { dateAsString as default };