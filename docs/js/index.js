import {parseCSV} from "./data-process.js";

// Initialize leaflet
window.currentMap = L.map("map").setView([20, 0], 3);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(window.currentMap);

// Load GeoJSON to display countries as shapes.
// fetch geojson data file.
fetch("../json-data/countries.geojson")
    .then(res => res.json()) // convert to JSON
    .then(data => { // add to leaflet.
        L.geoJSON(data, {
            style: {
                color: "#333",   // border color (optional)
                weight: 1,          // border thickness
                fillColor: "transparent",
                fillOpacity: 0
            }
        }).addTo(window.currentMap);
        parseCSV("../csv-disease-data/data.csv", data);
    });

