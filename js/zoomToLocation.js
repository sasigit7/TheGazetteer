if (navigator.geolocation) {
  // Check if this is available in older browsers
  navigator.geolocation.getCurrentPosition(
    function (position) {
      // Success callback function
      //console.log(position);
      //const latitude = position.coords.latitude;
      const { latitude } = position.coords; // Destructuring
      //const longitude = position.coords.longitude;
      const { longitude } = position.coords; // Destructuring
      // console.log(latitude, longitude);
      // console.log(`https://www.google.co.uk/maps/@${latitude},${longitude}`);

      // Set latitude and longitude values dynamically by storing in an array variable.
      // https://i.stack.imgur.com/FhHRx.gif
      const coords = [latitude, longitude];
      $.blockUI({
        message: '<h1><img src="https://i.stack.imgur.com/FhHRx.gif" /></h1>',
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
          $.unblockUI();
          json = JSON.parse(json);
          console.log(json);
          const country_code = json.countryCode;
          $("#country_list").val(country_code).trigger("change");
        },
      });
    },
    function () {
      // Error callback function
      alert("Could not get your position!");
    }
  );
}
