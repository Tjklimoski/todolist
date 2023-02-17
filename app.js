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

// Create schema for custom lists
const listSchema = new mongoose.Schema({
  name: String,
  tasks: [taskSchema]
});

// Create mongoose model for tasks
const Task = todolistDB.model('Task', taskSchema);

// Create model for lists
const List = todolistDB.model('List', listSchema);

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

// place task documents in array
const defaultTasks = [task1, task2, task3];


app.get('/', (req, res) => {

  // call the date.js module's default export with the name date()
  let title = date.getDate();

  // fetch task documents from todolistDB
  Task.find({}, (err, docs) => {

    if (docs.length === 0) {
      // insert deafult tasks to db if empty
      Task.insertMany(defaultTasks, (err) => {
        err ? console.error(err) : res.redirect('/');
      });
    } else {
      res.render('list', {title: title, tasks: docs});
    }

  });

});


app.post('/', (req, res) => {
  const newUserTask = new Task({
    task: req.body.task
  });
  
  newUserTask.save();

  res.redirect('/');
});


app.post('/deleteItem', async (req, res) => {
  const checkedTaskId = req.body.checkbox;

  await Task.findByIdAndRemove(checkedTaskId);

  res.redirect('/');
});


app.get('/:listName', (req, res) => {
  const listName = req.params.listName;

  List.findOne({name: listName}, (err, doc) => {
    if (!err) {
      if (!doc) {
        const list = new List({
          name: listName,
          tasks: defaultTasks
        });

        list.save();

        res.redirect(`/${listName}`);
      } else {
        const tasks = doc.tasks;
        const title = doc.name;
        res.render('list', {title: title, tasks: tasks});
      }
    }
  });
});


app.post('/:listName', (req, res) => {
  const listName = req.params.listName;

  const task = new Task({
    task: req.body.task
  });

  List.findOne({name: listName}, async (err, doc) => {
    if (!err) {
      doc.tasks.push(task);
      await doc.save();
      res.redirect(`/${listName}`);
    }
  });
});


app.listen(port, (err) => {
  if (err) {
    console.error(err);    
  } else {
    console.log(`server started on port ${port}`);
  }
});