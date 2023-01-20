// setup express
import express from 'express';
const app = express();
const port = process.env.PORT || 3000;

// create __filename and __dirname variables
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// set global variable
let newTask = '';

// set app view engine to EJS
app.set('view engine', 'ejs');

// setup url encoded parsing for form submission
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
  const date = new Date();
  let day = '';

  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };

  // first argument is locale, undefined will use the users default locale
  day = date.toLocaleDateString(undefined, options);

  // pass day to list.ejs to render
  res.render('list', {day: day, newTask: newTask});
});

app.post('/', (req, res) => {
  newTask = req.body.task;
  res.redirect('/');
});

app.listen(port, (err) => {
  if (err) {
    console.error(err);    
  } else {
    console.log(`server started on port ${port}`);
  }
});