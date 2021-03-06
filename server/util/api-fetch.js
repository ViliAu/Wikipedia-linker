/*
    Author: Vili Huusko
    Last modified: 22.04.2022
*/

const fetch = require('node-fetch');

const wikiAPI = "http://en.wikipedia.org/w/api.php";
const params = "?origin=*&action=query&format=json&prop=links&pllimit=max&titles="
const headers = {
    "User-Agent": "Distributed systems project agent ver. 1.0"
}

const getLinksFromTitle = async (title) => {
    // Construct the URL
    let url = new URL(wikiAPI + params + title);
    let results = []
    // Fetch data from wikipedia api
    let data = await queryWikipedia(url);
    if (data) {
        let pages = data.query.pages;
        // Go through the data
        if (pages) {
            results = results.concat(parseTitlesFromData(pages));
            // If we didn't get all the data, continue the search.
                while (data.continue) {
                    // Edit the url
                    url += "&plcontinue=" + data["continue"]["plcontinue"];
                    // Get additional data
                    data = await queryWikipedia(url);
                    if (data) {
                        pages = data.query.pages;
                        if (pages) {
                            results = results.concat(parseTitlesFromData(pages));
                        }
                    }
                    else {
                        break;
                    }
                }
        }
    }
    //console.log(`RESULTS LENGTH: ${results.length}`);
    return results;
}

// Parse the titles from the data
const parseTitlesFromData = (pages) => {
    let results = []
    const pageLinks = Object.values(pages)[0].links;
    if (pageLinks instanceof Array) {
        for (let link of pageLinks) {
            //const link = pageLinks[key];
            // Filter out bad links
            if (link.ns == 0) {
                results.push(link.title);
            }
        }
    }
    return results;
}

// Fetch data from the API
const queryWikipedia = async (url) => {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: headers,
        });
        if (response.ok) {
            return await response.json();
        }
        else {
            return null;
        }
    }
    catch (e) {
        console.log("Couldn't fetch wikipedia data from " + url);
        return null;
    }
}

exports.getLinksFromTitle = getLinksFromTitle;