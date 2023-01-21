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
let tasks = ['task 1', 'task 2', 'task 3'];
let workTasks = ['work task 1', 'a really long work task 2 to see how the page handles the formatting of long piece of text lol.', 'work task 3'];

// set app view engine to EJS
app.set('view engine', 'ejs');

// setup static directory
app.use(express.static('public'));

// setup url encoded parsing for form submission
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
  const date = new Date();
  let title = '';

  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };

  // first argument is locale, undefined will use the users default locale
  title = date.toLocaleDateString(undefined, options);

  // pass title to list.ejs to render
  res.render('list', {title: title, tasks: tasks});
});

app.get('/work', (req, res) => {
  let title = 'Work List';

  res.render('list', {title: title, tasks: workTasks});
});

app.post('/', (req, res) => {
  let task = req.body.task;
  tasks.push(task);
  res.redirect('/');
});

app.post('/work', (req, res) => {
  let task = req.body.task;
  workTasks.push(task);
  res.redirect('/work');
});

app.listen(port, (err) => {
  if (err) {
    console.error(err);    
  } else {
    console.log(`server started on port ${port}`);
  }
});