maptilersdk.config.apiKey = map_key;
const map = new maptilersdk.Map({
  container: "map", // container's id or the HTML element in which the SDK will render the map
  style: maptilersdk.MapStyle.STREETS,
  center: coordinates, // starting position [lng, lat]
  zoom: 14, // starting zoom
});
const marker = new maptilersdk.Marker().setLngLat(coordinates).addTo(map);

console.log(coordinates);
