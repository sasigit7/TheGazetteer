//Enabling map
let map = L.map("map", {
  attributionControl: false
}).setView([0, 0], 1.5);
//Adding basemap
let layer = new L.StamenTileLayer("toner");
map.addLayer(layer);

//Declaring countries table
let countries_tab =
  "<table class='table table-hover' style='font-family:Georgia, arial,helvetica;'><thead class='glowing-btn'><tr><th scope='col' >Scroll & Select A Country</th></tr></thead><tbody>";

//Declaring country_boundry
let district_boundary = new L.geoJson();
district_boundary.addTo(map); //adding country_boundry to map

//Loading data using ajax
$.ajax({
  dataType: "json",
  url: "data/countryBorders.geo.json",
  success: function (data) {
    $(data.features).each(function (key, data) {
      district_boundary.addData(data); //adding each feature to district_boundary

      countries_tab +=
        '<tr><td onClick=zoomTo("' +
        data.properties.iso_a2 +
        '")>' +
        data.properties.name +
        "</td></tr>"; // adding countries in the list
    });

    countries_tab += "</tbody></table>";
    $("#country_list").html(countries_tab);
    district_boundary.setStyle(polystyle); //setting style for country boundries
  },
}).error(function () {});

//Define style
function polystyle(feature) {
  return {
    fillColor: "green",
    weight: 2,
    opacity: 1,
    color: "white", //Outline color
    fillOpacity: 0.7,
  };
}

//Setting and adding highlight info
let highlight_boundary = new L.geoJson();
highlight_boundary.addTo(map);

//Higlight style
function highstyle(feature) {
  return {
    fillColor: "blue",
    weight: 2,
    opacity: 1,
    color: "white", //Outline color
    fillOpacity: 0.7,
  };
}

//Making to zoom on a country
function zoomTo(iso) {
  country = iso; //$(e).html();
  district_boundary.eachLayer(function (layer) {
    if (layer.feature.properties.iso_a2 == country) {
      highlight_boundary.clearLayers();
      highlight_boundary.addData(layer.feature);
      map.fitBounds(layer.getBounds()); //zoom to country
      highlight_boundary.setStyle(highstyle); // make highlight
      LoadCountryInfo(country); //loading country info
    }
  });
}