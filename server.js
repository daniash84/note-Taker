// this will be used to import the dependancies that are located in our package.json file
const express = require('express');
const path = require('path');
const fs = require('fs');

// this will activate our dependencies and also initialize the port
const PORT = process.env.PORT || 3001;
const app = express();
const db = require('./db/db.json');

// middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// route to HTML files. We will use a GET method to read and retrieve the data we need.
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
  });

// GET method to retieve the data from the API. 
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, './db/db.json'), (err,data) => {
    if (err) throw err
    let allNotes = JSON.parse(data);
    res.json(allNotes);
    });
});
// POST method to the api to add data.
app.post('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, './db/db.json'), (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        const newNote = req.body;
        newNote.id = notes.length + 1;

        notes.push(newNote);

        fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(notes), (err) => {
          if (err) throw err;
          res.json(newNote);  
        });
    });
});

// *BONUS* this route can be used to DELETE a previous entry
app.delete('/api/notes/:id', (req, res) => {
    const noteId = parseInt(req.params.id);

    fs.readFile(path.join(__dirname, './db/db.json'), (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        notes = notes.filter((note) => note.id !== noteId);
    
        fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(notes), (err) => {
          if (err) throw err;
          res.sendStatus(204);
        });
    });
});

// server initializer
app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
});