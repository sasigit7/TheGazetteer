// Description: A simple scale control that shows the scale of the current center of screen in metric (m/km) and imperial (mi/ft) systems
// Source: https://leafletjs.com/reference-1.7.1.html#control-scale
// Implementation: Added Scale at the bottom left of the map.
L.control.scale().addTo(map);

// Description: A basic zoom control with two buttons (zoom in and zoom out)
// Source: https://leafletjs.com/reference-1.7.1.html#control-zoom
// Implementation: Setting Zoom control (+, -) on the top right of the map
map.zoomControl.setPosition("topright");

// Description: A Leaflet control that search markers/features location by custom property.
// Source:  https://github.com/stefanocudini/leaflet-search
let controlSearch = new L.Control.Search({
  position: "topleft",
  layer: district_boundary, // name of the layer
  initial: true, // search elements only by initial text
  marker: false, // false for hide
  textPlaceholder: "Search...",
  propertyName: "name",
});

// This function will execute, when a country is searched and found on control search bar
controlSearch.on("search:locationfound", function (e) {
  district_boundary.eachLayer(function (layer) {
    if (layer.feature.properties.name == e.text) {
      let iso_a2 = layer.feature.properties.iso_a2;
      highlight_boundary.clearLayers(); //Clears previously selected country
      highlight_boundary.addData(layer.feature); //Adding newly selected country
      map.fitBounds(layer.getBounds()); //Zooming in to country selected
      highlight_boundary.setStyle(highstyle); //Setting style to selected one
      LoadCountryInfo(iso_a2); //Calling LoadCountryInfo function from below to get the country's info
    }
  });
});

// Implementation: Added Search control bar for searching countries on the top left of the map
map.addControl(controlSearch);

//Ajax for loading the country info
function LoadCountryInfo(name) {
  $.ajax({
    url: "php/getData.php",
    type: "POST",
    data: "country=" + name,
    success: function (response) {
      var output = $.parseJSON(response);
      // let output = JSON.parse(response);
      // console.log(output);
      $("#country_info").html(output.countryHtml); //Adding demographic information of displayed country
      $("#covid_data").html(output.covid_data); // Sending data to Covid Modal
      $("#weather_data").html(output.weather_data); // Sending data to Weather Modal
      $("#news_data").html(output.news_data); // Sending data to News Modal
    },
  });
}
