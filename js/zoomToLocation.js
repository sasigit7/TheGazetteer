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
      const coords = [latitude, longitude];

      // The jQuery BlockUI Plugin lets you simulate synchronous behavior when using AJAX, without locking the browser
      // When activated, it will prevent user activity with the page (or part of the page) until it is deactivated.
      //BlockUI adds elements to the DOM to give it both the appearance and behavior of blocking user interaction.
      // http://jquery.malsup.com/block/
      $.blockUI({
        // Blocking with a Gif & a custom message:
        message: '<h1><img src="star.gif" />Loading.....</h1>',
      });

      // AJAX is the art of exchanging data with a server, and update parts of a web page - without reloading the whole page.
      // $.ajax() performs an async AJAX request.

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
      // Error callback function
      alert("Could not get your position!");
    }
  );
}
