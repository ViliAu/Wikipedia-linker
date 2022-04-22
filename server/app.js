/*  Author: Vili Huusko
    Last edited: 17.04.2022
    Source(s): https://nodejs.org/api/cluster.html */

const express = require('express');
const cluster = require('cluster');
const cpus = require('os').cpus();
const wiki = require('./util/wikipedia-search.js');
const apiFetch = require('./util/api-fetch.js');
const PORT = process.env.port | 3000;

/* Start the main thread */
const startMain = () => {
    console.log("Starting main thread...");

    const app = express()

    app.get('/search', async (req, res) => {
        const startTime = new Date();

        const { from, to } = req.query;
        console.log(`from: ${from}, to: ${to}`);

        // Get first links to share between workers
        startLinks = await apiFetch.getLinksFromTitle(from);
        console.log(startLinks);
        // Event when a worker finds the word
        const finishSearch = (message) => {
            const endTime = new Date();
            const time = (endTime-startTime)*0.001;
            console.log(time);
            res.send({ msg: "Moro", time: time})

            // Kill workers
            for (let id in cluster.workers) {
                cluster.workers[id].kill();
            }
        }

        // Start workers and listen for messages containing notifyRequest
        const numCPUs = cpus.length;
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork().on('message', finishSearch);
        }

        // Split link array to even sized chunks
        let linkChunks = []
        for (let i = numCPUs; i > 0; i--) {
            linkChunks.push(startLinks.splice(0, Math.ceil(startLinks.length / i)));
        }
        let i = 0;
        for (let w of Object.values(cluster.workers)) {
            w.send({
                title: to,
                linkList: linkChunks[i]
            });
            i++;
        }
    });

    app.listen(PORT, console.log(`Listening on port ${PORT}`))
}

const startWorker = () => {
    process.on('message', (msg) => {
        console.log(msg.linkList)
        wiki.searchPath(msg.linkList, msg.title)
    });
}

// Check if running main thread or not
if (cluster.isPrimary) {
    startMain();
}
else {
    startWorker();
}