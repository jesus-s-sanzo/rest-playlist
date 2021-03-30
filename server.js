const express = require('express');
const bodyParser = require('body-parser');

const { conversation } = require('@assistant/conversation');

const app = conversation({ debug: true });

app.handle('greeting', conv => {
  console.log('greeting called');
  let message = 'A wondrous greeting, adventurer! Welcome back to the mythical land of Gryffinberg!';
  if (!conv.user.lastSeenTime) {
    message = 'Welcome to the mythical land of  Gryffinberg! Based on your clothes, you are not from around these lands. It looks like you\'re on your way to an epic journey.';
  }
  conv.add(message);
});

const optionsNeedA = new Set();
optionsNeedA.add('horse').add('phone');

app.handle('unavailable_options', conv => {
  console.log('unavailable_options called');
  const option = conv.intent.params.chosenUnavailableOption.original;
  const optionKey = conv.intent.params.chosenUnavailableOption.resolved;
  let message = `I have seen the future and ${optionsNeedA.has(optionKey) ? 'a ' : ''}${option} will not aid you on your journey.`;
  conv.add(message);
});

app.handle('list_subjects', conv => {
  message = 'This is the webhook list.';
  conv.add(message);
});

app.handle('suggestion', conv => {
  message = 'This is the webhook suggestion.';
  conv.add(message);
});

app.handle('mark_studied', conv => {
  const subject = conv.session.params.chosenSubject
  message = `${subject} has been marked as studied in the webhook`
  conv.add(message);
});
app.handle('new_subject', conv => {
  const subject = conv.session.params.chosenSubject
  message = `${subject} has been added in the webhook`
  conv.add(message);
});
app.handle('remove_subject', conv => {
  const subject = conv.session.params.chosenSubject
  message = `${subject} has been removed in the webhook`
  conv.add(message);
});

const expressApp = express().use(bodyParser.json());
expressApp.use(express.static("public"));
// serve the index.html file when visiting the homepage
expressApp.get("/", function (request, response) { response.sendFile(__dirname + "/index.html"); });
expressApp.get('/health', async function (req, res) { res.send({ "status": "working", "localtime": new Date() }); });

expressApp.post('/', app);
const port = process.env.PORT ? process.env.PORT : 3000;

module.exports = { 'expressApp': expressApp }

// start the server on the given port
expressApp.listen(port, () => console.log(`server listening on port ${port}`));
