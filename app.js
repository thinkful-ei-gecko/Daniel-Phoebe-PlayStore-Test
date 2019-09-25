'use strict';

const express = require('express');
const morgan = require('morgan');

const app = express();
const playstore = require('./playstore');

app.use(morgan('dev'));

app.get('/apps', (req, res) => {
  const { sort, genre = '' }= req.query;
  // let apps = [];
  // playstore.map(app => console.log(app));

  //validate user input
  if (sort) {
    if (!['app', 'rating'].includes(sort.toLowerCase())) {
      return res
        .status(400)
        .send('Sort must be one of app or rating');
    }
  }
  if (genre) {
    if (!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genre)) {
      return res
        .status(400)
        .send('Genre must be Action, Puzzle, Strategy, Casual, Arcade, Card');
    }
  }

  let results = playstore;  

  //return entries for sort  
  function capitalizeFirstLetter (term) {
    return term.charAt(0).toUpperCase() + term.slice(1);
  }
  if  (sort) {
    results.sort((a, b) => {
      const sortTerm = capitalizeFirstLetter(sort);
      return a[sortTerm] > b[sortTerm] ? 1 : a[sortTerm] < b[sortTerm] ? -1 : 0;
    });
  }

  //return entries for genre search
  if (genre) {
    results = playstore.filter(app =>
      app 
        .Genres.toLowerCase()
        .includes(genre.toLowerCase())
    );
  }
  res.json(results);
});

module.exports = app;