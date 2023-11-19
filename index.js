import express from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Posting from "./posting.js";
import Category from "./category.js";
import {fileURLToPath} from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dotenvAbsolutePath = path.join(__dirname, 'keys.env');

dotenv.config({path: dotenvAbsolutePath});

app.use(express.urlencoded());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/")));

app.get('/', async (request, response) => {
  const categorii = await Category.find();
  let postari = {};

  for(let i = 0; i < categorii.length; ++i) {
    postari[categorii[i].titlu] = await Posting.find({categorie: categorii[i].titlu}); 
  }
  
  response.render('index', {categorii: categorii, postari: postari}); 
});

app.get('/postare/:index', async (request, response) => {
  const postare = await Posting.findById(request.params.index);

  response.render('postare', {postare: postare}); 
});

app.get('/adaugare_categorie', (request, response) => {
  response.render('adaugare_categorie'); 
});

app.post('/salveaza_categorie', async (request, response) => {
  const categorie = await Category.create({titlu: request.body.titlu});
  console.log(categorie);

  response.redirect(`/categorie/${categorie.id}`);
})

app.get('/categorie/:index', async (request, response) => {
  const categorie = await Category.findById({_id: request.params.index});
  const postari = await Posting.find({categorie: categorie.titlu});

  response.render('categorie', {categorie: categorie, postari: postari}); 
});

app.get('/editare_categorie/:index', async (request, response) => {
  const categorie = await Category.findById(request.params.index);

  response.render('editare_categorie', {categorie: categorie}); 
});

app.post('/salveaza_editare_categorie/:index', async (request, response) => {
  await Category.updateOne({ _id: request.params.index }, {
    titlu: request.body.titlu
  });
  
  response.redirect(`/categorie/${request.params.index}`);
})

app.get('/adaugare_postare', async (request, response) => {
  const categorii = await Category.find();
  response.render('adaugare_postare', {categorii: categorii});
});

app.post('/salveaza_postare', async (request, response) => {
  const postare = await Posting.create({
    titlu: request.body.titlu,
    categorie: request.body.categorie,
    creator: request.body.creator,
    data: request.body.data,
    continut: request.body.continut
  });

  console.log(postare);
  response.redirect(`/postare${postare.id}`);
})

app.get('/editare_postare/:index', async (request, response) => {
  const categorii = await Category.find();
  const postare = await Posting.findById(request.params.index);

  response.render('editare_postare', {categorii: categorii, postare: postare}); 
});

app.post('/salveaza_editare_postare/:index', async (request, response) => {
  await Posting.updateOne({ _id: request.params.index }, {
    titlu: request.body.titlu,
    categorie: request.body.categorie,
    creator: request.body.creator,
    data: request.body.data,
    continut: request.body.continut
  });
  
  response.redirect(`/postare/${request.params.index}`);
});

app.get('/sterge_postare/:index', async (request, response) => {
  await Posting.deleteOne({ _id: request.params.index });
  response.redirect('/');
});

app.get('/sterge_categorie/:index', async (request, response) => {
  await Category.deleteOne({ _id: request.params.index });
  response.redirect('/');
});

app.listen(3000, () => {
  console.log('App is listening on port 3000.');
  mongoose.connect(process.env.MONGODB)
   .then(() => {
     console.log('Connected to MongoDB');
   })
   .catch((error) => {
     console.error('Failed to connect to MongoDB:', error);
   });
});