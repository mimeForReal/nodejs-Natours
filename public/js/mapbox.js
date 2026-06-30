/*eslint-disable*/

export const displayMap = (locations) => {
  const map = new mapboxgl.Map({
    accessToken:
      'pk.eyJ1IjoibWltZWZvcnJlYWwiLCJhIjoiY21xdGdlajRqMDU2cDJzcjRxb2JieGF4dSJ9.5fo8WBMMwznIsZc3Msr7BQ',
    container: 'map',
    style: 'mapbox://styles/mimeforreal/cmqtgoaep000e01s741ou726c',
    center: [-71.06776, 42.35816], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 10, // starting zoom
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: { top: 200, bottom: 150, left: 100, right: 100 },
  });
};
