/*const express = require('express');
const bodyParser = require('body-parser');

const {
  dialogflow,
  actionssdk, } = require('actions-on-google');

const app = dialogflow({
  debug: true
});

const optionsNeedA = new Set();
optionsNeedA.add('horse').add('phone');

app.intent('actions.intent.MAIN', conv => {
  conv.ask('Hi, how is it going MAIN camp?')
});

app.intent('actions.intent.TEXT', (conv, input) => {
  if (input === 'bye' || input === 'goodbye') {
    return conv.close('See you later!')
  }
  conv.ask(`I didn't understand. Can you tell me something else?`)
})

app.intent('actions.intent.greeting', conv => {
  conv.ask('A wondrous greeting, adventurer! Welcome back to the mythical land of Gryffinberg!');
})

app.intent('unavailable_options', conv => {
  conv.ask('That wont help');
});


app.fallback((conv) => {
  conv.ask(`I couldn't understand. Can you say that again?`);
});

const expressApp = express().use(bodyParser.json());
expressApp.use(express.static("public"));
// serve the index.html file when visiting the homepage
expressApp.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

expressApp.post('/fulfillment', app);
expressApp.get('/health', async function (req, res) { res.send({ "status": "working", "localtime": new Date() }); });
const port = process.env.PORT ? process.env.PORT : 3000;

module.exports = {
  'expressApp': expressApp
}

// start the server on the given port
expressApp.listen(port, () => console.log(`server listening on port ${port}`));
*/

// import the express package
const express = require("express");

// initalise the server app
const app = express();
const bodyParser = require('body-parser');
// serve automatically all files in the './public' folder
app.use(express.static("public"));
app.use(bodyParser.json({ strict: false }));

// serve the index.html file when visiting the homepage
app.get("/", function  (request, response) {
    response.sendFile(__dirname + "/index.html");
});

app.get('/health', async function (req, res) { res.send({ "status": "working", "localtime": new Date() }); });

app.get('/rest/', function (req, res) {
    let json = { 'name': 'jesus', 'age': 32 }
    res.send(json);
});

const list = [
    { name: "Bach Chaconne", date: "2021-03-05" }
];

app.get('/playlist/', function (req, res) {
    res.send(list);
});

app.post('/playlist/', function (req, res) {
    let element = req.body;
    list.push(element)
    res.send(list);
});

// port to listen on
//const port = 3000;//local run
const port = process.env.PORT ? process.env.PORT : 3000;

// start the server on the given port
app.listen(port, () => console.log(`server listening on port ${port}`));