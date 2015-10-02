
// measure_avgs = [{"401":72.9},
//   {"402":45.0},
//   {"403":50.7},
//   {"406":37.5},
//   {"407":45.3},
//   {"409":12.6},
//   {"410":38.6},
//   {"419":79.9},
//   {"424":71.3},
//   {"425":16.7},
//   {"434":26.3}
// ];

// var measure_codes = [424,425,434,401,403,406,409,407,402,410,419];

var measure_codes = 
	{"401":{
		perc_avg: 72.9,
		description: 'Percent of residents whose need for help with activities of daily living has increased*'},
  "402":{
		perc_avg:45.0},
  "403":{
		perc_avg:50.7},
  "406":{
		perc_avg:37.5},
  "407":{
		perc_avg:45.3},
  "409":{
		perc_avg:12.6},
  "410":{
		perc_avg:38.6},
  "419":{
		perc_avg:79.9},
  "424":{
		perc_avg:71.3},
  "425":{
		perc_avg:16.7},
  "434":{
		perc_avg:26.3}};

function calc_score(perc, measure_code){

	var ret_val = 0

	switch(measure_code){
		case 425: //ulcers
			if(perc ==0){
				ret_val = 100
			}else if(perc<25){ 
				ret_val = 25;
			}else if(perc<=50){ 
				ret_val = 50;
			}else if(perc<=75){ 
				ret_val = 75;
			}
			break;

		case 409: //restrained
			if(perc ==0){
				ret_val = 100
			}else if(perc<50){ 
				ret_val = 40;
			}else {
				ret_val = 60;
			}
			break;

		case 434: //newly antipsychotic
			if(perc <=20){
				ret_val = 100
			}else if(perc<=40){ 
				ret_val = 80;
			}else if(perc<=60){ 
				ret_val = 40;
			}else if(perc<=80){ 
				ret_val = 40;
			}else if(perc>80){ 
				ret_val = 20;
			}
			break;

		case 419: //long term receive antipsychotic
			if(perc <=20){
				ret_val = 20
			}else if(perc<=40){ 
				ret_val = 40;
			}else if(perc<=60){ 
				ret_val = 60;
			}else if(perc<=80){ 
				ret_val = 80;
			}else if(perc>80){ 
				ret_val = 100;
			}
			break;

		default:
			if(perc <=20){
				ret_val = 20
			}else if(perc<=40){ 
				ret_val = 40;
			}else if(perc<=60){ 
				ret_val = 60;
			}else if(perc<=80){ 
				ret_val = 80;
			}else if(perc>80){ 
				ret_val = 100;
			}		
	}
	
	return ret_val;
};

