
import express from 'express';
import * as date from './date.js';
import mongoose from 'mongoose';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import _ from 'lodash';

// setup express
const app = express();
const port = process.env.PORT || 3000;

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
const todolistDB = mongoose.createConnection('mongodb+srv://admin-tjk:4sxRV9aIKewVjI4J@learning.pp2n17d.mongodb.net/todolistDB');

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

// create 3 new task documents, place in array
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


app.post('/', async (req, res) => {
  // Create a new task based on user input, add to db
  const newUserTask = new Task({
    task: req.body.task
  });
  
  await newUserTask.save();

  // To render the newly added content
  res.redirect('/');
});


app.post('/deleteItem', async (req, res) => {
  const checkedTaskId = req.body.checkbox;
  // from input type hidden on ejs file:
  const listName = req.body.listName;

  // check if delete is on a custom list or the default list
  if (listName === date.getDate()) {
    await Task.findByIdAndRemove(checkedTaskId);
    res.redirect('/');
  } else {
    // To remove the embedded task document from the tasks array
    List.findOneAndUpdate(
      {name: listName},
      {$pull: {tasks: {_id: checkedTaskId}}},
      (err, results) => {
        err ? console.error(err) : res.redirect(`/${listName}`);
      }
    );
  }
});


app.route('/:listName')
  .get((req, res) => {
    // To stop dupliacte documents based on capitalization
    const listName = _.capitalize(req.params.listName);

    List.findOne({name: listName}, async (err, doc) => {
      if (!err) {
        // Create a new list document if there isn't one
        if (!doc) {
          const list = new List({
            name: listName,
            tasks: defaultTasks
          });

          await list.save();

          res.redirect(`/${listName}`);
        // render list document if there IS one
        } else {
          res.render('list', {title: doc.name, tasks: doc.tasks});
        }
      }
    });
  })
  .post((req, res) => {
    // create new task document from user input on custom list
    const listName = req.params.listName;

    const task = new Task({
      task: req.body.task
    });

    List.findOne({name: listName}, async (err, doc) => {
      if (!err) {
        // Add task document to tasks array, inside list document
        doc.tasks.push(task);
        await doc.save();
        // To render new content
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