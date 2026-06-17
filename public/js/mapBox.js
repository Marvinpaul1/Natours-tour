/* eslint-disable */

export const displayMap = (locations) => {
  const mapElement = document.getElementById('map');
  if (mapElement) {
    // 2. Parse the location data out of the dataset attributes
    const tourLocations = JSON.parse(mapElement.dataset.locations);

    if (window.mapInstance) {
      window.mapInstance.remove();
    }
    // 3. Initialize the Leaflet map container
    const map = L.map('map', { zoomControl: false });
    window.mapInstance = map;

    // 4. Mount the OpenStreetMap visual tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const points = [];

    // 5. Loop through and plot the tour markers
    tourLocations.forEach((loc) => {
      // Reverse coordinates from GeoJSON [lng, lat] to Leaflet [lat, lng]
      const reversedCoords = [loc.coordinates[1], loc.coordinates[0]];
      points.push(reversedCoords);

      // Build the marker instance
      const marker = L.marker(reversedCoords).addTo(map);

      // Bind and show the popup matching Jonas's CSS design
      marker
        .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, {
          autoClose: false,
          className: 'map-popup',
        })
        .openPopup();
    });

    // 6. Autofit view frame to map markers beautifully
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, {
      padding: [150, 150],
    });
  }
};
