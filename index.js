const express = require('express')
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const parser = bodyParser.urlencoded({ extended: false })

const port = 3000;

app.get('/notes', (req, res) => {
	res.sendFile(path.join(__dirname + '/public/notes.html'));
})

app.get('/api/notes', (req, res) => {
	const notes = JSON.parse(fs.readFileSync('db/db.json', 'utf8'));
	res.send(notes);
})

app.post('/api/notes', parser, (req, res) => {
	console.log("posted");
	const notes = JSON.parse(fs.readFileSync('db/db.json', 'utf8'));
	if (req.body.title) {
		const randomGeneratedID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		const newNote = {
			id: randomGeneratedID,
			title:req.body.title,
			text: req.body.text
		}
		notes.push(newNote);
		try {
			fs.writeFileSync('db/db.json', JSON.stringify(notes, null, 2));
		} catch (err) {
			console.error(err)
		}
		res.send(newNote)
	
	}
	else if (req.body.id) {
	  let id = req.body.id;
	  const notes = JSON.parse(fs.readFileSync('db/db.json', 'utf8'));

	  for (let i = notes.length -1; i >= 0 ; i--) {
	  	if (notes[i].id === id) {
	  		notes.splice(i, 1)
	  	}
	  }
	  try {
		fs.writeFileSync('db/db.json', JSON.stringify(notes, null, 2));
	} catch (err) {
		console.error(err)
	}
		res.send(notes);
	}
	res.send(notes);
})

app.get('/assets/js/index.js', (req, res) => {
	res.sendFile(path.join(__dirname + '/public/assets/js/index.js'));
})

app.get('/assets/css/styles.css', (req, res) => {
	res.sendFile(path.join(__dirname + '/public/assets/css/styles.css'));
})

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/public/index.html'));
})




app.listen(port, () => console.log(`App listening at http://localhost:${port}`))