// setup express
import express from 'express';
const app = express();
const port = process.env.PORT || 3000;

// create __filename and __dirname variables
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get('/', (req, res) => {
  const today = new Date();

  if (today.getDay() === 6 || today.getDay() === 0) {
    res.send('Yay, it\'s the weekend!');
  } else {
    res.send('Aww, you have to go to work :(');
  }
});

app.listen(port, (err) => {
  if (err) {
    console.error(err);    
  } else {
    console.log(`server started on port ${port}`);
  }
});