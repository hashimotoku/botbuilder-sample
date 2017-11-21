require('dotenv').config();

var builder = require('botbuilder');
var restify = require('restify');

// auth for connector

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// making server

var server = restify.createServer();
server.listen(process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
server.post('/api/messages', connector.listen());

// making bot

var bot = new builder.UniversalBot(connector);
bot.dialog('/', function (session) {
    const request = session.message.text;
    const response = handleRequest(request);
    session.send(response);
});

function handleRequest(request){
    if(request.startsWith('password')){
        return handlePassword(request);
    }
    else if(request.startsWith('ping')){
        return 'pong';
    }
    else {
        return request;
    }
}

const DEFAULT_LENGTH = 12;

function handlePassword(request){
    let words = request.split(' ');
    let length = DEFAULT_LENGTH;
    if(words.length == 2){
        length = Number(words[1]);
    }
    return makePassword(length);
}

const ALPHA_NUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function makePassword(length) {
    let text = "";
    for (let i = 0; i < length ; i++){
        text += ALPHA_NUM.charAt(Math.floor(Math.random() * ALPHA_NUM.length));
    }
    return text;
}
