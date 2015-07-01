var census_sdk_key = '4ef6c883a1c176cab8018f754fe64ee4d95df38e';

function address_search_click(){
  
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
            var col_names = ["provnum", "provname", "provaddress"]

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
        callGeoSearch(response.lng , response.lat);
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