/*  Author: Vili Huusko
    Last edited: 14.04.2022 */

const express = require('express');
const cluster = require('cluster');
const cpus = require('os').cpus();
const port = 3000;

// Check if running main thread or not

if (cluster.isPrimary) {
    startMain();
}

const startMain = () => {
    console.log("Starting main thread...");
    // Start workers
    for (let i = 0; i < cpus.length; i++) {
        startWorker();
    }
}

const startWorker = () => {
    cluster.fork();
}