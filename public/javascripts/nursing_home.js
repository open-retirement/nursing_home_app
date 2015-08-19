function address_search_click(zipcode){
	var base_url = "https://data.medicare.gov/resource/4pq5-n9py.json";
	var within_qry = "?$where=within_circle(location," + latitude + "," + longitude +",2000)";

  callGeoSearch(-87.666214, 42.019814);
}

function callGeoSearch(longitude, latitude){
      var base_url = "https://data.medicare.gov/resource/4pq5-n9py.json";
      var within_qry = "?$where=within_circle(location," + latitude + "," + longitude +",2000)";
      var geoJson = new L.geoJson(null, {onEachFeature:onEachNursingHome});
      geoJson.addTo(Window.map);

      $.ajax({
         dataType: "json",
          url: base_url + within_qry,
          success: function(data) {
            var geojson_features = convertJsonToGeoJson(data)
            $(geojson_features.features).each(function(key, data) {
            geoJson.addData(data);
            });
            if(geoJson.getBounds().isValid()){
              Window.map.fitBounds(geoJson.getBounds().pad(0.5));
            }
            var col_names = ["federal_provider_number", "provider_name", "provider_address"]

             //    props.provnum = features[feat].federal_provider_number;
        // props.provname = features[feat].provider_name;
        // props.address
            var tbl_body = formatTable(col_names,data);
            $("#resultsTable").html(tbl_body);

          }
      }).error(function() {});
}

function formatTable(col_names, json_data_arr){
    var tbl_body = "";
    var header_row ="";
    for(var columnNum in col_names){
        header_row += "<th>"+ col_names[columnNum] + "</th>";
    }
    tbl_body = "<tr>" + header_row + "</tr>";

    var odd_even = false;
    $.each(json_data_arr, function(index, value) {
       var tbl_row = "";
          $.each(col_names, function(k , v) {
            if(v=="id_nomatter"){
                // add link to get media for this location
              var href_val = '/media?id=' +value[v] ;
              tbl_row += '<td><a href=' +href_val +' onclick="">'+value[v]+'</a></td>';
                    // tbl_row += '<td><a href=# onclick="callLocationMedia("' + value[v] +')>'+value[v]+'</a></td>';
            }else{
              tbl_row += "<td>"+value[v]+"</td>";
            }
          })

        tbl_body += "<tr class=\""+( odd_even ? "odd" : "even")+"\">"+tbl_row+"</tr>";
        odd_even = !odd_even;
    })

    return tbl_body;
}

function callGeocode(){
   var street = $('#street');
   var city = $('#city');
   var state = $('#state');
   street = street.val();
   city = city.val();
   state = state.val();
   var goog_url = "https://maps.googleapis.com/maps/api/geocode/json?address="
   var response_string = street + "+" + city + "+" + state;
   var end_string = response_string.split(' ').join('+');
   var query = goog_url + end_string;
   $.ajax({
      dataType: "json",
      url : query,
      type: 'GET',
      success : function(data) {
        var lat = data['results'][0]['geometry']['location']['lat'];
        var lng = data['results'][0]['geometry']['location']['lng'];
        var output = $('#output');
        output.empty();
        output.append("Coordinates: " + lat + ", " + lng + " <br/>");
        output.append("<br/><br/><br/>Here's the full response:<br/><br/>");
        output.append(JSON.stringify(data, null, 4) + "<br/>");
        callGeoSearch(lng, lat);
      }
    });
}

  function convertJsonToGeoJson(features){
    var geoJsonArr =[];
      for(var feat in features){
        var geoJsonfeat = {};
        geoJsonfeat.type = "Feature";
        geoJsonfeat.geometry = createPointGeom(features[feat].location.longitude, features[feat].location.latitude);
        var props = {};
        props.provnum = features[feat].federal_provider_number;
        props.provname = features[feat].provider_name;
        props.address = features[feat].provider_address;
        geoJsonfeat.properties = props;
        geoJsonArr.push(geoJsonfeat);
        // "provnum":"145126","provname":"ALDEN LINCOLN REHAB & H C CTR","address":"504 WEST WELLINGTON AVENUE"
      }
      var geoJson = {};
      geoJson.type = "FeatureCollection";
      geoJson.features = geoJsonArr;
      return geoJson
  }

function createPointGeom(longitude, latitude){
  // {"type":"Point", "coordinates": [-87.642136, 41.936554]}
  var geom = {};
  geom.type="Point";
  geom.coordinates= [longitude, latitude];

  return geom;
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
