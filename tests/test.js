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
        },
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
function testUnabailableOpcion(done) {
    request.post('/').send(unabailableOptionsRequest).expect(200).end(function (err, result) {
        let body = result.body;
        assert.equal(result.body.prompt.firstSimple.speech,
            'I have seen the future and a steed will not aid you on your journey.', 'wrong response');
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
    // it('Test health', testHealth);
    it('testGreeting', testGreeting);
    it('testUnabailableOpcion', testUnabailableOpcion);
}
