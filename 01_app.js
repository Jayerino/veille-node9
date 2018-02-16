const express = require('express')
const app = express()
const fs = require('fs')
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
  res.render('gabarit.ejs')  
})

app.get('/adresses', (req, res) => {
	let cursor = db.collection('adresse').find().toArray(function(err, resultat) {
 	if (err) return console.log(err)
 	console.log(JSON.stringify(resultat))
 	// transfert du contenu vers la vue index.ejs (renders)
 	// affiche le contenu de la BD          
 	res.render('gabaritAdresses.ejs', {adresses: resultat})  
  })
})

app.post('/ajouter', (req, res) => {
	db.collection('adresse').save(req.body, (err, result) => {
 		if (err) return console.log(err)
 		console.log('sauvegarder dans la BD')
 		res.redirect('/')
 	})
})


/*----------------------Connexion à MongoDB et au serveur Node.js-----------------------*/
let db // variable qui contiendra le lien sur la BD
MongoClient.connect('mongodb://127.0.0.1:27017/carnet_adresse', (err, database) => {
	if (err) return console.log(err)
	db = database.db('carnet_adresse2')
	// lancement du serveur Express sur le port 8081
	app.listen(8081, () => {
	 	console.log('connexion à la BD et on écoute sur le port 8081')
	})
})