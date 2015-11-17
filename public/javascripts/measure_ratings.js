
function getQualityofCare(providers, col_names, measure_codes, divName){

  getIllinoisMeasures(measure_codes, function(data, err){
    console.log("check this data " );
	for(prov in providers){
	    calcQualityOfCare(providers[prov], measure_codes,function(data, err){
	      console.log("check it");
	      var tbl_row = formatRow(col_names,data);
	      $(divName).append(tbl_row)
	    })
	  }
   })
  

}


function login_addrcheck(){
var username  = document.getElementById("user").value;
var password = document.getElementById("pass").value;
if(username === "kashyap" && password === "kashyap")
{
	document.getElementById("map").style.visibility = "visible";
	document.getElementById("login-container").load("layout.jade");
}



function getIllinoisMeasures(measure_codes, func){
   // this 
   var base_url = "https://data.medicare.gov/resource/djen-97ju.json";
      var parameters = "?$order=three_quarter_average&provider_state=IL&measure_code=";
//https://data.medicare.gov/resource/djen-97ju.json?&measure_code=%27424%27&provider_state=%27IL%27&$order=three_quarter_average 

   var promises =[];
    for(code in measure_codes){
      // console.log(base_url + within_qry + measure_codes[code]);
      promises.push ($.get(base_url + parameters + code))
    }

    $.when.apply($, promises).then(function() {
      // var responses = $.map(arguments, function(args) { return args[0]; }),
      // spit = responses;

      il_measure_map ={};
      var v = 0;
      for(i in arguments){
        // il_measure_map[arguments[i][0][0].measure_code] = arguments[i][0];
        measure_codes[arguments[i][0][0].measure_code].state_data = arguments[i][0];
      }
      func(measure_codes, null);
    }, function() {
        console.log("error");
        func(null, "error getting response from socrata services");
    });
}

function calcQualityOfCare(provider, measure_codes, func){
  // https://data.medicare.gov/resource/djen-97ju.json

// have to request 2 kinds of data, measure codes across illinois and measure codes for
  // var measure_codes = [424,425,434,401,403,406,409,407,402,410,419];

    console.log("quality of care [" + provider.federal_provider_number + "]");
    var base_url = "https://data.medicare.gov/resource/djen-97ju.json";
      var parameters = "?federal_provider_number=" + provider.federal_provider_number + "&measure_code=";
      //https://data.medicare.gov/resource/djen-97ju.json?$limit=10&measure_code=401&federal_provider_number=145881
    // feature.properties.provnum 
    // https://data.cityofchicago.org/resource/6zsd-86xi.json?$where=primary_type in('ARSON', 'NARCOTICS', 'RITUALISM')
    
    var promises =[];
    for(code in measure_codes){
      // console.log(base_url + within_qry + measure_codes[code]);
      promises.push ($.get(base_url + parameters + code))
    }
      
    $.when.apply($, promises).then(function() {
      var responses = $.map(arguments, function(args) { return args[0]; }),
      spit = responses;
      var points = sum_quality_of_care(responses, measure_codes);
      console.log(points);
      provider["quality_of_care_measure_results"] = responses;
      provider["quality_of_care_points"] = points;
      provider["quality_of_care_stars"] = convert_points_to_stars(points);

       func(provider, null);
    }, function() {
        console.log("error");
    });
 }

   convert_points_to_stars = function(points){
// function convert_points_to_stars(points){
    var stars = 0;

    if(points>=760){
      stars = 5;
    }else if(points >=690){
      stars = 4;
    }else if(points >=629){
      stars = 3;
    }else if(points >=545){
      stars = 2;
    }else if(points >=225){
      stars = 1;
    }

      // 224.9 points and below = zero stars
      // 225 - 544.9 points = 1 star
      // 545 - 628.9 points = 2 stars
      // 629 - 688.9 points = 3 stars
      // 690 - 758.9 points = 4 stars
      // 760 points and above = 5 stars

    return stars;
}

function sum_quality_of_care(dataArr, measure_codes){

  var points = 0;

  for(data in dataArr){   
  	 if(dataArr[data].hasOwnProperty('three_quarter_average')){
  	 	measure_value = Number(dataArr[data].three_quarter_average);
  	 }else{ //if there is no value in the data, use the state average
  	 	measure_value = measure_codes[dataArr[data].measure_code].perc_avg;
  	 }
  	 var percentile = 100*calcPercentile(measure_codes[dataArr[data].measure_code].state_data, measure_value);
     points += calc_score(percentile, dataArr[data].measure_code); //actually need to convert to points depending on measure score
  }
 
  return points;
}



function calcPercentile(measure_data, value){
  // find out what its place in the order is

  var arr = measure_data.filter(function(el){
    return el.hasOwnProperty('three_quarter_average');
  });

  var num_homes = arr.length;
  var searchIndex = parseInt(num_homes/2);
  var percentile =1;
  for(n in arr){
    if(value <= Number(arr[n].three_quarter_average)){
      // need to interpolate between n and n+1
      if(n < arr.length){
        var p_n = n/num_homes;
        var p_n1 = (n+1)/num_homes;
        var diff = 0;
        if(arr[Number(n)+1].three_quarter_average - arr[n].three_quarter_average !=0){
           diff = (value-arr[n].three_quarter_average)/(arr[Number(n)+1].three_quarter_average - arr[n].three_quarter_average);
        }
        
        percentile = n/num_homes + (p_n1-p_n)*diff;
        break;
      }
    }
  }
  return percentile;

}

// module.exports.calcPercentile = calcPercentile;
