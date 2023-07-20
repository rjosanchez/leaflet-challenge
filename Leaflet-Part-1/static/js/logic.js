// Create the map object
let myMap = L.map("map", {
    center: [37, -95],
    zoom: 3
  });

// Add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Define the url for the GeoJSON earthquake data
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

// Retrieve the GeoJSON data
d3.json(url).then(function(response) {

    // console.log(response);
    features = response.features;
    
    // set a function for color based on depth
    function getColor(depth){
        return depth >= 90 ? "#ff0000" :
            depth < 90 && depth >= 70 ? "#ff8000" :
            depth < 70 && depth >= 50 ? "#ffbf00" :
            depth < 50 && depth >= 30 ? "#ffff00" :
            depth < 30 && depth >= 10 ? "#bfff00" :
            depth < 10 ? "#40ff00" :
                "white";
    }

    // set a function for the radius based on magnitude
    function getRadius(magnitude){
        if (magnitude === 0)
            return 1
            
        return magnitude * 3
        
    }

    // Add earthquake data to the  map
    L.geoJson(response,{
        pointToLayer: function(feature,latlng){
            return L.circleMarker(latlng, {
                color: getColor(feature.geometry.coordinates[2]), 
                fillColor: getColor(feature.geometry.coordinates[2]),
                fillOpacity: .5,
                weight: .5,
                radius: getRadius(feature.properties.mag),
            })
        }, 
        // add a popup with more info
        onEachFeature: function(feature,layer){
            layer.bindPopup(
                "magnitude: " + feature.properties.mag
                + "<br> depth: " + feature.geometry.coordinates[2]
                + "<br> location: " + feature.properties.place
            )
        }
    }).addTo(myMap)

    // Set up the legend
    let legend = L.control({position: "bottomright" });
    legend.onAdd = function() {
        let panel = L.DomUtil.create("div", "info legend");
        depth = [-10, 10, 30, 50, 70, 90];

        for (var i = 0; i < depth.length; i++) {
            panel.innerHTML +=
                '<i style="background:' + getColor(depth[i] + 1) 
                + '"></i> ' + depth[i] 
                + (depth[i + 1] ? '&ndash;' 
                + depth[i + 1] + '<br>' : '+');
        }
        return panel;
    }
    legend.addTo(myMap);
  });