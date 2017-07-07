const optimist = require('optimist');
const winston = require('winston');

// Setup the usage for the following server:
const usage = optimist
    .usage('API lessons\nUsage: $0')
    .wrap(80)
    .default('p', 8080)
    .alias('p', ['port'])
    .describe('p', 'API port number for the listening server')
    .default('debug', true)
    .describe('debug', 'Debug mode to enable more logging');
const argv = usage.argv;

// Make sure we have a valid port number before we get too far.
if (Number.isNaN(parseInt(argv.port, 10))) {
    console.error('Invalid port number:', argv.port, '\n');
    usage.showHelp();
    return
}

// If we're in debug mode.
if (argv.debug) {
    winston.level = 'debug';
}

// Set up the server
const express = require('express');
const app = express();

// GET /lessons
// Retrieve a list of all lessons with routes omitted
app.get('/lessons', (req, res) => {
    res.status(404);
    res.send('not found');
});

// GET /lessons/:status
// Retrieve a list of lessons with a specific status
app.get('lessons/:status', (req, res) => {
    res.status(404);
    res.send('not found');
});

// GET /lesson/:id
// Retrieve a specific lesson with the route present if available. Also provide
// some additional statics about the lesson for example (Distance driven,
// Time till/since lesson)
app.get('lesson/:id', (req, res) => {
    res.status(404);
    res.send('not found');
});

app.listen(argv.port);
winston.log('debug', 'lesson API listening on port', argv.port);

module.exports = app;
