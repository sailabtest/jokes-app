const express = require('express');
const app     = express();
const bodyParser    = require('body-parser');
require('dotenv').config();

const cors			= require('cors'); 
const Lib       = require('./lib').Lib;
const port      = process.env.PORT;
//this reduces the repeated function for the router
const RH 	      = new Lib.RouterHelper();
const Jokes 	  = new Lib.Jokes();

//middleware should check if database setup completed before using anything else
// app.use((req, res, next) => {    
//   //RH.isSetupCompleted(req, res, next);   
// });

// Middleware setup
// Development mode only - In live the cors access should be removed
app.use(cors({ origin: '*'}));

app.use(bodyParser.json( {limit: '30mb', extended: true} ));				 // parse application/json configuration

//On load show all jokes - assumed for low database size used without LIMIT 
app.get('/api/', async (req, res) => {
  let list = await Jokes.getAllJokes();
  //console.log("jokes are: ", list);
  res.json(Lib.makeResponse(true, 'List of jokes', list));
});

//update specific joke details
app.post('/api/update_joke', async (req, res) => {
  console.log("Update joke");
  let data = RH.isValidPost(req);
  if(!data){
    res.json(Lib.makeResponse(false, 'Invalid order', false));
    return;
  } 
  //console.log("data is: ", data);  
  if(!data.jokeName){
    return res.json(Lib.makeResponse(false, 'Please type in joke with valid length no longer than 500 chars!', false));
  }else if(data.jokeType && data.jokeType.length > 25){
    return res.json(Lib.makeResponse(false, "The length of Joke type can't be longer than 25 chars", false));
  }

  //save data
  Jokes.updateJoke(data, data.jokeID).then((msg) => {
    //console.info("looks ok: ", msg);
    res.json(Lib.makeResponse(true, "Joke updated.", msg));

  }).catch((e) => {
    let msg = JSON.stringify(e);
    console.log("error is: ", msg);
    res.json(Lib.makeResponse(false, "Problem updating joke: "+msg, false));
  });
  
  
});

//add new joke
app.post('/api/add_joke', (req, res) => {
  console.log("Adding joke");
  let query = req.body;  
  if(!query || !query.data){
    console.log("invalid request: ", query); 
    res.json(Lib.makeResponse(false, 'Invalid request', false));
    return;
  }    
  //backend data validation
  let data = query.data;
  //console.log("query is: ", query);  
  if(!data.JokeName){
    return res.json(Lib.makeResponse(false, 'Please type in joke with valid length no longer than 500 chars!', false));
  }else if(data.JokeType && data.JokeType.length > 25){
    return res.json(Lib.makeResponse(false, "The length of Joke type can't be longer than 25 chars", false));
  }

  //save data
  Jokes.addJoke(data.JokeName, data.JokeType).then((msg) => {
    //console.info("looks ok: ", msg);
    res.json(Lib.makeResponse(true, "Joke saved.", msg));

  }).catch((e) => {
    let msg = JSON.stringify(e);
    console.log("error is: ", msg);
    res.json(Lib.makeResponse(false, "Problem adding joke: "+msg, false));
  });
});

//delete a joke
app.post('/api/remove_joke', (req, res) => {
  console.log("Remove joke");
  let data = RH.isValidPost(req);
  if(!data){
    res.json(Lib.makeResponse(false, 'Invalid joke request', false));
    return;
  } 
  //console.log("data is: ", data);  
  if(!data.jokeID){
    return res.json(Lib.makeResponse(false, 'Joke ID is missing!', false));
  }
  
  //delete row
  Jokes.removeJoke(data.jokeID).then((msg) => {
    //console.info("looks ok: ", msg);
    res.json(Lib.makeResponse(true, "Joke removed.", msg));

  }).catch((e) => {
    let msg = JSON.stringify(e);
    console.log("error removing joke: ", msg);
    res.json(Lib.makeResponse(false, "Problem removing joke: "+msg, false));
  });

});

//delete a joke
app.post('/api/search', (req, res) => {
  console.log("search jokes");
  let data = RH.isValidPost(req);
  if(!data){
    res.json(Lib.makeResponse(false, 'Invalid joke request', false));
    return;
  } 
  //console.log("data is: ", data);  
  if(!data.value){
    return res.json(Lib.makeResponse(false, 'Joke name missing!', false));
  }
  let jokeName = data.value;
  
  //delete row
  Jokes.searchJokes(jokeName).then((msg) => {
    //console.info("looks ok: ", msg);
    res.json(Lib.makeResponse(true, "Jokes found: ", msg));

  }).catch((e) => {
    let msg = JSON.stringify(e);
    console.log("error in jokes: ", msg);
    res.json(Lib.makeResponse(false, "Problem finding jokes: "+msg, false));
  });

});



app.listen(port, function () {
  console.log('Example app listening on port >> ', port);
});
