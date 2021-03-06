/*
    Author: Vili Huusko
    Last modified: 22.04.2022
    Source(s): https://en.wikipedia.org/wiki/Breadth-first_search
*/

const apiSearch = require('./api-fetch.js');

async function searchPath(startLinks, searchTerm) {
    // Links that need to be visited
    let queue = []
    // Data structure to keep track of links that are already visited:
    let visited = []

    if (startLinks instanceof Array) {
        for (link of startLinks) {
            queue.push(link);
            visited[link] = true;
        }
    }
    else {
        queue.push(startLinks);
        visited[startLinks] = true;
    }

    while (queue.length > 0) {
        const link = queue.shift();
        //console.log(`Current node: ${link}`);
        const newLinks = await apiSearch.getLinksFromTitle(link);
        //console.log(`${process.pid}: Queue length: ${queue.length}`);
        for (let newLink of newLinks) {
            // Check if we found it
            if (checkLink(newLink, searchTerm)) {
                console.log("Found it");
                process.send({ success: true, final: link });
                return;
            }
            else if (!visited[newLink]) {
                visited[newLink] = true;
                queue.push(newLink);
            }
        }
    }
}

const checkLink = (current, target) => {
    return (current.toLowerCase() === target.toLowerCase());
}

exports.searchPath = searchPath;