const express = require('express');
const bodyParser = require('body-parser');

const { conversation } = require('@assistant/conversation');

const app = conversation({ debug: false });

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

const subjects = require('./subjects');

let initialList =
  [
    { name: 'Bachs sonata 1', date: new Date('2021-03-29') },
    { name: 'wieniawski concerto', date: new Date('2021-03-28') },
    { name: 'Basque caprice', date: new Date('2021-03-27') }
  ];

subjects.init(initialList);

app.handle('list_subjects', conv => {
  let message = subjects.toString();
  conv.add(message+'.');
});

app.handle('suggestion', conv => {
  let message = subjects.suggest();
  conv.add(message+'.');
});

app.handle('mark_studied', conv => {
  const subjectName = conv.session.params.chosenSubject;
  let isPresent =subjects.remove(subjectName);
  subjects.add(subjectName);
  let message = `${subjectName} has been ${isPresent?'added and ':''}marked as studied in your records`;
  conv.add(message+'.');
});

app.handle('new_subject', conv => {
  const subjectName = conv.session.params.chosenSubject;
  let isPresent =subjects.remove(subjectName);
  subjects.add(subjectName);
  let message = `${subjectName} ${isPresent?'was already in your recoreds, it has been':'has been added to your records and'} marked as studied`;
  conv.add(message+'.');
});

app.handle('remove_subject', conv => {
  const subjectName = conv.session.params.chosenSubject;
  let isPresent = subjects.remove(subjectName);
  subjects.remove(subjectName);
  let message = `${subjectName} ${isPresent ? 'has been removed from' : 'was not present in'} your records`;
  conv.add(message+'.');
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
