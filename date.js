
const date = new Date();

function dateAsString() {

  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };

  // first argument is locale, undefined will use the users default locale
  let dateString = date.toLocaleDateString(undefined, options);

  return dateString;
}

function getDay() {

  const options = {
    weekday: 'long'
  };

  // first argument is locale, undefined will use the users' default locale
  let day = date.toLocaleDateString(undefined, options);

  return day;
}

export { dateAsString as getDate, getDay, dateAsString as default };