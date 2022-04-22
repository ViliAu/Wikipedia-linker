/*
    Author: Vili Huusko
    Last modified: 22.04.2022
    Source(s): https://en.wikipedia.org/wiki/Breadth-first_search
*/

const apiSearch = require('./api-fetch.js');

// Wrapper function to get the first links
async function startSearch(from, to) {
    const links = await apiSearch.getLinksFromTitle(from);
    return searchPath(links, to);
}

async function searchPath(link, searchTerm) {
    // Links that need to be visited
    let queue = []

    // Data structure to keep track of links that are already visited:
    let visited = []

    // Add all the links to queue
    //for(link in links) {
        queue.push(link);
        visited[link] = true;
    //}

    while(queue.length > 0) {
        const link = queue.shift();
        console.log(`Current node: ${link}`);
        const newLinks = await apiSearch.getLinksFromTitle(link);
        console.log(`Queue length: ${queue.length}`);
        for(let newLink in newLinks) {
            // Check if we found it
            if (newLink.toLowerCase() === searchTerm.toLowerCase()) {
                console.log("JESH!");
                return "FOUND IT";
            }
            else if (!visited[newLink]) {
                visited[newLink] = true;
                queue.push(newLink);
            }
        }
    }
}

exports.searchPath = searchPath;