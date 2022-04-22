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

    for (link of startLinks) {
        queue.push(link);
        visited[link] = true;
    }

    while (queue.length > 0) {
        const link = queue.shift();
        if (checkLink(link, searchTerm)) {
            console.log("JESH!");
            return "FOUND IT";
        }
        else {
            visited[link] = true;
        }
        console.log(`Current node: ${link}`);
        const newLinks = await apiSearch.getLinksFromTitle(link);
        console.log(`${process.pid}: Queue length: ${queue.length}`);
        for (let newLink of newLinks) {
            // Check if we found it
            if (checkLink(newLink, searchTerm)) {
                console.log("JESH!");
                process.send({ final: newLink });
                return "FOUND IT";
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