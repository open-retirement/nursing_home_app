var census_sdk_key = '4ef6c883a1c176cab8018f754fe64ee4d95df38e';

function callGeoSearch(){
     var geoJson = new L.geoJson(null, {onEachFeature:onEachNursingHome});
      geoJson.addTo(Window.map);

      $.ajax({
         dataType: "json",
          url: "sample_nh.json",
          success: function(data) {
            $(data.features).each(function(key, data) {
            geoJson.addData(data);
            });
            Window.map.fitBounds(geoJson.getBounds());
          }
      }).error(function() {});
}

function callCensusGeocode(){
   var street = $('#street');
   var city = $('#city');
   var state = $('#state');

        var request = {
            address: {
                street: street.val(),
                city: city.val(),
                state: state.val()
            },

            variables: [
                "income",
                "population"
            ],
                level: 'tract'
            }
    census.APIRequest(request, function(response) {
        var output = $('#output');
            output.empty();
            output.append("Coordinates: " + response.lat + ", " + response.lng + " <br/>");
            output.append("Median Income: " + response.data[0].income + "<br/>");
            output.append("Population: " + response.data[0].population + " </br>");
            output.append("<br/><br/><br/>Here's the address object we sent and what matched:<br/><br/>");
            output.append("Address: " + JSON.stringify(response.address, null, 4) + "<br/>");
    });
}

function onEachNursingHome(feature, layer){
  
    var list = "<dl><dt>Id:</dt>"
           + "<dd>" + feature.properties.provnum + "</dd>"
            + "<dt>Name: </dt>"
           + "<dd>" + feature.properties.provname + "</dd>"
           + "<dt>Address:  </dt>"
           + "<dd>" + feature.properties.address + "</dd>"

    layer.bindPopup(list);
    // layer.bindPopup(feature.properties.name);
     
}