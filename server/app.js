/*  Author: Vili Huusko
    Last edited: 17.04.2022
    Source(s): https://nodejs.org/api/cluster.html */

const express = require('express');
const cluster = require('cluster');
const cpus = require('os').cpus();
const wiki = require('./util/wikipedia-search.js');
const PORT = process.env.port | 3000;

/* Start the main thread */
const startMain = () => {
    console.log("Starting main thread...");
    // Start workers and listen for messages containing notifyRequest
    const numCPUs = cpus.length;
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
}

const startWorker = () => {
    const app = express();

    app.get('/search', async (req, res) => {
        const { from, to } = req.query;
        console.log(`${process.pid}: from: ${from}, to: ${to}`);
        const result = await wiki.searchPath(from, to);
        res.json({msg: "ok"});
    });

    app.listen(PORT, console.log(`Listening on port ${PORT}`))
}

// Check if running main thread or not
if (cluster.isPrimary) {
    startMain();
}
else {
    startWorker();
}