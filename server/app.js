/*  Author: Vili Huusko
    Last edited: 17.04.2022
    Source(s): https://nodejs.org/api/cluster.html */

const express = require('express');
const cluster = require('cluster');
const cpus = require('os').cpus();
const PORT = process.env.port | 3000;

/* Start the main thread */
const startMain = () => {
    console.log("Starting main thread...");

    // Keep track of http requests
    let numReqs = 0;
    setInterval(() => {
        console.log(`numReqs = ${numReqs}`);
    }, 1000);

    // Count requests
    function messageHandler(msg) {
        if (msg.cmd && msg.cmd === 'notifyRequest') {
            numReqs += 1;
        }
    }

    // Start workers and listen for messages containing notifyRequest
    const numCPUs = cpus.length;
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    for (const id in cluster.workers) {
        cluster.workers[id].on('message', messageHandler);
    }
}

const startWorker = () => {
    const app = express();

    app.get('/search', (req, res) => {
        const { from, to } = req.query;
        console.log(`${process.pid}: from: ${from}, to: ${to}`);
        res.json(200)({msg: "ok"});
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