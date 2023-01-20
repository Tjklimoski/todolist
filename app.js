// setup express
import express from 'express';
const app = express();
const port = process.env.PORT || 3000;

// create __filename and __dirname variables
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// set app view engine to EJS
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  const date = new Date();
  let day = '';

  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };

  day = date.toLocaleDateString(undefined, options);

  // pass day to list.ejs to render
  res.render('list', {day: day});
});

app.listen(port, (err) => {
  if (err) {
    console.error(err);    
  } else {
    console.log(`server started on port ${port}`);
  }
});