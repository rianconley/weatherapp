$(function() {

  getLocation();



  var getCityState = function(latlong) {
    return $.ajax({
      url: "http://api.wunderground.com/api/61102d59f78ea2dd/geolookup/q/" + latlong + ".json"
    })
  }
  
  var getPhotos = function(query) {
    return   $.ajax({
    type: "GET",
    dataType: "jsonp",
    url: "https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q="+query.city+"%20"+query.state+"&imgsz=xxlarge"
    })
  }
 

  var getCityTemp = function(state, city) {
    return $.ajax({
      url: "http://api.wunderground.com/api/61102d59f78ea2dd/conditions/q/" + state + "/" + city + ".json"
    })
  }
  


  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  function getWeatherInfo(location) {
    getCityTemp(location.state, location.city).done(function(ret) {
      console.log(ret);
       $("#icondesc").html(ret.current_observation.icon);
       $("#iconimg").html("<img src='"+ret.current_observation.icon_url+"'>");
      $("#city").html(ret.current_observation.display_location.full);
      $("#temp").html(ret.current_observation.temperature_string);
    })

  }

  function showPosition(position) {
    latlong = position.coords.latitude + "," +position.coords.longitude;

    getCityState(latlong).done(function(info) {
       getPhotos(info.location).done(function(photos){
        //console.log(photos);
       $("#background").css({"background-image":'url("' +photos.responseData.results[0].url+'")'})
      })
      getWeatherInfo(info.location);
      var img_url = "http://maps.googleapis.com/maps/api/staticmap?center=" + latlong + "&zoom=13&size=400x300&sensor=false";
      document.getElementById("map").innerHTML = "<img src='" + img_url + "'>";
    });

  }

  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        x.innerHTML = "User denied the request for Geolocation."
        break;
      case error.POSITION_UNAVAILABLE:
        x.innerHTML = "Location information is unavailable."
        break;
      case error.TIMEOUT:
        x.innerHTML = "The request to get user location timed out."
        break;
      case error.UNKNOWN_ERROR:
        x.innerHTML = "An unknown error occurred."
        break;
    }
  }

  $("#searchLoc").click(function(evt){

    var geocoder = new google.maps.Geocoder();
      var address =$("#search").val();
      $("#search").val("");
      $("#yourLoc").hide();

      geocoder.geocode( { 'address': address}, function(results, status) {

      if (status == google.maps.GeocoderStatus.OK) {
          var latlong = results[0].geometry.location.lat() +","+ results[0].geometry.location.lng();

           getCityState(latlong).done(function(info) {
           getPhotos(info.location).done(function(photos){
            //console.log(photos);
           $("#background").css({"background-image":'url("' +photos.responseData.results[0].url+'")'})
          })
          getWeatherInfo(info.location);
          var img_url = "http://maps.googleapis.com/maps/api/staticmap?center=" + latlong + "&zoom=14&size=400x300&sensor=false";
          document.getElementById("map").innerHTML = "<img src='" + img_url + "'>";
        });
          } 
      }); 

  })


})