const express = require('express')
const app = express()
const fs = require('fs')
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID;
const peupler = require("./public/data/Peupler")
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

/*-----------------Detruire---------------*/
app.get('/detruire/:_id', (req, res) => {


	let _id = req.params._id

	db.collection('adresse').findOneAndDelete({_id: ObjectID(_id)}, (err, resultat) => {
		if (err) return console.log(err)
		res.redirect('/adresses')
	})
})

/*-----------------formulaire---------------*/
app.get('/formulaire', (req, res) => {
	res.render('gabaritAjouter.ejs')
})

/*-----------------ajouter---------------*/
app.post('/ajouter', (req, res) => {
	db.collection('adresse').save(req.body, (err, result) => {
 		if (err) return console.log(err)
 		console.log('sauvegarder dans la BD')
 		res.redirect('/adresses')
 	})
})

/*-------------Modifier-------------*/
app.post('/modifier', (req, res) => {
	req.body._id = ObjectID(req.body._id)

	//if ()

 	db.collection('adresse').save(req.body, (err, result) => { 
 		if (err) return console.log(err) 
 		console.log('sauvegarder dans la BD') 
 		res.redirect('/adresses') 
 	})
})

/*-----------------trier---------------*/
app.get('/trier/:clef/:ordre', (req, res) => {
let clef = req.params.clef
 	let ordre = (req.params.ordre == 'asc' ? 1 : -1)
	let cursor = db.collection('adresse').find().sort(clef,ordre).toArray(function(err, resultat){
		ordre = (req.params.ordre == 'asc' ? 'des' : 'asc')
		res.render('gabaritAdresses.ejs', {adresses: resultat, clef, ordre})
	})
})


app.get('/peupler', (req, res) => {

	let resultat = peupler();

	db.collection("adresse").insert(resultat, (err, result) => {
		if (err) return console.log(err)
		res.redirect("/adresses")
	})
})


/*----------------------Connexion à MongoDB et au serveur Node.js-----------------------*/
let db // variable qui contiendra le lien sur la BD
MongoClient.connect('mongodb://127.0.0.1:27017/carnet_adresse', (err, database) => {
	if (err) return console.log(err)
	db = database.db('carnet_adresse')
	// lancement du serveur Express sur le port 8081
	app.listen(8081, () => {
	 	console.log('connexion à la BD et on écoute sur le port 8081')
	})
})