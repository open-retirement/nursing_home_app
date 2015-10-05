 var exports = {}; // (*)

function address_search_click(){
  var zipcode = document.getElementById("Address").value;
   var base_url = "https://data.medicare.gov/resource/4pq5-n9py.json";
   var within_qry = "?$select=location&provider_zip_code="+zipcode;
   console.log(base_url + within_qry);
   $.ajax({
       dataType:"json",
       url:base_url+within_qry,
       success:function(data){
           var loc = data;
           ///var obj = JSON.parse(loc);

           if (data!=null && data.length>0){
            callGeoSearch(loc[0].location.longitude, loc[0].location.latitude);
           }else{
            alert("No Results Returned"); 
           }
           
           
       } 
           //alert(+" ");
           callGeoSearch(loc[0].location.longitude, loc[0].location.latitude);
       }

   });

}

function callGeoSearch(longitude, latitude, map){
      var base_url = "https://data.medicare.gov/resource/4pq5-n9py.json";
      var within_qry = "?$where=within_circle(location," + latitude + "," + longitude +",10000)";
      console.log(base_url + within_qry);
      var geoJson = new L.geoJson(null, {onEachFeature:onEachNursingHome});
      geoJson.addTo(map);
   //   document.getElementById("map").style.visiblity = 'visible';
     // document.getElementsByClassName("map").style;
      $.ajax({
         dataType: "json",
          url: base_url + within_qry,
          success: function(data) {
            var geojson_features = convertJsonToGeoJson(data)
            $(geojson_features.features).each(function(key, data) {
            geoJson.addData(data);
            });
            if(geoJson.getBounds().isValid()){
              map.fitBounds(geoJson.getBounds().pad(0.5));
            }
            var col_names = [ "provider_name", "provider_address", "quality_of_care_points", "quality_of_care_stars"]

            // var measure_codes = [424,425,434,401,403,406,409,407,402,410,419];
            // var measure_codes = [410,424];
            
          getQualityofCare(data, col_names, measure_codes, "#results");
            var tbl_body = formatTable(col_names,data);
            // $("#results").html(tbl_body);
            // $("#results").append(tbl_body);
            }
          
      }).error(function() {});
}


function formatRow(col_names, json_data){
  var odd_even = "list-group-item";
  var id_i =1;
  var tbl_row = "";
  $.each(col_names, function(k , v) {
    tbl_row += "<p >"+json_data[v]+"</p>";
  })

  return "<a id=\"div"+id_i+"\" href=#\"btn\"  class=\""+( odd_even )+"\">"+tbl_row+"</a>";
}

function formatTable(col_names, json_data_arr){
    var tbl_body = "";
    var header_row ="";
    var id_i =1;


    var odd_even = "list-group-item";
    $.each(json_data_arr, function(index, value) {
       var tbl_row = "";
          $.each(col_names, function(k , v) {
            if(v=="id_nomatter"){
                // add link to get media for this location
              var href_val = '/media?id=' +value[v] ;
              tbl_row += '<td><a href=' +href_val +' onclick="">'+value[v]+'</a></td>';
                    // tbl_row += '<td><a href=# onclick="callLocationMedia("' + value[v] +')>'+value[v]+'</a></td>';
            }else{
              tbl_row += "<p >"+value[v]+"</p>";

            }
          })

        tbl_body += "<a id=\"div"+id_i+"\" href=#\"btn\"  class=\""+( odd_even )+"\">"+tbl_row+"</a>";
        //odd_even = !odd_even;
        id_i +=1;

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
