let country_boundary;
let map;
$(document).ready(function () {
  $("#country_info .card-body").css('max-height',($(window).height() - 71 - 10)+'px');
  map = L.map("map", {
    attributionControl: false,
  }).setView([0, 0], 1.5);

  L.control.scale().addTo(map);
  map.zoomControl.setPosition("topright");

  let Esri_WorldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
  });
  map.addLayer(Esri_WorldStreetMap);

  country_boundary = new L.geoJson();
  country_boundary.addTo(map);
  // get_user_location();
  get_country_codes();
  get_user_location();

});

function get_country_codes() {
  $.ajax({
    url:"php/getCountriesCode.php?",
    type: "GET",
    success: function (json) {
      let countries = JSON.parse(json);
      let option = "";
      for (country of countries) {
        option += '<option value="' +
            country[1] +
            '">' +
            country[0] +
            "</option>";
      }
      $("#country_list").append(option).select2();
    }
  });
}

function get_country_border(country_code) {
  $.ajax({
    url:"php/getCountryBorder.php",
    type:"GET",
    data:{'country_code':country_code},
    success: function (json) {
      json = JSON.parse(json);
      country_boundary.clearLayers();
      country_boundary.addData(json).setStyle(polystyle());
      map.fitBounds(country_boundary.getBounds());
    }
  });
}

function polystyle() {
  return {
    fillColor: "brown",
    weight: 2,
    opacity: 0.9,
    color: "white", //Outline color
    fillOpacity: 0.7,
  };
}

let country_code_global = "";
function zoomToCountry(country_code) {
  if (country_code == "") return;
  country_name = $("#country_list option:selected" ).text();
  country_code_global = country_code;
  get_country_border(country_code);
  get_country_info(country_code);
}

function get_user_location() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        function (position) {
          const { latitude } = position.coords;
          const { longitude } = position.coords;
          const coords = [latitude, longitude];
          $.blockUI({
            message: '<h1><img src="star.gif" />Loading.....</h1>',
          });
          $.ajax({
            url:
                "php/getCountryCodeFromLatLng.php?lat=" +
                latitude +
                "&lng=" +
                longitude +
                "&username=ShashAPI",
            type: "GET",
            success: function (json) {
              $.unblockUI(); // To unblock the page:
              json = JSON.parse(json); // Parse the string data to JavaScript object
              // console.log(json);
              const country_code = json.countryCode;
              $("#country_list").val(country_code).trigger("change");
            },
          });
        },
        function () {
          alert("Could not get your position!");
        }
    );
  }
}

let country_name; let lat; let lng;
function get_country_info(country_code) {

  if ($("#country_info").css("left") !== "5px") {
    $("#country_info").animate({ left: "5px" }, 1000);
    $(".pull_country_info_popup").animate({ left: "-40px" }, 1000);
  }
  $("#country_info").block({
    message: '<img src="globe.gif" />',
  });

  $.ajax({
    url: "php/getCountryInfo.php",
    type: "GET",
    data:{'country_code':country_code},
    success: function (response) {
      $("#country_info").unblock();
      let details = $.parseJSON(response);
      console.log(details);
      lat = details.latlng[0];
      lng = details.latlng[1];
      $("#country_name").html(country_name);
      $("#country_capital").html(details.capital);
      $("#country_population").html(details.population);
      $("#country_image").attr('src',details.flag);
      $("#country_currency").html(details.currencies[0]['name']);
      $("#country_wikipedia").attr('href','https://en.wikipedia.org/wiki/'+details.name);
    }
  });
}

function hide_popup() {
  $("#country_info").animate({ left: "-999px" }, 1000);
  $(".pull_country_info_popup").animate({ left: "0" }, 1000);
}

function show_popup() {
  $("#country_info").animate({ left: "5px" }, 1000);
  $(".pull_country_info_popup").animate({ left: "-40px" }, 1000);
}

function get_covid_data(){
  $.blockUI({message: '<img src="globe.gif" />'});
  $.ajax({
    url: "php/getCovidInfo.php",
    type: "GET",
    data:{'country_code':country_code_global},
    success: function (response) {
      let details = $.parseJSON(response);
      $("#covid_total_cases").html(details.cases);
      $("#covid_active").html(details.active);
      $("#covid_recovered").html(details.recovered);
      $("#covid_deaths").html(details.deaths);
      $("#covid_todayCases").html(details.todayCases);
      $("#covid_todayRecovered").html(details.todayRecovered);
      $("#covid_todayDeaths").html(details.todayDeaths);
      $("#covid_activePerOneMillion").html(details.activePerOneMillion);
      $("#covid_recoveredPerOneMillion").html(details.recoveredPerOneMillion);
      $.unblockUI();
      $("#coronoModal").modal();
    }
  });
}

function get_weather_data(){
  $.blockUI({message: '<img src="globe.gif" />'});
  $.ajax({
    url: "php/getWeatherInfo.php",
    type: "GET",
    data:{'lat':lat, 'lng': lng},
    success: function (response) {
      let details = $.parseJSON(response);
      console.log(details);
      $("#weather_data table tbody").html("");
      for(let i=0; i<details['daily'].length;i++){
        const d = details['daily'][i];
        const date = new Date(d['dt'] * 1000).toLocaleDateString("en-US");
        const temp_day = d['temp']['day'];
        const temp_min = d['temp']['min'];
        const temp_max = d['temp']['max'];
        const temp_night = d['temp']['night'];
        const temp_eve = d['temp']['eve'];
        const temp_morn = d['temp']['morn'];
        const pressure = d['pressure']+' hPa';
        const humidity = d['humidity']+'%';
        const cloud_percentage = d['clouds']+'%';
        const wind_speed = d['wind_speed']+'meter/sec';
        const wind_degree = d['wind_deg']+'degrees';

        const row = "<tr><td>"+date+"</td><td>"+temp_day+"</td><td>"+temp_min+"</td><td>"+temp_max+"</td><td>"+temp_night+"</td><td>"+temp_eve+"</td>" +
            "<td>"+temp_morn+"</td><td>"+pressure+"</td><td>"+humidity+"</td><td>"+cloud_percentage+"</td><td>"+wind_speed+"</td><td>"+wind_degree+"</td></tr>";
        $("#weather_data table tbody").append(row);
      }
      $.unblockUI();
      $("#weatherModal").modal();
    }
  });
}

function get_news_data() {
  $("#news_data").html("");
  $.blockUI({message: '<img src="globe.gif" />'});
  $.ajax({
    url: "php/getNewsInfo.php",
    data: {"country_name": country_name},
    method: "GET",
    success: function (response) {
      response = JSON.parse(response);
      console.log(response);
      const data = response['articles'];
      for(let i=0;i<data.length;i++){
        $("#news_data").append(get_news_card(data[i]));
      }
      $.unblockUI();
      $("#newsModal").modal();
    }
  })
}

function get_news_card(data) {
  const card = '<div class="card" style="width: 20rem;"> <img class="card-img-top" src="'+data['urlToImage']+'" alt="News Image"> <div class="card-body"> <h5 class="card-title">'+data['author']+'</h5> <p class="card-text">'+data['title']+'</p> <a href="'+data['url']+'" target="_blank" class="btn btn-primary">Details</a> </div> </div>'
  return card
}