const { conversation } = require('@assistant/conversation');
const functions = require('firebase-functions');

const app = conversation({debug: true});
const optionsNeedA = new Set();
optionsNeedA.add('horse').add('phone');

app.handle('greeting', conv => {
 let message = 'A wondrous greeting, adventurer! Welcome back to the mythical land of Gryffinberg!';
 if (!conv.user.lastSeenTime) {
   message = 'Welcome to the mythical land of  Gryffinberg! Based on your clothes, you are not from around these lands. It looks like you\'re on your way to an epic journey.';
 }
 conv.add(message);
});

app.handle('unavailable_options', conv => {
  const option = conv.intent.params.chosenUnavailableOption.original;
  const optionKey = conv.intent.params.chosenUnavailableOption.resolved;
  let message = 'I have seen the future and ';
  if(optionsNeedA.has(optionKey)){
    message = message + 'a ';
  }
  message = message + `${option} will not aid you on your journey. `;
  conv.add(message);
});

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);