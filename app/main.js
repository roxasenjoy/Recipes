const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('../db.db');

const app = express();

app.use(express.static(__dirname + '/public'));
app.set('view engine','ejs'); 
app.engine('ejs', require('ejs').__express);

// Gestionnaire de route pour les requêtes GET sur l'URL racine ("/")
app.get('/', async (req, res) => {

    const id = req.query.id;

    // Exécution de la requête SQL pour récupérer toutes les recettes
    // On utilise une Promesse pour gérer l'asynchronicité de la requête SQL
    let recette = await new Promise((resolve, reject) => {
        db.all('SELECT * FROM recette', (err, rows) => {
            if(err) reject(err);
            resolve(rows);
        });
    });

    let ingredients = [];

    // Si un ID a été fourni dans la requête...
    if(id !== undefined){
        // Exécute la requête SQL pour récupérer tous les ingrédients associés à cette recette
        // On utilise une Promesse pour gérer l'asynchronicité de la requête SQL
        ingredients = await new Promise((resolve, reject) => {
            db.all('SELECT ingredients.* \
                    FROM recette \
                    JOIN ingredients ON recette.id = ingredients.id_recette \
                    WHERE recette.id = ?', [id], (err, rows) => {
                if(err) reject(err);
                resolve(rows);
            });
        });

        recipe_by_id = await new Promise((resolve, reject) => {
            db.all('SELECT *\
                    FROM recette \
                    WHERE recette.id = ?', [id], (err, rows) => {
                if(err) reject(err);
                resolve(rows);
            });
        });

        instructions = await new Promise((resolve, reject) => {
            db.all('SELECT instructions.* \
                    FROM instructions \
                    JOIN recette ON recette.id = instructions.id_recette \
                    WHERE recette.id = ?', [id], (err, rows) => {
                if(err) reject(err);
                resolve(rows);
            });
        });

        // Réponse à la requête avec les ingrédients au format JSON
        res.json({ingredients: ingredients, recettes: recipe_by_id, instructions: instructions});
    }

    // Rendu de la vue 'index', en passant les recettes et les ingrédients en tant que données de contexte
    res.render('index', {recettes : recette, ingredients: ingredients});
});



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});