/**
 * layer with markers
 */
function layerBounds(map, rc, img){
    // set marker at the image bound edges
    var layerBounds = L.layerGroup([
        L.marker(rc.unproject([0, 0])).bindPopup('[0,0]'),
        L.marker(rc.unproject(img)).bindPopup(JSON.stringify(img)),
        L.marker(rc.unproject(gameToMap(mappingArr, [1854, 464])), {icon: mobaoIcon}).bindPopup('[1854,464]'),
        L.marker(rc.unproject(gameToMap(mappingArr, [2002, 3539])), {icon: mobaoIcon}).bindPopup('[1854,464]')
    ]);
    map.addLayer(layerBounds);


    // set markers on click events in the map
    map.on('click', function(event){
        // to obtain raster coordinates from the map use `project`
        var coord = rc.project(event.latlng);
        // to set a marker, ... in raster coordinates in the map use `unproject`
        var marker = L.marker(rc.unproject(coord))
            .addTo(layerBounds);
        marker.bindPopup('[' + Math.floor(coord.x) + ',' + Math.floor(coord.y) + ']')
            .openPopup()
    });

    return layerBounds
}

/**
 * layer using geoJson data for countries adding a circle marker
 */
function layerCountries(map, rc){
    var layerCountries = L.geoJson(window.countries, {
        // correctly map the geojson coordinates on the image
        coordsToLatLng: function(coords){
            return rc.unproject(coords);
        },
        // add a popup content to the marker
        onEachFeature: function(feature, layer){
            if(feature.properties && feature.properties.name){
                layer.bindPopup(feature.properties.name);
            }
        },
        pointToLayer: function(feature, latlng){
            return L.circleMarker(latlng, {
                radius: 8,
                fillColor: '#800080',
                color: '#D107D1',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            })
        }
    });
    map.addLayer(layerCountries);
    return layerCountries;
}

/**
 * layer with red markers
 */
function layerGeo(map, rc){
    var imgDir = 'images/';
    var redMarker = L.icon({
        iconUrl: imgDir + 'marker-icon-red.png',
        iconRetinaUrl: imgDir + 'marker-icon-red-2x.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [-0, -31],
        shadowUrl: imgDir + 'marker-shadow.png',
        shadowSize: [41, 41],
        shadowAnchor: [14, 41]
    });
    var layerGeo = L.geoJson(window.geoInfo, {
        // correctly map the geojson coordinates on the image
        coordsToLatLng: function(coords){
            return rc.unproject(coords)
        },
        // add a popup content to the marker
        onEachFeature: function(feature, layer){
            if(feature.properties && feature.properties.name){
                layer.bindPopup(feature.properties.name)
            }
        },
        pointToLayer: function(feature, latlng){
            return L.marker(latlng, {
                icon: redMarker
            })
        }
    });
    map.addLayer(layerGeo);
    return layerGeo
}

/**
 * layer drawing a polygon
 */
function layerPolygon(map, rc){
    var points = window.polygon.map(function(point){
        return rc.unproject([point.x, point.y])
    });
    var layerPolygon = L.polygon([points]);
    map.addLayer(layerPolygon);
    return layerPolygon
}