// Description: A simple scale control that shows the scale of the current center of screen in metric (m/km) and imperial (mi/ft) systems
// Source: https://leafletjs.com/reference-1.7.1.html#control-scale
// Implementation: Added Scale at the bottom left of the map.
L.control.scale().addTo(map);

// Description: A basic zoom control with two buttons (zoom in and zoom out)
// Source: https://leafletjs.com/reference-1.7.1.html#control-zoom
// Implementation: Setting Zoom control (+, -) on the top right of the map
map.zoomControl.setPosition("topright");

//Ajax for loading the country info
function LoadCountryInfo(name) {
  if ($("#country_info").css("left") !== "5px") {
    $("#country_info").animate({ left: "5px" }, 1000);
    $(".pull_country_info_popup").animate({ left: "-40px" }, 1000);
  }
  $("#country_info").block({
<<<<<<< HEAD
    message: '<img src="globe.gif" />',
=======
    message: '<img src="64.gif" />',
>>>>>>> b47a037db0b104c013a4f0d6f7c2a2e7b844834f
  });

  $.ajax({
    url: "php/getData.php",
    type: "POST",
    data: "country=" + name,
    success: function (response) {
      $("#country_info").unblock();
      let output = $.parseJSON(response);
      // let output = JSON.parse(response);
      // console.log(output);
      $("#country_info").html(output.countryHtml); //Adding demographic information of displayed country
      $("#covid_data").html(output.covid_data); // Sending data to Covid Modal
      $("#weather_data").html(output.weather_data); // Sending data to Weather Modal
      $("#news_data").html(output.news_data); // Sending data to News Modal
      $("#country_info").height($("#country_info .card").height());
      $("#country_info .card-body").height($(window).height() - 71 - 10);
    },
  });
}

// Pop up hide
function hide_popup() {
  $("#country_info").animate({ left: "-999px" }, 1000);
  $(".pull_country_info_popup").animate({ left: "0" }, 1000);
}

// Pop up Show
function show_popup() {
  $("#country_info").animate({ left: "5px" }, 1000);
  $(".pull_country_info_popup").animate({ left: "-40px" }, 1000);
}
