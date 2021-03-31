'use strict';
const supertest = require('supertest');
const expressApp = require('../server.js').expressApp;
const assert = require('unit.js/src/assert');
const request = supertest(expressApp);
describe('Tests app', function () { runTests(); });

const greetingRequest = {
    "handler": {
        "name": "greeting"
    },
    "intent": {
        "name": "actions.intent.MAIN",
        "params": {},
        "query": "Talk to my test app"
    },
    "scene": {
        "name": "actions.scene.START_CONVERSATION",
        "slotFillingStatus": "UNSPECIFIED",
        "slots": {},
        "next": {
            "name": "start"
        }
    },
    "session": {
        "id": "ABwppHH5O7mWti2NMExOkfZVz0S4yCTzTpl45ppK1P8BJaLW7EKq-JxUfZCjFt6rG6wu2L8gVzxkqdl8KC4382WTdmY",
        "params": {},
        "typeOverrides": [],
        "languageCode": ""
    },
    "user": {
        "locale": "en-US",
        "params": {},
        "accountLinkingStatus": "ACCOUNT_LINKING_STATUS_UNSPECIFIED",
        "verificationStatus": "VERIFIED",
        "packageEntitlements": [],
        "gaiamint": "",
        "permissions": [],
        "lastSeenTime": "2021-03-23T01:18:21Z"
    },
    "home": {
        "params": {}
    },
    "device": {
        "capabilities": [
            "SPEECH",
            "RICH_RESPONSE",
            "LONG_FORM_AUDIO"
        ]
    }
};

function testGreeting(done) {
    request.post('/').send(greetingRequest).expect(200).end(function (err, result) {
        let body = result.body;
        assert.equal(result.body.prompt.firstSimple.speech,
            'A wondrous greeting, adventurer! Welcome back to the mythical land of Gryffinberg!');
        done(err);
    });
}

const unabailableOptionsRequest = {
    "handler": {
        "name": "unavailable_options"
    },
    "intent": {
        "name": "actions.intent.MAIN",
        "params": {
            "chosenUnavailableOption": {
                "original": "steed",
                "resolved": "horse"
            }
        }
    }
};
function testUnabailableOpcion(done) {
    request.post('/').send(unabailableOptionsRequest).expect(200).end(function (err, result) {
        let body = result.body;
        assert.equal(result.body.prompt.firstSimple.speech,
            'I have seen the future and a steed will not aid you on your journey.', 'wrong response');
        done(err);
    });
}

const listSubjectsRequest = {
    "handler": {
        "name": "list_subjects"
    }
};

function testListSubjects(done) {
    request.post('/').send(listSubjectsRequest).expect(200).end(function (err, result) {
        assert(result.body.prompt && result.body.prompt.firstSimple && result.body.prompt.firstSimple.speech, "result.body.prompt.firstSimple.speech not present");
        let speech = result.body.prompt.firstSimple.speech;
        assert(speech.includes('Bachs sonata 1'), 'speech should include Batchs Sonata 1');
        assert(speech.includes('wieniawski concerto'), 'speech should include wieniawski concerto');
        assert(speech.includes('Basque caprice'), 'speech should include Basque caprice');
        done(err);
    });
}

const suggestionRequest = {
    "handler": {
        "name": "suggestion"
    }
};

function testSuggestion(done) {
    request.post('/').send(suggestionRequest).expect(200).end(function (err, result) {
        assert(result.body.prompt && result.body.prompt.firstSimple && result.body.prompt.firstSimple.speech, "result.body.prompt.firstSimple.speech not present");
        let speech = result.body.prompt.firstSimple.speech;
        assert(speech.includes('Basque caprice'), 'speech should include Basque caprice');
        done(err);
    });
}

const markStudiedRequest = {
    "handler": {
        "name": "mark_studied"
    },
    "session": {
        "params": {
            "chosenSubject": "Bohemian airs"
        }
    }
};
function testMarkStudied(done) {
    request.post('/').send(markStudiedRequest).expect(200).end(function (err, result) {
        assert(result.body.prompt && result.body.prompt.firstSimple && result.body.prompt.firstSimple.speech, "result.body.prompt.firstSimple.speech not present");
        let speech = result.body.prompt.firstSimple.speech;
        assert.equal('Bohemian airs has been marked as studied in your records.', speech);
        done(err);
    });
}

const removeSubjectRequest = {
    "handler": {
        "name": "remove_subject"
    },
    "session": {
        "params": {
            "chosenSubject": "Bohemian airs"
        }
    }
};
function testRemoveSubject(done) {
    request.post('/').send(removeSubjectRequest).expect(200).end(function (err, result) {
        assert(result.body.prompt && result.body.prompt.firstSimple && result.body.prompt.firstSimple.speech, "result.body.prompt.firstSimple.speech not present");
        let speech = result.body.prompt.firstSimple.speech;
        assert.equal('Bohemian airs has been removed from your records.', speech);
        done(err);
    });
}

const newSubjectRequest = {
    "handler": {
        "name": "new_subject"
    },
    "session": {
        "params": {
            "chosenSubject": "Bohemian airs"
        }
    }
};
function testNewSubject(done) {
    request.post('/').send(newSubjectRequest).expect(200).end(function (err, result) {
        assert(result.body.prompt && result.body.prompt.firstSimple && result.body.prompt.firstSimple.speech, "result.body.prompt.firstSimple.speech not present");
        let speech = result.body.prompt.firstSimple.speech;
        assert.equal('Bohemian airs has been added to your records and marked as studied.', speech);
        done(err);
    });
}

function testHealth(done) {
    request.get('/health').expect(200).end(function (err, result) {
        assert(result.body.status == 'working');
        done(err);
    });
}

function runTests() {
    it('Test health', testHealth);
    it('test Greeting', testGreeting);
    it('test UnabailableOpcion', testUnabailableOpcion);
    it('test ListSubjects', testListSubjects);
    it('test Suggestion', testSuggestion);
    it('test MarkStudied', testMarkStudied);
    it('test RemoveSubject', testRemoveSubject);
    it('test NewSubject', testNewSubject);
}
