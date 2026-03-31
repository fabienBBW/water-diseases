function getColor(value) {
    if(value != null) {
        const max = 116.9;
        const intensity = value / max;
        return `rgba(255, 0, 0, ${intensity})`;
    }
    return `rgba(255, 255, 255, 1.0)`;
}

function addLayer(geojson, mortalityData) {
  L.geoJson(geojson, {
    style: (feature) => {
        const iso3 = feature.properties["ISO3166-1-Alpha-3"];
        const value = mortalityData[iso3];

        return {
            fillColor: getColor(value),
            weight: 1,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.7
        };
    },
    onEachFeature: function (feature, layer) {
      const iso3 = feature.properties["ISO3166-1-Alpha-3"];
      const value = mortalityData[iso3];

      layer.bindPopup(`
        <strong>${feature.properties.name}</strong><br>
        Mortality rate attributed to exposure to unsafe WASH services (per 100 000 population) (SDG 3.9.2): ${value ?? 'No data'}
      `);
    }
  }).addTo(window.currentMap);
}

// process CSV data.
function processData(data, geojson) {
    const mortalityData = {};

    data.forEach(d => {
        mortalityData[d.SpatialDimValueCode] = d.Value;
    })

    console.log(mortalityData);
    console.log(mortalityData.length);
    addLayer(geojson, mortalityData);
}

export function parseCSV(csv_file_path, geojson) {
    Papa.parse(csv_file_path, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            const data = results.data;
            processData(data, geojson);
        }
    });
}