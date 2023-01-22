// setup express
import express from 'express';
const app = express();
const port = process.env.PORT || 3000;

// import date module
import * as date from './date.js';

// create __filename and __dirname variables
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// set global variable
const tasks = [];
const workTasks = [];

// set app view engine to EJS
app.set('view engine', 'ejs');


// setup static directory
app.use(express.static('public'));


// setup url encoded parsing for form submission
app.use(express.urlencoded({extended: true}));


app.get('/', (req, res) => {

  // call the date.js module's default export with the name date()
  let title = date.getDate();

  // pass title to list.ejs to render
  res.render('list', {title: title, tasks: tasks});
});


app.get('/work', (req, res) => {
  let title = 'Work List';

  res.render('list', {title: title, tasks: workTasks});
});


app.get('/about', (req, res) => {
  res.render('about');
})


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