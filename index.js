const express = require('express');
const bodyParser = require('body-parser');

const { actionssdk } = require('actions-on-google');
const app = actionssdk();

const optionsNeedA = new Set();
optionsNeedA.add('horse').add('phone');

app.intent('actions.intent.MAIN', conv => {
  conv.ask('Hi, how is it going MAIN camp?')
});

app.intent('actions.intent.greeting', conv => {
  conv.ask('A wondrous greeting, adventurer! Welcome back to the mythical land of Gryffinberg!');
})

app.handle('unavailable_options', conv => {
  conv.ask('That wont help');
});

const expressApp = express().use(bodyParser.json());

expressApp.post('/fulfillment', app);

expressApp.listen(3000);
