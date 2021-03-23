const express = require('express');
const bodyParser = require('body-parser');

const { actionssdk } = require('actions-on-google');
const app = actionssdk();

const optionsNeedA = new Set();
optionsNeedA.add('horse').add('phone');

app.handle('greeting', conv => {
  let message = 'A wondrous greeting, adventurer! Welcome back to the mythical land of Gryffinberg!';
  /*if (!conv.user.lastSeenTime) {
    message = 'Welcome to the mythical land of  Gryffinberg! Based on your clothes, you are not from around these lands. It looks like you\'re on your way to an epic journey.';
  }*/
  conv.add(message);
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
