const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('../db.db');

const app = express();

app.use(express.static(__dirname + '/public'));
app.set('view engine','ejs'); 
app.engine('ejs', require('ejs').__express);

app.get('/', (req, res) => {
    db.all('SELECT * FROM ingredients', (err, ingredient) => {
        if(err){
            return console.error(err.message);
        }

        db.all('SELECT * FROM recette', (err, recette) => {
          	if(err){
              	return console.error(err.message);
          	}
          	res.render('index', {recettes : recette, ingredients: ingredient});
      	});
        
    });

    
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});