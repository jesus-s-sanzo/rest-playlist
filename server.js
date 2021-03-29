const express = require('express');
const bodyParser = require('body-parser');

const { conversation } = require('@assistant/conversation');
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const app = conversation({ debug: true });

app.handle('greeting', conv => {
  console.log('greeting called');
  let message = 'A wondrous greeting, adventurer! Welcome back to the mythical land of Gryffinberg!';
  if (!conv.user.lastSeenTime) {
    message = 'Welcome to the mythical land of  Gryffinberg! Based on your clothes, you are not from around these lands. It looks like you\'re on your way to an epic journey.';
  }
  conv.add(message);
});


const expressApp = express().use(bodyParser.json());
expressApp.use(express.static("public"));
// serve the index.html file when visiting the homepage
expressApp.get("/", function (request, response) {  response.sendFile(__dirname + "/index.html");});
expressApp.get('/health', async function (req, res) { res.send({ "status": "working", "localtime": new Date() }); });

expressApp.post('/', app);
const port = process.env.PORT ? process.env.PORT : 3000;

module.exports = { 'expressApp': expressApp }

// start the server on the given port
expressApp.listen(port, () => console.log(`server listening on port ${port}`));

module.exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);
/*
const optionsNeedA = new Set();
optionsNeedA.add('horse').add('phone');

app.intent('actions.intent.MAIN', conv => { conv.ask('Hi, how is it going MAIN camp?') });

app.intent('actions.intent.TEXT', (conv, input) => {
  if (input === 'bye' || input === 'goodbye') { return conv.close('See you later!') }
  conv.ask(`I didn't understand. Can you tell me something else?`)
});

app.intent('actions.intent.greeting', conv => { conv.ask('A wondrous greeting, adventurer! Welcome back to the mythical land of Gryffinberg!'); })
app.intent('unavailable_options', conv => { conv.ask('That wont help'); });

app.intent('Welcome', (conv) => { console.log('welcome'); conv.ask('Welcome!'); });
app.intent('greeting', (conv) => { console.log('greetng called'); conv.ask('geeting!'); });
*/
