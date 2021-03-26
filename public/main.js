/* this javascript file is referenced in the index.html and will be sent to the client. This code is not executed server-side */

const endpoint = './fulfillment';

const getHealth = async () => {
    const response = await fetch('./health');
    let myJson = await response.json(); //extract JSON from the http response
    // do something with myJson
    document.getElementById("health").innerHTML = JSON.stringify(myJson);
}

getHealth();

const headers = {
    'Content-Type': 'application/json'
};
