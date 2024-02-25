/* eslint-disable */


export const displayMap = (locations) => {
    mapboxgl.accessToken = 'pk.eyJ1IjoicnVubmluZy1wZW5ndWluIiwiYSI6ImNsdDBpN2gyajB6NHoyaXBxejd5eG05MjgifQ.gin-NurzQcQiRPV7wurf6A'; // put access token back to test (but don't commit to source control)
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/running-penguin/clss8m23100b601phgpexbb6k',
        scrollZoom: false,
        center: [-118.113491, 34.111745],
        zoom: 10
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach(loc => {
        // Create marker
        const el = document.createElement('div');
        el.className = 'marker';


        // Add marker
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom'
        })
            .setLngLat(loc.coordinates)
            .addTo(map);

        // Add popup
        new mapboxgl.Popup({
            offset: 30
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);

        // Extend map bounds to include current location
        bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });

}
