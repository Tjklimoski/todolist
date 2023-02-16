// setup express
import express from 'express';
const app = express();
const port = process.env.PORT || 3000;

// import date module
import * as date from './date.js';

// import Mongoose
import mongoose from 'mongoose';

// create __filename and __dirname variables
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// set app view engine to EJS
app.set('view engine', 'ejs');

// setup static directory
app.use(express.static('public'));

// setup url encoded parsing for form submission
app.use(express.urlencoded({extended: true}));

// Setup mongoose connection to database
// mongoose depreication warning
mongoose.set('strictQuery', false);
const todolistDB = mongoose.createConnection('mongodb://127.0.0.1:27017/todolistDB');

// Create mongoose schema for tasks
const taskSchema = new mongoose.Schema({
  task: {
    type: String,
    minLength: 2
  }
});

// Create mongoose model for tasks
const Task = todolistDB.model('Task', taskSchema);

// create 3 new task documents
const task1 = new Task({
  task: 'Do taxes'
});

const task2 = new Task({
  task: 'Clean bathroom'
});

const task3 = new Task({
  task: 'Play Hogwarts Legacy'
});

const defaultTasks = [task1, task2, task3];

// No longer want to add the documents to the database again
// Task.create(defaultTasks, (err) => {
//   err ? console.warn(err) : console.log('succesfully updated tasks collection');
// });

app.get('/', (req, res) => {

  // call the date.js module's default export with the name date()
  let title = date.getDate();

  // fetch task documents from todolistDB
  Task.find({}, (err, docs) => {
    // pass title and docs to list.ejs to render
    res.render('list', {title: title, tasks: docs});
  });

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